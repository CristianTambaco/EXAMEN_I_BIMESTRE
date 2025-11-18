// app/auth/registro.tsx (Modificado)
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/presentation/hooks/useAuth";
import { globalStyles } from "../../src/styles/globalStyles";
import {
  borderRadius,
  colors,
  fontSize,
  spacing,
  shadows
} from "../../src/styles/theme";

export default function RegistroScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const { registrar } = useAuth();
  const router = useRouter();

  const handleRegistro = async () => {
    if (!nombre || !email || !telefono || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setCargando(true);
    const resultado = await registrar(email, password, "usuario_registrado");
    setCargando(false);
    if (resultado.success) {
      Alert.alert("Éxito", "Cuenta creada correctamente", [
        { text: "OK", onPress: () => router.replace("/auth/login") },
      ]);
    } else {
      Alert.alert("Error", resultado.error || "No se pudo crear la cuenta");
    }
  };

  return (
    <View style={styles.container}>
      {/* Barra superior con "Invitado" y "Volver" */}
      <View style={styles.headerBar}>
        <Text style={styles.invitadoLabel}>Invitado</Text>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.volverButton}>← Volver</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.contentPadding}>
        <Text style={styles.titulo}>Registro</Text>

        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Nombre Completo"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleRegistro}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    backgroundColor: colors.primary, // Azul intenso como en la imagen
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
    marginBottom: spacing.lg,
    marginTop: spacing.xxl * 2,
    color: colors.textPrimary,
  },
  inputField: {
    marginBottom: spacing.md,
  },
  button: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.medium,
    marginVertical: spacing.sm,
  },
  buttonPrimary: {
    backgroundColor: colors.primary, // Azul
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
});