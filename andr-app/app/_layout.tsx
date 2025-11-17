// app/_layout.tsx
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../src/presentation/hooks/useAuth";

export default function RootLayout() {
  const { usuario, cargando } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (cargando) return;

    // 👇 Castear explícitamente a string para evitar advertencias de TypeScript
    const enAuth = segments[0] as string === "auth";
    const enInvitado = segments[0] as string === "invitado";
    const enTabs = segments[0] as string === "tabs";

    if (!usuario && !enAuth) {
      router.replace("/auth/login");
    } else if (usuario && enAuth) {
      // Redirigir según rol
      if (usuario.rol === "asesor_comercial") {
        router.replace("/(tabs)");
      } else if (usuario.rol === "usuario_registrado") {
        router.replace("/(tabs)");
      } else {
        router.replace("/auth/login");
      }
    } else if (enInvitado && usuario) {
      // Si está autenticado y trata de acceder como invitado, redirigir
      router.replace("/(tabs)");
    }
  }, [usuario, segments, cargando]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(invitado)" options={{ headerShown: false }} />
      <Stack.Screen name="detallePlan" options={{ headerShown: false }} />
    </Stack>
  );
}