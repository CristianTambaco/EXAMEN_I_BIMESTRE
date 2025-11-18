// app/(tabs)/index.tsx (Modificado para mostrar solo imagen, nombre y precio)
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

export default function HomeScreen() {
  const { usuario, esUsuarioRegistrado, esAsesorComercial, cerrarSesion } = useAuth();
  const { planes, cargarPlanesPublicos, cargarPlanesAsesor } = usePlanes();
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      if (esAsesorComercial && usuario?.id) {
        await cargarPlanesAsesor(usuario.id);
      } else if (esUsuarioRegistrado) {
        await cargarPlanesPublicos();
      }
      setCargando(false);
    };
    cargarDatos();
  }, [usuario, esAsesorComercial, esUsuarioRegistrado, cargarPlanesAsesor, cargarPlanesPublicos]);

  const handleCerrarSesion = async () => {
    await cerrarSesion();
    router.replace("/auth/login");
  };

  if (!usuario) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const handleRefresh = async () => {
    setRefrescando(true);
    if (esAsesorComercial && usuario?.id) {
      await cargarPlanesAsesor(usuario.id);
    } else if (esUsuarioRegistrado) {
      await cargarPlanesPublicos();
    }
    setRefrescando(false);
  };

  if (cargando) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Función para renderizar un plan en formato de tarjeta simple (solo imagen, nombre y precio)
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[globalStyles.card, styles.planCard]}
      onPress={() => router.push(`/detallePlan?id=${item.id}`)}
    >
      {/* Imagen del plan */}
      {item.imagen_url ? (
        <Image
          source={{ uri: item.imagen_url }}
          style={styles.planImage}
        />
      ) : (
        <View style={styles.planImagePlaceholder}>
          <Text style={globalStyles.textTertiary}>Sin imagen</Text>
        </View>
      )}
      <Text style={styles.planTitle}>{item.nombre_comercial}</Text>
      <Text style={styles.planPrice}>${item.precio}/mes</Text>
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <View>
          <Text style={styles.saludo}>¡Hola!</Text>
          <Text style={globalStyles.textSecondary}>{usuario.email}</Text>
          <Text style={styles.rol}>
            {esAsesorComercial ? "💼 Asesor Comercial" : "📱 Usuario Registrado"}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.buttonDanger,
            styles.botonCerrar,
          ]}
          onPress={handleCerrarSesion}
        >
          <Text style={globalStyles.buttonText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de Planes Disponibles */}
      <Text style={styles.sectionTitle}>{esAsesorComercial ? "Planes" : "Planes disponibles"}</Text>
      <FlatList
        data={planes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.md }}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={globalStyles.emptyState}>No hay planes disponibles</Text>}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={handleRefresh}
          />
        }
      />

      {/* <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonSecondary, styles.verMasButton]}
        onPress={() => router.push("/(tabs)/misPlanes")}
      >
        <Text style={globalStyles.buttonText}>Ver planes.</Text>
      </TouchableOpacity> */}

    </View>
  );
}

// Importación adicional necesaria
import { Image } from 'react-native';

const styles = StyleSheet.create({
  saludo: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  rol: {
    fontSize: fontSize.xs,
    color: colors.primary,
    marginTop: spacing.xs / 2,
    fontWeight: "500",
  },
  botonCerrar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  // Estilos para la tarjeta de plan
  planCard: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.white,
    ...shadows.medium,
  },
  planImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    backgroundColor: colors.borderLight,
  },
  planImagePlaceholder: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  planPrice: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  verMasButton: {
    marginVertical: spacing.md,
  },
});