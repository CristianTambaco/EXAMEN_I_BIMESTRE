// app/(invitado)/_layout.tsx
import { Stack } from "expo-router";

export default function InvitadoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="catalogo" />
    </Stack>
  );
}