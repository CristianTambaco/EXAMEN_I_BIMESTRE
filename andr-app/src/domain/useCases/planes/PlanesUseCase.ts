// src/domain/useCases/planes/PlanesUseCase.ts
import { supabase } from "@/src/data/services/supabaseClient";
import { Plan } from "../../models/Plan";

export class PlanesUseCase {
  async obtenerPlanesActivos(): Promise<Plan[]> {
    try {
      const { data, error } = await supabase
        .from("planes_moviles")
        .select("*")
        .eq("activo", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Plan[];
    } catch (error) {
      console.error("Error al obtener planes activos:", error);
      return [];
    }
  }

  async obtenerPlanesPorAsesor(asesorId: string): Promise<Plan[]> {
    try {
      const { data, error } = await supabase
        .from("planes_moviles")
        .select("*")
        .eq("asesor_id", asesorId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Plan[];
    } catch (error) {
      console.error("Error al obtener planes del asesor:", error);
      return [];
    }
  }

  async crearPlan(
    planData: Omit<Plan, 'id' | 'created_at' | 'updated_at' | 'activo'>
  ): Promise<{ success: boolean; error?: string; plan?: Plan }> {
    try {
      const { data, error } = await supabase
        .from("planes_moviles")
        .insert([planData])
        .select()
        .single();
      if (error) throw error;
      return { success: true, plan: data as Plan };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async actualizarPlan(id: string, planData: Partial<Omit<Plan, 'id' | 'created_at' | 'updated_at'>>): Promise<{ success: boolean; error?: string; plan?: Plan }> {
    try {
      const { data, error } = await supabase
        .from("planes_moviles")
        .update(planData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return { success: true, plan: data as Plan };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async eliminarPlan(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("planes_moviles")
        .update({ activo: false })
        .eq("id", id);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}