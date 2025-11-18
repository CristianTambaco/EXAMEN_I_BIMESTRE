// src/domain/models/Contratacion.ts
export interface Contratacion {
  id: string;
  usuario_id: string;
  plan_id: string;
  fecha_contratacion: string;
  estado: "pendiente" | "aprobada" | "rechazada";
  observaciones?: string;
  created_at: string;
  updated_at: string;

  // 👇 Añade estas propiedades para las relaciones
  usuarios?: {
    email: string;
    // Puedes añadir más campos si los necesitas, como nombre, rol, etc.
  };

  planes_moviles?: {
    nombre_comercial: string;
    // Puedes añadir más campos si los necesitas, como precio, datos_móviles, etc.
  };
}