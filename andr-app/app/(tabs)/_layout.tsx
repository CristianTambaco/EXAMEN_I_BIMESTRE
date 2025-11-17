// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "../../src/presentation/hooks/useAuth"; // Importar hook de auth

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { esAsesorComercial, esUsuarioRegistrado } = useAuth(); // Obtener roles

  // Definir pestañas para Asesor
  if (esAsesorComercial) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="dashboard" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="misPlanes" // Renombrar si es necesario
          options={{
            title: "Mis Planes",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="list-alt" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="contratacion/pendientes" // Nueva pestaña
          options={{
            title: "Solicitudes",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="pending-actions" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="message" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="progreso" // Puede ser Perfil
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="person" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    );
  }

  // Definir pestañas para Usuario Registrado
  if (esUsuarioRegistrado) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="misPlanes" // Renombrar si es necesario -> Catálogo
          options={{
            title: "Catálogo",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="list" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="rutinasAsignadas" // Renombrar si es necesario -> Mis Contrataciones
          options={{
            title: "Mis Contrataciones",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="receipt" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="message" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="progreso" // Puede ser Perfil
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="person" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    );
  }

  // Si no hay rol definido, mostrar pestañas genéricas o una pantalla de carga
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      {/* Opcional: Mostrar una pestaña de carga o un placeholder */}
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}