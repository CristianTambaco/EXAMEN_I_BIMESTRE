// src/domain/models/Usuario.ts
export interface Usuario {
  id: string;
  email: string;
  nombre?: string;
  telefono?: string; // Añadir esta línea
  rol: "asesor_comercial" | "usuario_registrado";
}