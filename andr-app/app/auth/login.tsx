// app/auth/login.tsx
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
import { colors, fontSize, spacing } from "../../src/styles/theme";

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
      router.replace("/"); // Redirige a la raíz para que el layout maneje la navegación
    } else {
      Alert.alert("Error", resultado.error || "No se pudo iniciar sesión");
    }
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.contentPadding}>
        <Text style={styles.titulo}>Tigo Conecta</Text>
        <Text style={styles.subtitulo}>Inicia sesión para continuar</Text>
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
        <View style={styles.recordarSesionContainer}>
          <Switch
            value={recordarSesion}
            onValueChange={setRecordarSesion}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={recordarSesion ? colors.white : colors.white}
          />
          <Text style={styles.recordarSesionTexto}>Recordar sesión</Text>
        </View>
        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.buttonPrimary,
            styles.botonLogin,
          ]}
          onPress={handleLogin}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={globalStyles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/auth/registro")}>
          <Text style={styles.linkRegistro}>
            ¿No tienes cuenta? Regístrate aquí
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/auth/reestablecer")}>
          <Text style={styles.linkRegistro}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... (mismos estilos que antes)
const styles = StyleSheet.create({
  titulo: {
    fontSize: fontSize.xxxl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: spacing.sm,
    marginTop: spacing.xxl * 2,
    color: colors.textPrimary,
  },
  subtitulo: {
    fontSize: fontSize.md,
    textAlign: "center",
    marginBottom: spacing.xl,
    color: colors.textSecondary,
  },
  botonLogin: {
    marginTop: spacing.sm,
  },
  linkRegistro: {
    textAlign: "center",
    marginTop: spacing.lg,
    color: colors.primary,
    fontSize: fontSize.sm,
  },
  recordarSesionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  recordarSesionTexto: {
    marginLeft: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
});