// app/auth/reestablecer.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import { useAuth } from "../../src/presentation/hooks/useAuth";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSize, spacing } from "../../src/styles/theme";

export default function ReestablecerContrasenaScreen() {
  const [email, setEmail] = useState("");
  const [cargando, setCargando] = useState(false);
  const { enviarEnlaceReestablecimiento } = useAuth(); // Usar la función del hook
  const router = useRouter();

  const handleEnviarLink = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor ingresa tu email.");
      return;
    }

    setCargando(true);
    const resultado = await enviarEnlaceReestablecimiento(email);
    setCargando(false);

    if (resultado.success) {
      Alert.alert(
        "Correo Enviado",
        "Se ha enviado un enlace de reestablecimiento a tu correo electrónico. Por favor, revisa tu bandeja de entrada (y spam).",
        [
          {
            text: "OK",
            onPress: () => router.back(), // Volver a la pantalla de login
          },
        ]
      );
    } else {
      Alert.alert("Error", resultado.error || "No se pudo enviar el enlace. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <View style={globalStyles.container}>
      {/* Barra superior con "Invitado" y "Volver" */}
      <View style={styles.headerBar}>
        <Text style={styles.invitadoLabel}>Invitado</Text>
        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.volverButton}>← Volver</Text>
        </TouchableOpacity>
      </View>
      <View style={globalStyles.contentPadding}>
        <Text style={styles.titulo}>Reestablecer Contraseña</Text>
        <Text style={[globalStyles.textSecondary, styles.descripcion]}>
          Ingresa tu email y te enviaremos un enlace para crear una nueva contraseña.
        </Text>
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.buttonPrimary,
            styles.botonEnviar,
          ]}
          onPress={handleEnviarLink}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={globalStyles.buttonText}>Enviar enlace de Restablecimiento</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.linkVolver}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    backgroundColor: colors.primary, // Azul intenso como en la imagen de login/registro
  },
  invitadoLabel: {
    fontSize: fontSize.sm,
    color: colors.white,
    fontWeight: 'bold',
  },
  volverButton: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: fontSize.xxxl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.sm,
    marginTop: spacing.xxl * 2, // Espacio superior como en login/registro
    color: colors.textPrimary,
  },
  descripcion: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  inputField: {
    marginBottom: spacing.md,
  },
  botonEnviar: {
    marginTop: spacing.md,
    paddingVertical: spacing.lg, // Hacerlo más prominente como otros botones principales
  },
  linkVolver: {
    textAlign: "center",
    marginTop: spacing.lg,
    color: colors.primary,
    fontSize: fontSize.sm,
    textDecorationLine: 'underline',
  },
});