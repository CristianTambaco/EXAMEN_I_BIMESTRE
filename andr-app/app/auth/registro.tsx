// app/auth/registro.tsx
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
    <View style={globalStyles.container}>
      <View style={globalStyles.contentPadding}>
        <Text style={globalStyles.title}>Registro</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Nombre Completo"
          value={nombre}
          onChangeText={setNombre}
        />
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
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonPrimary]}
          onPress={handleRegistro}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={globalStyles.buttonText}>Crear Cuenta</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.linkVolver}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  linkVolver: {
    textAlign: "center",
    marginTop: spacing.lg,
    color: colors.primary,
    fontSize: fontSize.sm,
  },
});