// app/contratacion/pendientes.tsx (Solicitudes Pendientes para Asesor)
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/presentation/hooks/useAuth";
import { useContrataciones } from "../../src/presentation/hooks/useContrataciones";
import { globalStyles } from "../../src/styles/globalStyles";
import {
  colors,
  fontSize,
  spacing,
} from "../../src/styles/theme";

export default function ContratacionesPendientesScreen() {
  const { esAsesorComercial } = useAuth(); // Verificar rol
  const { cargarContratacionesPendientes, aprobar, rechazar } = useContrataciones();
  const [contrataciones, setContrataciones] = useState<any[]>([]); // Cambiar tipo a Contratacion
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (esAsesorComercial) { // Solo si es asesor
      cargarDatos();
    }
  }, [esAsesorComercial]);

  const cargarDatos = async () => {
    setCargando(true);
    const data = await cargarContratacionesPendientes();
    setContrataciones(data);
    setCargando(false);
  };

  if (!esAsesorComercial) {
    return (
      <View style={globalStyles.containerCentered}>
        <Text style={styles.textoNoAsesor}>
          Esta sección es solo para asesores comerciales 💼
        </Text>
      </View>
    );
  }

  const handleRefresh = async () => {
    setRefrescando(true);
    await cargarDatos();
    setRefrescando(false);
  };

  const handleAprobar = async (id: string) => {
    Alert.alert(
      "Confirmar aprobación",
      "¿Estás seguro de que quieres aprobar esta contratación?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprobar",
          style: "default",
          onPress: async () => {
            const resultado = await aprobar(id);
            if (resultado.success) {
              Alert.alert("Éxito", "Contratación aprobada");
              await cargarDatos(); // Recargar lista
            } else {
              Alert.alert("Error", resultado.error || "No se pudo aprobar");
            }
          },
        },
      ]
    );
  };

  const handleRechazar = async (id: string) => {
    Alert.alert(
      "Confirmar rechazo",
      "¿Estás seguro de que quieres rechazar esta contratación?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Rechazar",
          style: "destructive",
          onPress: async () => {
            const resultado = await rechazar(id);
            if (resultado.success) {
              Alert.alert("Éxito", "Contratación rechazada");
              await cargarDatos(); // Recargar lista
            } else {
              Alert.alert("Error", resultado.error || "No se pudo rechazar");
            }
          },
        },
      ]
    );
  };

  if (cargando) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Solicitudes Pendientes</Text>
      <FlatList
        data={contrataciones}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <Text style={globalStyles.emptyState}>
            No hay solicitudes pendientes
          </Text>
        }
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <Text style={styles.tituloPlan}>{item.planes_moviles.nombre_comercial}</Text>
            <Text style={globalStyles.textSecondary}>Usuario: {item.usuarios.email}</Text>
            <Text style={globalStyles.textSecondary}>Fecha: {new Date(item.fecha_contratacion).toLocaleDateString('es-ES')}</Text>
            <View style={styles.botonesAccion}>
              <TouchableOpacity
                style={[
                  globalStyles.button,
                  globalStyles.buttonPrimary,
                  styles.botonAccion,
                ]}
                onPress={() => handleAprobar(item.id)}
              >
                <Text style={globalStyles.buttonText}>✅ Aprobar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  globalStyles.button,
                  globalStyles.buttonDanger,
                  styles.botonAccion,
                ]}
                onPress={() => handleRechazar(item.id)}
              >
                <Text style={globalStyles.buttonText}>❌ Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textoNoAsesor: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  tituloPlan: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  botonesAccion: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  botonAccion: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
});