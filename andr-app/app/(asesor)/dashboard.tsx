// app/(asesor)/dashboard.tsx
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
import { colors, spacing } from "../../src/styles/theme";
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

  const renderItem = ({ item }: { item: any }) => (
    <View style={globalStyles.card}>
      <Text style={styles.nombrePlan}>{item.nombre_comercial}</Text>
      <Text style={globalStyles.textPrimary}>${item.precio}/mes</Text>
      <Text style={globalStyles.textSecondary} numberOfLines={2}>
        {item.publico_objetivo}
      </Text>
      <View style={styles.botonesAccion}>
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonSecondary, styles.botonAccion]}
          onPress={() => router.push(`/plan/editar?id=${item.id}`)} //  Ruta corregida
        >
          <Text style={globalStyles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonDanger, styles.botonAccion]}
          // onPress={() => handleEliminar(item.id)}
        >
          <Text style={globalStyles.buttonText}>Eliminar</Text>
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
      <View style={styles.header}>
        <Text style={globalStyles.title}>Mis Planes</Text>
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonPrimary]}
          onPress={() => router.push("/plan/crear")} //  Ruta corregida
        >
          <Text style={globalStyles.buttonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={planes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={globalStyles.emptyState}>No tienes planes</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  nombrePlan: {
    fontSize: 18,
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