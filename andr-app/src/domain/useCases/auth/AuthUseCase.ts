// src/domain/useCases/auth/AuthUseCase.ts
import { supabase } from "@/src/data/services/supabaseClient";
import { StorageService } from "../../../data/services/storageService";
import { Usuario } from "../../models/Usuario";

export class AuthUseCase {
  async registrar(email: string, password: string, rol: "asesor_comercial" | "usuario_registrado") {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("No se pudo crear el usuario");
      if (!authData.session) {
        return {
          success: true,
          user: authData.user,
          needsConfirmation: true,
          message: "Revisa tu email para confirmar la cuenta",
        };
      }
      const { error: upsertError } = await supabase.from("usuarios").upsert(
        {
          id: authData.user.id,
          email: authData.user.email,
          rol: rol,
        },
        {
          onConflict: "id",
        }
      );
      if (upsertError) throw upsertError;
      return { success: true, user: authData.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async crearPerfil(userId: string, email: string, rol: "asesor_comercial" | "usuario_registrado") {
    try {
      const { error } = await supabase.from("usuarios").upsert(
        {
          id: userId,
          email: email,
          rol: rol,
        },
        {
          onConflict: "id",
        }
      );
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async iniciarSesion(
    email: string,
    password: string,
    recordarSesion: boolean = true
  ) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await StorageService.setItem(
        StorageService.SESSION_REMEMBER_KEY,
        recordarSesion.toString()
      );
      if (data.user && recordarSesion) {
        const usuarioCompleto = await this.obtenerUsuarioActual();
        if (usuarioCompleto) {
          await StorageService.setObject(
            StorageService.SESSION_USER_KEY,
            usuarioCompleto
          );
        }
      }
      return { success: true, user: data.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async cerrarSesion() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      await StorageService.limpiarDatosSesion();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async obtenerUsuarioActual(): Promise<Usuario | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data as Usuario;
    } catch (error) {
      console.log("Error al obtener usuario:", error);
      return null;
    }
  }

  async verificarSesionPersistente(): Promise<Usuario | null> {
    try {
      const recordarSesion = await StorageService.getItem(
        StorageService.SESSION_REMEMBER_KEY
      );
      if (recordarSesion === "false") {
        return null;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        return await this.obtenerUsuarioActual();
      }
      await StorageService.limpiarDatosSesion();
      return null;
    } catch (error) {
      console.log("Error al verificar sesión persistente:", error);
      return null;
    }
  }

  onAuthStateChange(callback: (usuario: Usuario | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const usuario = await this.obtenerUsuarioActual();
        if (!usuario && session.user) {
          console.log("Usuario autenticado pero sin perfil...");
          let rolPendiente: "asesor_comercial" | "usuario_registrado" = "usuario_registrado";
          const rolGuardado = await StorageService.getItem("pending_user_role");
          if (rolGuardado === "asesor_comercial" || rolGuardado === "usuario_registrado") {
            rolPendiente = rolGuardado;
          }
          console.log("Creando perfil con rol:", rolPendiente);
          await this.crearPerfil(
            session.user.id,
            session.user.email || "",
            rolPendiente
          );
          const usuarioCreado = await this.obtenerUsuarioActual();
          callback(usuarioCreado);
        } else {
          callback(usuario);
        }
      } else {
        callback(null);
      }
    });
  }
}