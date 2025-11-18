// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "../../src/presentation/hooks/useAuth";
import { colors, fontSize } from "@/src/styles/theme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { esAsesorComercial, esUsuarioRegistrado } = useAuth();

  if (esAsesorComercial) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarLabelStyle: { fontSize: fontSize.sm, fontWeight: '600' },
          tabBarStyle: { backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.borderLight },
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
          name="misPlanes"
          options={{
            title: "Planes",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="shopping-cart" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="contratacion/pendientes"
          options={{
            title: "Solicitudes",
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
          name="perfil"
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

  if (esUsuarioRegistrado) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarLabelStyle: { fontSize: fontSize.sm, fontWeight: '600' },
          tabBarStyle: { backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.borderLight },
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
          name="misPlanes"
          options={{
            title: "Catálogo",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="shopping-cart" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="rutinasAsignadas"
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
          name="perfil"
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

  // Si no hay usuario autenticado o no tiene un rol válido, muestra una pantalla vacía
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}