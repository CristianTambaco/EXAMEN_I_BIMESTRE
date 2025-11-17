// src/presentation/hooks/usePlanes.ts
import { useState } from "react";
import { Plan } from "../../domain/models/Plan";
import { PlanesUseCase } from "../../domain/useCases/planes/PlanesUseCase";

const planesUseCase = new PlanesUseCase();

export function usePlanes() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarPlanesPublicos = async () => {
    setCargando(true);
    const data = await planesUseCase.obtenerPlanesActivos();
    setPlanes(data);
    setCargando(false);
  };

  const cargarPlanesAsesor = async (asesorId: string) => {
    setCargando(true);
    const data = await planesUseCase.obtenerPlanesPorAsesor(asesorId);
    setPlanes(data);
    setCargando(false);
  };

  const crear = async (planData: Omit<Plan, 'id' | 'created_at' | 'updated_at' | 'activo'>) => {
    const resultado = await planesUseCase.crearPlan(planData);
    if (resultado.success) {
      // Opcional: Recargar lista de asesor
      // await cargarPlanesAsesor(asesorId);
    }
    return resultado;
  };

  const actualizar = async (id: string, planData: Partial<Omit<Plan, 'id' | 'created_at' | 'updated_at'>>) => {
    const resultado = await planesUseCase.actualizarPlan(id, planData);
    if (resultado.success) {
      // Actualizar estado local si es necesario
    }
    return resultado;
  };

  const eliminar = async (id: string) => {
    const resultado = await planesUseCase.eliminarPlan(id);
    if (resultado.success) {
      // Actualizar estado local si es necesario
    }
    return resultado;
  };

  return {
    planes,
    cargando,
    cargarPlanesPublicos,
    cargarPlanesAsesor,
    crear,
    actualizar,
    eliminar,
  };
}