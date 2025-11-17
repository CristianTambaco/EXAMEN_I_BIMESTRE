// app/(tabs)/rutinasAsignadas.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

export default function RutinasAsignadasScreen() {
  const { usuario, esUsuarioRegistrado, esAsesorComercial } = useAuth();
  const { cargarContratacionesUsuario } = useContrataciones();
  const [contrataciones, setContrataciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (esUsuarioRegistrado && usuario?.id) {
      cargarDatos(usuario.id);
    }
  }, [esUsuarioRegistrado, usuario?.id]);

  const cargarDatos = async (userId: string) => {
    setCargando(true);
    const data = await cargarContratacionesUsuario(userId);
    setContrataciones(data);
    setCargando(false);
  };

  if (esAsesorComercial) {
    return (
      <View style={globalStyles.containerCentered}>
        <Text style={styles.textoNoUsuario}>
          Esta sección es solo para usuarios registrados 📱
        </Text>
      </View>
    );
  }

  const handleRefresh = async () => {
    setRefrescando(true);
    if (usuario?.id) {
      await cargarDatos(usuario.id);
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

  const renderEstado = (estado: string) => {
    let color = colors.warning;
    if (estado === 'aprobada') {
      color = colors.success;
    } else if (estado === 'rechazada') {
      color = colors.danger;
    }
    return (
      <Text style={[globalStyles.textSecondary, { color, fontWeight: '600' }]}>
        {estado}
      </Text>
    );
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Mis Contrataciones</Text>
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
            No tienes contrataciones
          </Text>
        }
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <Text style={styles.tituloPlan}>{item.planes_moviles.nombre_comercial}</Text>
            <Text style={globalStyles.textSecondary}>Estado: {renderEstado(item.estado)}</Text>
            <Text style={globalStyles.textSecondary}>Fecha: {new Date(item.fecha_contratacion).toLocaleDateString('es-ES')}</Text>
            {item.observaciones && (
              <Text style={globalStyles.textSecondary}>Observaciones: {item.observaciones}</Text>
            )}
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonPrimary, styles.botonChat]}
              onPress={() => router.push("/(tabs)/chat")}
            >
              <Text style={globalStyles.buttonText}>Chat con Asesor</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textoNoUsuario: {
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
  botonChat: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
});