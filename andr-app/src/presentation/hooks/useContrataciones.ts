// src/presentation/hooks/useContrataciones.ts
import { useState } from "react";
import { Contratacion } from "../../domain/models/Contratacion";
import { ContratacionesUseCase } from "../../domain/useCases/contrataciones/ContratacionesUseCase";

const contratacionesUseCase = new ContratacionesUseCase();

export function useContrataciones() {
  const [cargando, setCargando] = useState(false);

  const crear = async (usuarioId: string, planId: string) => {
    setCargando(true);
    const resultado = await contratacionesUseCase.crearContratacion(usuarioId, planId);
    setCargando(false);
    return resultado;
  };

  const cargarContratacionesUsuario = async (usuarioId: string): Promise<Contratacion[]> => {
    setCargando(true);
    const data = await contratacionesUseCase.obtenerContratacionesPorUsuario(usuarioId);
    setCargando(false);
    return data;
  };

  const cargarContratacionesPendientes = async (): Promise<Contratacion[]> => {
    setCargando(true);
    const data = await contratacionesUseCase.obtenerContratacionesPendientes();
    setCargando(false);
    return data;
  };

  const aprobar = async (id: string) => {
    setCargando(true);
    const resultado = await contratacionesUseCase.aprobarContratacion(id);
    setCargando(false);
    return resultado;
  };

  const rechazar = async (id: string) => {
    setCargando(true);
    const resultado = await contratacionesUseCase.rechazarContratacion(id);
    setCargando(false);
    return resultado;
  };

  return {
    cargando,
    crear,
    cargarContratacionesUsuario,
    cargarContratacionesPendientes,
    aprobar,
    rechazar,
  };
}