// app/(asesor)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function AsesorLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Planes",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contratacionesPendientes"
        options={{
          title: "Contrataciones",
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