// app/(usuario)/catalogo.tsx (Similar a invitado, pero con botón de contratar)
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

export default function CatalogoPlanes() {
  const { planes, cargando, cargarPlanesPublicos } = usePlanes();
  const router = useRouter();

  useEffect(() => {
    cargarPlanesPublicos(); // Carga solo los planes activos
  }, []);

  const handleContratar = (planId: string) => {
    // Aquí iría la lógica para crear la contratación
    console.log("Contratando plan:", planId);
    // router.push(`/contratar/${planId}`); // Ruta para confirmar contratación
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={globalStyles.card}>
      <Text style={styles.nombrePlan}>{item.nombre_comercial}</Text>
      <Text style={globalStyles.textPrimary}>${item.precio}/mes</Text>
      <Text style={globalStyles.textSecondary} numberOfLines={2}>
        {item.publico_objetivo}
      </Text>
      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonPrimary, styles.botonContratar]}
        onPress={() => handleContratar(item.id)}
      >
        <Text style={globalStyles.buttonText}>Contratar</Text>
      </TouchableOpacity>
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
      <Text style={globalStyles.title}>Catálogo de Planes</Text>
      <FlatList
        data={planes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={globalStyles.emptyState}>No hay planes disponibles</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  nombrePlan: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  botonContratar: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
});