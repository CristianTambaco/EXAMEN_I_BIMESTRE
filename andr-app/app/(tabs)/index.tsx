// app/(tabs)/index.tsx (Modificado para coincidir con el diseño de la segunda imagen)
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

  // Función para renderizar un plan en formato de tarjeta (como en la segunda imagen)
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.planCard}>
      {/* Encabezado con gradiente  */}
      <View style={styles.headerGradient} />
      <View style={styles.planContent}>
        <Text style={styles.planTitle}>{item.nombre_comercial}</Text>
        <Text style={styles.planPrice}>${item.precio}/mes</Text>
        {/* Características del plan */}
        <View style={styles.featuresContainer}>

          {item.redes_sociales && (
            <View style={styles.featureBadge}>
              <Text style={styles.featureBadgeText}>{item.redes_sociales}</Text>
            </View>
          )}

          <Text style={styles.featureDescription}>{item.publico_objetivo}</Text>
          <View style={styles.featureIcons}>
            <Text style={styles.featureIcon}>📱 {item.datos_móviles}</Text>
            <Text style={styles.featureIcon}>📞 {item.minutos_voz}</Text>
          </View>
        </View>
        {/* Botón "Ver Detalles" */}

        
        {/* <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={() => router.push(`/detallePlan?id=${item.id}`)}
        >
          <Text style={styles.buttonText}>Ver Detalles</Text>
        </TouchableOpacity> */}


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
      <Text style={styles.sectionTitle}>Planes Disponibles</Text>
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
    </View>
  );
}

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
  headerGradient: {
    height: 150,
    backgroundColor: '#00BFFF', // Color azul cian como en la imagen (puedes usar un gradiente real si es necesario)
  },
  planContent: {
    padding: spacing.md,
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
  featuresContainer: {
    marginBottom: spacing.lg,
  },
  featureBadge: {
    backgroundColor: '#FFF9C4', // Amarillo claro
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  featureBadgeText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  featureIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureIcon: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  button: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.medium,
  },
  buttonPrimary: {
    backgroundColor: colors.primary, // Azul
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
});