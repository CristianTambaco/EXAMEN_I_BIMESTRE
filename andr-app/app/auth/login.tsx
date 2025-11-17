// app/auth/login.tsx
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
import { colors, fontSize, spacing } from "../../src/styles/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const { iniciarSesion } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    setCargando(true);
    const resultado = await iniciarSesion(email, password, true);
    setCargando(false);
    if (resultado.success) {
      router.replace("/");
    } else {
      Alert.alert("Error", resultado.error || "No se pudo iniciar sesión");
    }
  };

  const handleIngresarComoUsuario = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    setCargando(true);
    const resultado = await iniciarSesion(email, password, true);
    setCargando(false);
    if (resultado.success) {
      router.replace("/");
    } else {
      Alert.alert("Error", resultado.error || "No se pudo iniciar sesión");
    }
  };

  const handleIngresarComoAsesor = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    setCargando(true);
    const resultado = await iniciarSesion(email, password, true);
    setCargando(false);
    if (resultado.success) {
      router.replace("/");
    } else {
      Alert.alert("Error", resultado.error || "No se pudo iniciar sesión");
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.contentPadding}>
        <Text style={styles.titulo}>Iniciar Sesión</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.buttonPrimary,
            styles.botonLogin,
          ]}
          onPress={handleIngresarComoUsuario}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={globalStyles.buttonText}>Ingresar como Usuario</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.buttonSecondary,
            styles.botonAsesor,
          ]}
          onPress={handleIngresarComoAsesor}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={globalStyles.buttonText}>Ingresar como Asesor</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/auth/reestablecer")}>
          <Text style={styles.linkRecuperar}>¿Olvidaste tu contraseña?</Text>
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
  botonLogin: {
    marginTop: spacing.sm,
  },
  botonAsesor: {
    marginTop: spacing.sm,
    backgroundColor: colors.secondary,
  },
  linkRecuperar: {
    textAlign: "center",
    marginTop: spacing.lg,
    color: colors.primary,
    fontSize: fontSize.sm,
  },
});