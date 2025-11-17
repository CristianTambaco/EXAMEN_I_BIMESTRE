// src/presentation/hooks/useChat.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { ChatUseCase } from "@/src/domain/useCases/chat/ChatUseCase";
import { Mensaje } from "@/src/domain/models/Mensaje";

const chatUseCase = new ChatUseCase();

export const useChat = () => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [usuariosEscribiendo, setUsuariosEscribiendo] = useState<string[]>([]);
  const [inputTexto, setInputTexto] = useState("");
  const inputTextoRef = useRef(inputTexto);
  inputTextoRef.current = inputTexto;
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const iniciarEscritura = useCallback(() => {
    chatUseCase.enviarEventoEscritura(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      // No se llama a enviarEventoEscritura(false) aquí,
      // se considera que dejó de escribir si no hay actividad durante el timeout
      // y no se envía mensaje. Se podría limpiar el evento de la DB aquí si se desea,
      // pero el temporizador en el servidor de eventos lo maneja implícitamente.
    }, 1500);
  }, []);

  const detenerEscritura = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    // No se envía un evento "dejar de escribir" específico,
    // se asume que dejará de escribir si no hay actividad.
    // El servidor de eventos y el cliente limpiarán inactivos.
  }, []);

  const cargarMensajes = useCallback(async () => {
    setCargando(true);
    const mensajesObtenidos = await chatUseCase.obtenerMensajes();
    setMensajes(mensajesObtenidos);
    setCargando(false);
  }, []);

  const enviarMensaje = useCallback(async (contenido: string) => {
    if (!contenido.trim()) return { success: false, error: "El mensaje está vacío" };
    setEnviando(true);
    const resultado = await chatUseCase.enviarMensaje(contenido);
    detenerEscritura();
    setEnviando(false);
    setInputTexto("");
    return resultado;
  }, [detenerEscritura]);

  const eliminarMensaje = useCallback(async (mensajeId: string) => {
    const resultado = await chatUseCase.eliminarMensaje(mensajeId);
    if (resultado.success) {
      setMensajes(prev => prev.filter(m => m.id !== mensajeId));
    }
    return resultado;
  }, []);

  useEffect(() => {
    if (inputTextoRef.current.trim()) {
      iniciarEscritura();
    } else {
      detenerEscritura();
    }
  }, [inputTexto, iniciarEscritura, detenerEscritura]);

  useEffect(() => {
    cargarMensajes();
    const desuscribirMensajes = chatUseCase.suscribirseAMensajes((nuevoMensaje) => {
      setMensajes(prev => {
        if (prev.some(m => m.id === nuevoMensaje.id)) {
          return prev;
        }
        return [...prev, nuevoMensaje];
      });
    });
    const desuscribirEscritura = chatUseCase.suscribirseAEscritura((userIds) => {
      setUsuariosEscribiendo(userIds);
    });
    return () => {
      desuscribirMensajes();
      desuscribirEscritura();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [cargarMensajes]);

  return {
    mensajes,
    cargando,
    enviando,
    enviarMensaje,
    eliminarMensaje,
    recargarMensajes: cargarMensajes,
    usuariosEscribiendo,
    setInputTexto,
    inputTexto,
  };
};