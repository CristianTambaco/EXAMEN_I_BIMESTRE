// app/contratacion/pendientes.tsx (Modificado)
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
  borderRadius,
  shadows
} from "../../src/styles/theme";

export default function ContratacionesPendientesScreen() {
  const { esAsesorComercial } = useAuth();
  const { cargarContratacionesPendientes, aprobar, rechazar } = useContrataciones();
  const [contrataciones, setContrataciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (esAsesorComercial) {
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
              await cargarDatos();
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
              await cargarDatos();
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
      {/* Barra superior */}
      <View style={styles.headerBar}>
        <View style={styles.rolLabelContainer}>
          <Text style={styles.rolLabel}>Asesor Comercial</Text>
        </View>
        <Text style={styles.headerTitle}>Solicitudes de Contratación</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

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
          <View style={styles.solicitudCard}>
            <View style={styles.solicitudHeader}>
              <Text style={styles.solicitudName}>{item.usuarios.email}</Text>
              <View style={styles.estadoBadge}>
                <Text style={styles.estadoText}>{item.estado.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.solicitudPlan}>{item.planes_moviles.nombre_comercial}</Text>
            <Text style={styles.solicitudDate}>{new Date(item.fecha_contratacion).toLocaleDateString('es-ES')}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.approveButton]}
                onPress={() => handleAprobar(item.id)}
              >
                <Text style={styles.buttonText}>✓ Aprobar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.rejectButton]}
                onPress={() => handleRechazar(item.id)}
              >
                <Text style={styles.buttonText}>✗ Rechazar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.chatButton]}
                onPress={() => router.push("/(tabs)/chat")}
              >
                <Text style={styles.buttonText}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  solicitudCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  solicitudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  solicitudName: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  estadoBadge: {
    backgroundColor: '#FFEB3B', // Amarillo
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  estadoText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  solicitudPlan: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  solicitudDate: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: '#4CAF50', // Verde
  },
  rejectButton: {
    backgroundColor: '#f44336', // Rojo
  },
  chatButton: {
    backgroundColor: colors.secondary, // Azul
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  textoNoAsesor: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});