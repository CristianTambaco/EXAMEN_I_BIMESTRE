// app/auth/reestablecer.tsx
import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSize, spacing } from "../../src/styles/theme";

export default function ReestablecerContrasenaScreen() {
  const router = useRouter();
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.contentPadding}>
        <Text style={styles.titulo}>Reestablecer Contraseña</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.buttonPrimary,
            styles.botonEnviar,
          ]}
          onPress={() => Alert.alert("Funcionalidad no implementada")}
        >
          <Text style={globalStyles.buttonText}>Enviar Link de Restablecimiento</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkVolver}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: fontSize.xxxl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.sm,
    marginTop: spacing.xxl * 2,
    color: colors.textPrimary,
  },
  botonEnviar: {
    marginTop: spacing.md,
  },
  linkVolver: {
    textAlign: "center",
    marginTop: spacing.lg,
    color: colors.primary,
    fontSize: fontSize.sm,
  },
});