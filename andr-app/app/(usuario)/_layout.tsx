// app/(usuario)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function UsuarioLayout() {
  const colorScheme = useColorScheme();
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
        name="catalogo"
        options={{
          title: "Catálogo",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="list" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="misContrataciones"
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