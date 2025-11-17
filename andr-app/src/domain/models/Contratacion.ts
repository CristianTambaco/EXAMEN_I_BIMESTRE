// src/domain/models/Contratacion.ts
export interface Contratacion {
  id: string;
  usuario_id: string;
  plan_id: string;
  fecha_contratacion: string; // ISO Date String
  estado: "pendiente" | "aprobada" | "rechazada";
  observaciones?: string;
  created_at: string;
  updated_at: string;
}