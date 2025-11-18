// app/(asesor)/dashboard.tsx (Modificado)
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { usePlanes } from "../../src/presentation/hooks/usePlanes";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSize, spacing, borderRadius, shadows } from "../../src/styles/theme";
import { useAuth } from "../../src/presentation/hooks/useAuth";

export default function DashboardAsesor() {
  const { planes, cargando, cargarPlanesAsesor } = usePlanes();
  const { usuario } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (usuario?.id) {
      cargarPlanesAsesor(usuario.id);
    }
  }, [usuario]);

  // Función para renderizar un plan
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.planCard}>
      <Text style={styles.planTitle}>{item.nombre_comercial}</Text>
      <Text style={styles.planPrice}>${item.precio}/mes</Text>
      {/* Promoción (si existe) */}
      {item.promocion && (
        <View style={styles.promoBadge}>
          <Text style={styles.promoText}>{item.promocion}</Text>
        </View>
      )}
      <Text style={styles.planDescription}>
        {item.publico_objetivo}
      </Text>
      <View style={styles.planFeatures}>
        <Text style={styles.featureIcon}>📱 {item.datos_móviles}</Text>
        <Text style={styles.featureIcon}>📞 {item.minutos_voz}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => router.push(`/plan/editar?id=${item.id}`)}
        >
          <Text style={styles.buttonText}>✏️ Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          // onPress={() => handleEliminar(item.id)}
        >
          <Text style={styles.buttonText}>🗑️ Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cargando) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {/* Barra superior con etiqueta "Asesor Comercial" y título */}
      <View style={styles.headerBar}>
        <View style={styles.rolLabelContainer}>
          <Text style={styles.rolLabel}>Asesor Comercial</Text>
        </View>
        <Text style={styles.headerTitle}>Panel de Asesor</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de Gestión de Planes */}
      <View style={styles.gestionSection}>
        <Text style={styles.gestionTitle}>Gestión de Planes</Text>
        <Text style={styles.gestionSubtitle}>Administra el catálogo de planes móviles</Text>
        <TouchableOpacity
          style={[styles.createButton, styles.createButtonPrimary]}
          onPress={() => router.push("/plan/crear")}
        >
          <Text style={styles.createButtonText}>+ Crear Nuevo Plan</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Planes Activos */}
      <Text style={styles.sectionTitle}>Planes Activos</Text>
      <FlatList
        data={planes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={globalStyles.emptyState}>No tienes planes creados</Text>}
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
  gestionSection: {
    backgroundColor: colors.secondary, // Azul claro
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  gestionTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  gestionSubtitle: {
    fontSize: fontSize.md,
    color: colors.white,
    marginBottom: spacing.lg,
  },
  createButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonPrimary: {
    backgroundColor: colors.primary, // Azul oscuro
  },
  createButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  planTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  planPrice: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  promoBadge: {
    backgroundColor: '#FFF9C4', // Amarillo claro
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  promoText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  planDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  planFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  featureIcon: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
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
  editButton: {
    backgroundColor: '#4CAF50', // Verde
  },
  deleteButton: {
    backgroundColor: '#f44336', // Rojo
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});