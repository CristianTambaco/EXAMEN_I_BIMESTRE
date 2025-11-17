// src/domain/useCases/contrataciones/ContratacionesUseCase.ts
import { supabase } from "@/src/data/services/supabaseClient";
import { Contratacion } from "../../models/Contratacion";

export class ContratacionesUseCase {
  async crearContratacion(
    usuarioId: string,
    planId: string
  ): Promise<{ success: boolean; error?: string; contratacion?: Contratacion }> {
    try {
      const { data, error } = await supabase
        .from("contrataciones") // Asumiendo nombre de tabla en Supabase
        .insert({ usuario_id: usuarioId, plan_id: planId, estado: "pendiente" })
        .select()
        .single();
      if (error) throw error;
      return { success: true, contratacion: data as Contratacion };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async obtenerContratacionesPorUsuario(usuarioId: string): Promise<Contratacion[]> {
    try {
      const { data, error } = await supabase
        .from("contrataciones")
        .select(`
          *,
          planes_moviles(nombre_comercial)
        `)
        .eq("usuario_id", usuarioId)
        .order("fecha_contratacion", { ascending: false });
      if (error) throw error;
      return data as Contratacion[];
    } catch (error) {
      console.error("Error al obtener contrataciones del usuario:", error);
      return [];
    }
  }

  async obtenerContratacionesPendientes(): Promise<Contratacion[]> {
    try {
      const { data, error } = await supabase
        .from("contrataciones")
        .select(`
          *,
          usuarios(email),
          planes_moviles(nombre_comercial)
        `)
        .eq("estado", "pendiente")
        .order("fecha_contratacion", { ascending: false });
      if (error) throw error;
      return data as Contratacion[];
    } catch (error) {
      console.error("Error al obtener contrataciones pendientes:", error);
      return [];
    }
  }

  async aprobarContratacion(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("contrataciones")
        .update({ estado: "aprobada" })
        .eq("id", id);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async rechazarContratacion(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("contrataciones")
        .update({ estado: "rechazada", observaciones: "Rechazado por el asesor." }) // Observación opcional
        .eq("id", id);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}