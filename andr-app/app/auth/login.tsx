// app/auth/login.tsx (Modificado)
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/presentation/hooks/useAuth";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSize, spacing, borderRadius, shadows } from "../../src/styles/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [recordarSesion, setRecordarSesion] = useState(true);
  const { iniciarSesion } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    setCargando(true);
    const resultado = await iniciarSesion(email, password, recordarSesion);
    setCargando(false);
    if (resultado.success) {
      // El layout raíz se encargará de redirigir según el rol
      router.replace("/");
    } else {
      Alert.alert("Error", resultado.error || "No se pudo iniciar sesión");
    }
  };

  const handleLoginAsesor = async () => {
    // Para este caso, simplemente inicia sesión normalmente.
    // La lógica de rol se maneja en el hook useAuth y en el layout.
    // Este botón solo cambia el texto y podría tener una lógica diferente si se requiere.
    handleLogin();
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
        <Text style={styles.titulo}>Iniciar Sesión</Text>

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
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Botones de inicio de sesión */}
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleLogin}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Ingresar como Usuario</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleLoginAsesor}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Ingresar como Asesor</Text>
          )}
        </TouchableOpacity>

        {/* Enlace de olvido de contraseña */}
        <TouchableOpacity onPress={() => router.push("/auth/reestablecer")}>
          <Text style={styles.linkOlvidaste}>¿Olvidaste tu contraseña?</Text>
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
  buttonSecondary: {
    backgroundColor: colors.secondary, // Verde
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  linkOlvidaste: {
    textAlign: "center",
    marginTop: spacing.lg,
    color: colors.primary,
    fontSize: fontSize.sm,
    textDecorationLine: 'underline',
  },
});