// app/(tabs)/misPlanes.tsx (Versión actualizada)
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
import { usePlanes } from "../../src/presentation/hooks/usePlanes";
import { globalStyles } from "../../src/styles/globalStyles";
import {
  colors,
  fontSize,
  spacing,
  borderRadius,
  shadows
} from "../../src/styles/theme";

export default function MisPlanesScreen() {
  const { usuario, esAsesorComercial, esUsuarioRegistrado } = useAuth();
  const { planes, cargando, cargarPlanesPublicos, cargarPlanesAsesor, eliminar } = usePlanes();
  const [refrescando, setRefrescando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cargar = async () => {
      if (esAsesorComercial && usuario?.id) {
        await cargarPlanesAsesor(usuario.id);
      } else if (esUsuarioRegistrado) {
        await cargarPlanesPublicos();
      }
    };
    cargar();
  }, [esAsesorComercial, esUsuarioRegistrado, usuario?.id]);

  const handleRefresh = async () => {
    setRefrescando(true);
    if (esAsesorComercial && usuario?.id) {
      await cargarPlanesAsesor(usuario.id);
    } else if (esUsuarioRegistrado) {
      await cargarPlanesPublicos();
    }
    setRefrescando(false);
  };

  // Función para eliminar un plan (solo para asesores)
  const handleEliminar = async (planId: string) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar este plan?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const resultado = await eliminar(planId);
            if (resultado.success) {
              Alert.alert("Éxito", "Plan eliminado correctamente");
              // Opcional: Recargar lista si es necesario
              // await cargarPlanesAsesor(usuario?.id || "");
            } else {
              Alert.alert("Error", resultado.error || "No se pudo eliminar");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={globalStyles.card}>
      <Text style={styles.tituloPlan}>{item.nombre_comercial}</Text>
      <Text style={globalStyles.textPrimary}>${item.precio}/mes</Text>
      <Text style={globalStyles.textSecondary} numberOfLines={2}>
        {item.publico_objetivo}
      </Text>
      {esAsesorComercial && (
        <View style={styles.botonesAccion}>
          <TouchableOpacity
            style={[
              globalStyles.button,
              globalStyles.buttonSecondary,
              styles.botonAccion,
            ]}
            onPress={() => router.push(`/plan/editar?id=${item.id}`)}
          >
            <Text style={globalStyles.buttonText}>✏️ Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              globalStyles.button,
              globalStyles.buttonDanger,
              styles.botonAccion,
            ]}
            onPress={() => handleEliminar(item.id)}
          >
            <Text style={globalStyles.buttonText}>🗑️ Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
      {esUsuarioRegistrado && (
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonPrimary, styles.botonContratar]}
          onPress={() => router.push(`/detallePlan?id=${item.id}`)}
        >
          <Text style={globalStyles.buttonText}>Ver Detalles</Text>
        </TouchableOpacity>
      )}
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
      {/* Barra superior verde */}
      <View style={styles.headerBar}>
        <View style={styles.rolLabelContainer}>
          <Text style={styles.rolLabel}>{esAsesorComercial ? "💼 Asesor Comercial" : "👤 Usuario Registrado"}</Text>
        </View>
        <Text style={styles.headerTitle}>Panel</Text>
        <TouchableOpacity style={styles.menuButton}>

          {/* <Text style={styles.menuIcon}>☰</Text> */}
          
        </TouchableOpacity>
      </View>

      {/* Sección azul de Gestión de Planes */}
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

      {/* Sección de Planes Activos */}
      <Text style={styles.sectionTitle}>Planes Activos</Text>
      <FlatList
        data={planes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={handleRefresh}
          />
        }
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
    backgroundColor: colors.primary, // Verde
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
  botonContratar: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
});