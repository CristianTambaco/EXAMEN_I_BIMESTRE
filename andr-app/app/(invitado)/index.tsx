// app/(invitado)/index.tsx
import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSize, spacing } from "../../src/styles/theme";

export default function HomeInvitado() {
  const router = useRouter();
  return (
    <View style={globalStyles.containerCentered}>
      <Text style={styles.titulo}>Bienvenido a Tigo</Text>
      <Text style={globalStyles.textSecondary}>Descubre nuestros planes móviles</Text>
      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonPrimary, styles.botonExplorar]}
        onPress={() => router.push("/(invitado)/catalogo")}
      >
        <Text style={globalStyles.buttonText}>Explorar como Invitado</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonSecondary, styles.botonIniciarSesion]}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={globalStyles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonSecondary, styles.botonRegistrarse]}
        onPress={() => router.push("/auth/registro")}
      >
        <Text style={globalStyles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: fontSize.xxxl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.md,
    color: colors.white,
  },
  botonExplorar: {
    width: "80%",
    marginVertical: spacing.sm,
  },
  botonIniciarSesion: {
    width: "80%",
    marginVertical: spacing.sm,
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  botonRegistrarse: {
    width: "80%",
    marginVertical: spacing.sm,
    backgroundColor: colors.borderLight,
    borderColor: colors.border,
    borderWidth: 2,
  },
});