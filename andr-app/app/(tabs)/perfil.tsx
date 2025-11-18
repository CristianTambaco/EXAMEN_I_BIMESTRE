// app/(tabs)/perfil.tsx (Modificado)
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
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
import { colors, fontSize, spacing, borderRadius, shadows } from "../../src/styles/theme";

export default function PerfilScreen() {
  const { usuario, cargando, cargandoActualizar, cerrarSesion, actualizarPerfil, esAsesorComercial, esUsuarioRegistrado } = useAuth();
  const router = useRouter();

  const [editando, setEditando] = useState(false);
  const [nombreInput, setNombreInput] = useState(usuario?.nombre || "");
  const [telefonoInput, setTelefonoInput] = useState(usuario?.telefono || ""); // Asumiendo que el modelo Usuario tiene 'telefono'

  // Actualizar los estados locales si el usuario cambia (por ejemplo, después de una actualización)
  useEffect(() => {
    setNombreInput(usuario?.nombre || "");
    setTelefonoInput(usuario?.telefono || "");
  }, [usuario]);

  if (cargando) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={globalStyles.containerCentered}>
        <Text style={globalStyles.textSecondary}>No hay usuario autenticado</Text>
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonPrimary, { marginTop: spacing.md }]}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={globalStyles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCerrarSesion = async () => {
    await cerrarSesion();
    router.replace("/auth/login");
  };

  const handleEditar = () => {
    setEditando(true);
  };

  const handleGuardar = async () => {
    if (!usuario?.id) return;

    const resultado = await actualizarPerfil(nombreInput, telefonoInput);
    if (resultado.success) {
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      setEditando(false);
    } else {
      Alert.alert("Error", resultado.error || "No se pudo actualizar el perfil");
    }
  };

  return (
    <View style={globalStyles.container}>
      {/* Barra superior - puedes mantenerla o adaptarla según rol */}
      <View style={styles.headerBar}>
        <View style={styles.rolLabelContainer}>
          <Text style={styles.rolLabel}>{esAsesorComercial ? "💼 Asesor Comercial" : "👤 Usuario Registrado"}</Text>
        </View>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>
      <View style={globalStyles.contentPadding}>
        {/* Tarjeta de perfil */}
        <View style={styles.perfilCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{usuario.email.charAt(0).toUpperCase()}</Text>
          </View>
          {/* Mostrar nombre editable o no */}
          {editando ? (
            <TextInput
              style={[styles.nombre, styles.inputEditable]}
              value={nombreInput}
              onChangeText={setNombreInput}
              placeholder="Nombre"
            />
          ) : (
            <Text style={styles.nombre}>{usuario.nombre || usuario.email}</Text>
          )}
          <Text style={styles.email}>{usuario.email}</Text>
        </View>

        {/* Información de contacto editable */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>👤 Nombre</Text>
            {editando ? (
              <TextInput
                style={[styles.infoValue, styles.inputEditable]}
                value={nombreInput}
                onChangeText={setNombreInput}
                placeholder="Nombre"
              />
            ) : (
              <Text style={styles.infoValue}>{usuario.nombre || "No especificado"}</Text>
            )}
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📱 Teléfono</Text>
            {editando ? (
              <TextInput
                style={[styles.infoValue, styles.inputEditable]}
                value={telefonoInput}
                onChangeText={setTelefonoInput}
                placeholder="Teléfono"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.infoValue}>{usuario.telefono || "No especificado"}</Text>
            )}
          </View>
          {/* Añadir más campos editables aquí si es necesario */}
        </View>

        {/* Botones de acción */}
        {editando ? (
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleGuardar}
            disabled={cargandoActualizar} // Deshabilitar mientras se guarda
          >
            {cargandoActualizar ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleEditar}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.buttonDanger]}
          onPress={handleCerrarSesion}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


// Añadir estilos para el TextInput editable si es necesario
const styles = StyleSheet.create({
  // ... estilos existentes ...
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  rolLabelContainer: {
    backgroundColor: '#00C853', // Verde brillante
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  rolLabel: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    flex: 1,
    marginLeft: spacing.sm,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: fontSize.lg,
    color: colors.white,
  },
  perfilCard: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary, // Azul
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.white,
  },
  nombre: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.sm, // Espacio entre label y valor
  },
  inputEditable: {
    flex: 1,
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: 0,
    fontSize: fontSize.md,
    color: colors.textPrimary,
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
  buttonDanger: {
    backgroundColor: colors.danger, // Rojo
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
});