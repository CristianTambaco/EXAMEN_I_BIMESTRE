// app/(tabs)/index.tsx (Pantalla principal según rol)
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
import { useContrataciones } from "../../src/presentation/hooks/useContrataciones";
import { globalStyles } from "../../src/styles/globalStyles";
import {
  colors,
  fontSize,
  spacing,
} from "../../src/styles/theme";

export default function HomeScreen() {
  const { usuario, esUsuarioRegistrado, esAsesorComercial, cerrarSesion } = useAuth();
  const { planes, cargarPlanesPublicos, cargarPlanesAsesor } = usePlanes(); // Reutilizar hook de planes
  const { cargarContratacionesUsuario } = useContrataciones(); // Reutilizar hook de contrataciones
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      if (esAsesorComercial && usuario?.id) {
        await cargarPlanesAsesor(usuario.id); // Cargar planes del asesor
      } else if (esUsuarioRegistrado && usuario?.id) {
        await cargarPlanesPublicos(); // Cargar planes públicos
        // await cargarContratacionesUsuario(usuario.id); // Opcional para mostrar últimas contrataciones
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

  const mostrarContenidoAsesor = () => (
    <>
      <Text style={styles.sectionTitle}>Tus Planes</Text>
      {planes.length === 0 ? (
        <Text style={globalStyles.emptyState}>No tienes planes creados</Text>
      ) : (
        <FlatList
          data={planes.slice(0, 3)} // Mostrar solo las 3 primeras
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.md }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[globalStyles.card, styles.rutinaCard]}
              onPress={() => router.push(`/plan/editar?id=${item.id}`)} // Ruta para editar plan
            >
              <Text style={styles.tituloReceta}>{item.nombre_comercial}</Text>
              <Text style={globalStyles.textSecondary} numberOfLines={2}>
                ${item.precio}/mes
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonSecondary, styles.verMasButton]}
        onPress={() => router.push("/(tabs)/misPlanes")} // Asumiendo que misPlanes ahora muestra planes del asesor
      >
        <Text style={globalStyles.buttonText}>Ver todos los planes</Text>
      </TouchableOpacity>
    </>
  );

  const mostrarContenidoUsuario = () => (
    <View style={globalStyles.containerCentered}>
      <Text style={styles.saludo}>¡Hola, {usuario.nombre || usuario.email}!</Text>
      <Text style={globalStyles.textSecondary}>Bienvenido a Tigo Conecta.</Text>
      <Text style={globalStyles.textSecondary}>Revisa nuestro catálogo de planes.</Text>
      <TouchableOpacity
        style={[globalStyles.button, globalStyles.buttonPrimary, { marginTop: spacing.lg }]}
        onPress={() => router.push("/(tabs)/misPlanes")} // Asumiendo que misPlanes ahora muestra planes públicos
      >
        <Text style={globalStyles.buttonText}>Ver Catálogo</Text>
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
      <FlatList
        data={[]}
        ListHeaderComponent={esAsesorComercial ? mostrarContenidoAsesor : mostrarContenidoUsuario}
        contentContainerStyle={{ padding: spacing.md }}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={handleRefresh}
          />
        }
        renderItem={() => null} // No renderiza items de la lista, solo el header
        keyExtractor={() => "header"} // Clave única para el header
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
    marginVertical: spacing.md,
  },
  rutinaCard: {
    width: 200,
  },
  tituloReceta: {
    fontSize: fontSize.md,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  verMasButton: {
    marginVertical: spacing.md,
  },
});