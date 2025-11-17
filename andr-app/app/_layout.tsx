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
    const enAuth = segments[0] === "auth";

    if (!usuario && !enAuth) {
      router.replace("/auth/login");
    } else if (usuario && enAuth) {
      // Redirigir según rol
      if (usuario.rol === "asesor_comercial") {
        router.replace("/(tabs)");
      } else if (usuario.rol === "usuario_registrado") {
        router.replace("/(tabs)");
      } else {
        // Rol no reconocido, volver a login
        router.replace("/auth/login");
      }
    }
  }, [usuario, segments, cargando]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="plan" options={{ headerShown: false }} />
      <Stack.Screen name="contratacion" options={{ headerShown: false }} />
      <Stack.Screen name="detallePlan" options={{ headerShown: false }} />
    </Stack>
  );
}