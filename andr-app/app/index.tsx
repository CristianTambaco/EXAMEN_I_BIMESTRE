// app/index.tsx
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../src/presentation/hooks/useAuth";

export default function HomeScreen() {
  const { usuario, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando) {
      if (usuario) {
        // Si el usuario está autenticado, redirigir a la pantalla principal según rol
        if (usuario.rol === "asesor_comercial") {
          router.replace("/(tabs)");
        } else if (usuario.rol === "usuario_registrado") {
          router.replace("/(tabs)");
        }
      }
    }
  }, [usuario, cargando]);

  if (cargando) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bienvenido a Tigo</Text>
      <Text style={styles.subtitulo}>Descubre nuestros planes móviles</Text>
      <TouchableOpacity
        style={[styles.boton, styles.botonInvitado]}
        onPress={() => router.push("/(invitado)/catalogo")}
      >
        <Text style={styles.textoBoton}>Explorar como Invitado</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.boton, styles.botonLogin]}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={styles.textoBoton}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.boton, styles.botonRegistro]}
        onPress={() => router.push("/auth/registro")}
      >
        <Text style={styles.textoBoton}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007AFF",
  },
  subtitulo: {
    fontSize: 16,
    marginBottom: 30,
    color: "#666",
  },
  boton: {
    width: "80%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  botonInvitado: {
    backgroundColor: "#4CAF50",
  },
  botonLogin: {
    backgroundColor: "#2196F3",
  },
  botonRegistro: {
    backgroundColor: "#9E9E9E",
  },
  textoBoton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});