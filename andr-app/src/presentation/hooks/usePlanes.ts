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
      // No recargamos aquí porque el plan nuevo se agrega automáticamente
    }
    return resultado;
  };

  const actualizar = async (id: string, planData: Partial<Omit<Plan, 'id' | 'created_at' | 'updated_at'>>) => {
    const resultado = await planesUseCase.actualizarPlan(id, planData);
    if (resultado.success) {
      // Actualizamos el estado local si es necesario
    }
    return resultado;
  };

  //  MODIFICACIÓN: La función eliminar ahora recarga la lista
  const eliminar = async (id: string) => {
    const resultado = await planesUseCase.eliminarPlanFisico(id); // <-- Usar la nueva función
    if (resultado.success) {
      // Actualizar el estado local eliminando el plan de la lista
      setPlanes(prevPlanes => prevPlanes.filter(plan => plan.id !== id));
    }
    return resultado;
  };

  // Recargar la lista de planes
  const recargarPlanes = async (asesorId?: string) => {
    if (asesorId) {
      await cargarPlanesAsesor(asesorId);
    } else {
      await cargarPlanesPublicos();
    }
  };

  return {
    planes,
    cargando,
    cargarPlanesPublicos,
    cargarPlanesAsesor,
    crear,
    actualizar,
    eliminar,
    recargarPlanes, //
  };
}