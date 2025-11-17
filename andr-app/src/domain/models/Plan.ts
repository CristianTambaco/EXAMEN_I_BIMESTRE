// src/domain/models/Plan.ts
export interface Plan {
  id: string;
  nombre_comercial: string;
  precio: number;
  segmento: string;
  publico_objetivo: string;
  datos_móviles: string;
  minutos_voz: string;
  sms: string;
  velocidad_4g: string;
  redes_sociales: string;
  whatsapp: string;
  llamadas_internacionales: string;
  roaming: string;
  imagen_url?: string;
  activo: boolean;
  asesor_id: string; // ID del asesor comercial que creó el plan
  created_at: string;
  updated_at: string;
}