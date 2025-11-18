// src/presentation/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { StorageService } from "../../data/services/storageService";
import { Usuario } from "../../domain/models/Usuario";
import { AuthUseCase } from "../../domain/useCases/auth/AuthUseCase";

const authUseCase = new AuthUseCase();

export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  const [cargandoActualizar, setCargandoActualizar] = useState(false); // Nuevo estado

  useEffect(() => {
    verificarSesionInicial();
    const { data: subscription } = authUseCase.onAuthStateChange(
      async (user) => {
        setUsuario(user);
        setCargando(false);
        if (user) {
          const recordarSesion = await StorageService.getItem(
            StorageService.SESSION_REMEMBER_KEY
          );
          if (recordarSesion !== "false") {
            await StorageService.setObject(
              StorageService.SESSION_USER_KEY,
              user
            );
          }
        }
      }
    );
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const verificarSesionInicial = async () => {
    try {
      const usuarioPersistente = await authUseCase.verificarSesionPersistente();
      if (usuarioPersistente) {
        setUsuario(usuarioPersistente);
      } else {
        const user = await authUseCase.obtenerUsuarioActual();
        setUsuario(user);
      }
    } catch (error) {
      console.log("Error al verificar sesión inicial:", error);
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  };

  const registrar = async (
    email: string,
    password: string,
    rol: "asesor_comercial" | "usuario_registrado"
  ) => {
    const resultado = await authUseCase.registrar(email, password, rol);
    if (resultado.success && resultado.needsConfirmation) {
      await StorageService.setItem("pending_user_role", rol);
      await StorageService.setItem("pending_user_email", email);
    }
    return resultado;
  };

  const iniciarSesion = async (
    email: string,
    password: string,
    recordarSesion: boolean = true
  ) => {
    return await authUseCase.iniciarSesion(email, password, recordarSesion);
  };

  const cerrarSesion = async () => {
    return await authUseCase.cerrarSesion();
  };

  const crearPerfilConRol = async () => {
    const rolGuardado = (await StorageService.getItem("pending_user_role")) as
      | "asesor_comercial"
      | "usuario_registrado"
      | null;
    const emailGuardado = await StorageService.getItem("pending_user_email");
    if (rolGuardado && emailGuardado && usuario) {
      const resultado = await authUseCase.crearPerfil(
        usuario.id,
        emailGuardado,
        rolGuardado
      );
      if (resultado.success) {
        await StorageService.removeItem("pending_user_role");
        await StorageService.removeItem("pending_user_email");
        const usuarioActualizado = await authUseCase.obtenerUsuarioActual();
        setUsuario(usuarioActualizado);
      }
      return resultado;
    }
    return { success: false, error: "No hay datos de rol pendientes" };
  };

  const actualizarPerfil = async (nombre?: string, telefono?: string) => {
    if (!usuario?.id) {
      return { success: false, error: "Usuario no autenticado" };
    }

    setCargandoActualizar(true);
    const resultado = await authUseCase.actualizarPerfil(usuario.id, nombre, telefono);
    if (resultado.success && resultado.usuario) {
      setUsuario(resultado.usuario); // Actualiza el estado local
    }
    setCargandoActualizar(false);
    return resultado;
  };



  return {
    usuario,
    cargando,
    cargandoActualizar,
    actualizarPerfil,
    registrar,
    iniciarSesion,
    cerrarSesion,
    crearPerfilConRol,
    esAsesorComercial: usuario?.rol === "asesor_comercial",
    esUsuarioRegistrado: usuario?.rol === "usuario_registrado",
  };
}