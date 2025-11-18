// app/(tabs)/misPlanes.tsx
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
      {/* Barra superior */}
      <View style={styles.header}>
        <Text style={globalStyles.title}>
          {esAsesorComercial ? "Gestión de Planes" : "Catálogo de Planes"}
        </Text>
        {esAsesorComercial && (
          <TouchableOpacity
            style={[globalStyles.button, globalStyles.buttonPrimary]}
            onPress={() => router.push("/plan/crear")}
          >
            <Text style={globalStyles.buttonText}>+ Crear Nuevo Plan</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de Planes */}
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
        ListEmptyComponent={
          <Text style={globalStyles.emptyState}>
            {esAsesorComercial ? "No tienes planes creados" : "No hay planes disponibles"}
          </Text>
        }
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
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