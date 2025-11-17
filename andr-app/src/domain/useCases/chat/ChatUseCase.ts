// src/domain/useCases/chat/ChatUseCase.ts
import { supabase } from "@/src/data/services/supabaseClient";
import { Mensaje } from "../../models/Mensaje";
import { RealtimeChannel } from "@supabase/supabase-js";

export class ChatUseCase {
  private channelMensajes: RealtimeChannel | null = null;
  private channelEscritura: RealtimeChannel | null = null;

  async obtenerMensajes(limite: number = 50): Promise<Mensaje[]> {
    try {
      const { data, error } = await supabase
        .from("mensajes")
        .select(`
          *,
          usuarios!fk_usuario(email, rol)
        `)
        .order("created_at", { ascending: false })
        .limit(limite);
      if (error) {
        console.error("Error al obtener mensajes:", error);
        throw error;
      }
      const mensajesFormateados = (data || []).map((msg: any) => ({
        ...msg,
        usuario: msg.usuarios
      }));
      return mensajesFormateados.reverse() as Mensaje[];
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return [];
    }
  }

  async enviarMensaje(contenido: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: "Usuario no autenticado" };
      }
      await this.enviarEventoEscritura(false);
      const { error } = await supabase
        .from("mensajes")
        .insert({
          contenido,
          usuario_id: user.id,
        });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("Error al enviar mensaje:", error);
      return { success: false, error: error.message };
    }
  }

  async enviarEventoEscritura(escribiendo: boolean) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("Usuario no autenticado, no se envía evento de escritura.");
        return;
      }
      if (escribiendo) {
         const { error } = await supabase
           .from("indicadores_escritura")
           .insert({ usuario_id: user.id });
         if (error) {
           console.error("Error al enviar evento de escritura:", error);
         }
      }
    } catch (error) {
      console.error("Error al enviar evento de escritura:", error);
    }
  }

  suscribirseAEscritura(callback: (usuariosEscribiendo: string[]) => void) {
    this.channelEscritura = supabase.channel('escritura-channel');
    const usuariosEscritura = new Map<string, number>();
    const limpiarInactivos = () => {
      const ahora = Date.now();
      let cambio = false;
      usuariosEscritura.forEach((timestamp, userId) => {
        if (ahora - timestamp > 3000) {
          usuariosEscritura.delete(userId);
          cambio = true;
        }
      });
      if (cambio) {
        callback(Array.from(usuariosEscritura.keys()));
      }
    };
    const limpiarInterval = setInterval(limpiarInactivos, 1000);
    this.channelEscritura
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'indicadores_escritura'
        },
        (payload) => {
          const userId = payload.new.usuario_id;
          const timestamp = Date.now();
          usuariosEscritura.set(userId, timestamp);
          callback(Array.from(usuariosEscritura.keys()));
        }
      )
      .subscribe();
    return () => {
      if (this.channelEscritura) {
        supabase.removeChannel(this.channelEscritura);
        this.channelEscritura = null;
      }
      clearInterval(limpiarInterval);
      usuariosEscritura.clear();
    };
  }

  suscribirseAMensajes(callback: (mensaje: Mensaje) => void) {
    this.channelMensajes = supabase.channel('mensajes-channel-2');
    this.channelMensajes
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes'
        },
        async (payload) => {
          console.log('📨 Nuevo mensaje recibido!', payload.new);
          try {
            const { data, error } = await supabase
              .from("mensajes")
              .select(`
                *,
                usuarios!fk_usuario(email, rol)
              `)
              .eq('id', payload.new.id)
              .single();
            if (error) {
              console.error('⚠️ Error al obtener mensaje completo:', error);
              const mensajeFallback: Mensaje = {
                id: payload.new.id,
                contenido: payload.new.contenido,
                usuario_id: payload.new.usuario_id,
                created_at: payload.new.created_at,
                usuario: {
                  email: 'Desconocido',
                  rol: 'usuario'
                }
              };
              callback(mensajeFallback);
              return;
            }
            if (data) {
              const mensajeFormateado: Mensaje = {
                id: data.id,
                contenido: data.contenido,
                usuario_id: data.usuario_id,
                created_at: data.created_at,
                usuario: data.usuarios || { email: 'Desconocido', rol: 'usuario' }
              };
              callback(mensajeFormateado);
            }
          } catch (err) {
            console.error('❌ Error inesperado:', err);
            const mensajeFallback: Mensaje = {
              id: payload.new.id,
              contenido: payload.new.contenido,
              usuario_id: payload.new.usuario_id,
              created_at: payload.new.created_at,
              usuario: {
                email: 'Desconocido',
                rol: 'usuario'
              }
            };
            callback(mensajeFallback);
          }
        }
      )
      .subscribe((status) => {
        console.log('Estado de suscripción mensajes:', status);
      });
    return () => {
      if (this.channelMensajes) {
        supabase.removeChannel(this.channelMensajes);
        this.channelMensajes = null;
      }
    };
  }

  async eliminarMensaje(mensajeId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("mensajes")
        .delete()
        .eq('id', mensajeId);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error("Error al eliminar mensaje:", error);
      return { success: false, error: error.message };
    }
  }
}