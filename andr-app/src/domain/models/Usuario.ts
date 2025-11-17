// src/domain/models/Usuario.ts

export interface Usuario {
  id: string;
  email: string;
  nombre?: string;
  rol: "asesor_comercial" | "usuario_registrado"; // 
}