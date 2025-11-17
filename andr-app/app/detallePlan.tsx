// app/detallePlan.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../src/presentation/hooks/useAuth";
import { usePlanes } from "../src/presentation/hooks/usePlanes";
import { globalStyles } from "../src/styles/globalStyles";
import {
  colors,
  fontSize,
  spacing,
} from "../src/styles/theme";
import { supabase } from "../src/data/services/supabaseClient";
import { Plan } from "../src/domain/models/Plan";

export default function DetallePlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario } = useAuth();
  const { crear } = usePlanes();
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;
    cargarPlanEspecifico(id);
  }, [id]);

  const cargarPlanEspecifico = async (planId: string) => {
    try {
      const { data, error } = await supabase
        .from("planes_moviles")
        .select("*")
        .eq("id", planId)
        .eq("activo", true)
        .single();
      if (error) throw error;
      setPlan(data as Plan);
    } catch (error) {
      console.error("Error al cargar el plan:", error);
      Alert.alert("Error", "No se pudo cargar el plan");
      router.back();
    } finally {
      setCargando(false);
    }
  };

  const handleContratar = async () => {
    if (!usuario) {
      Alert.alert("Error", "Debes iniciar sesión para contratar.");
      return;
    }
    if (!plan) {
      Alert.alert("Error", "Plan no disponible.");
      return;
    }
    Alert.alert("Éxito", "¡Solicitud de contratación enviada! Espera la aprobación del asesor.");
    router.push("/(tabs)/rutinasAsignadas");
  };

  if (cargando) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={globalStyles.textSecondary}>Cargando plan...</Text>
      </View>
    );
  }

  if (!plan) {
     return (
        <View style={globalStyles.containerCentered}>
            <Text style={globalStyles.textSecondary}>Plan no encontrado</Text>
            <TouchableOpacity
            style={[globalStyles.button, globalStyles.buttonPrimary, { marginTop: spacing.md }]}
            onPress={() => router.back()}
            >
            <Text style={globalStyles.buttonText}>Volver</Text>
            </TouchableOpacity>
        </View>
     );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.contentPadding}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.botonVolver}>← Volver</Text>
          </TouchableOpacity>
          <Text style={globalStyles.title}>{plan.nombre_comercial}</Text>
        </View>
        <Text style={styles.precio}>${plan.precio}/mes</Text>
        <View style={styles.detalleContainer}>
            <Text style={styles.detalleTitulo}>Información Básica</Text>
            <Text style={globalStyles.textSecondary}>Segmento: {plan.segmento}</Text>
            <Text style={globalStyles.textSecondary}>Público Objetivo: {plan.publico_objetivo}</Text>
        </View>
        <View style={styles.detalleContainer}>
            <Text style={styles.detalleTitulo}>Características Técnicas</Text>
            <Text style={globalStyles.textSecondary}>Datos Móviles: {plan.datos_móviles}</Text>
            <Text style={globalStyles.textSecondary}>Minutos de Voz: {plan.minutos_voz}</Text>
            <Text style={globalStyles.textSecondary}>SMS: {plan.sms}</Text>
            <Text style={globalStyles.textSecondary}>Velocidad 4G: {plan.velocidad_4g}</Text>
            <Text style={globalStyles.textSecondary}>Redes Sociales: {plan.redes_sociales}</Text>
            <Text style={globalStyles.textSecondary}>WhatsApp: {plan.whatsapp}</Text>
            <Text style={globalStyles.textSecondary}>Llamadas Internacionales: {plan.llamadas_internacionales}</Text>
            <Text style={globalStyles.textSecondary}>Roaming: {plan.roaming}</Text>
        </View>
        {usuario && (
            <TouchableOpacity
              style={[
                globalStyles.button,
                globalStyles.buttonPrimary,
                styles.botonContratar,
              ]}
              onPress={handleContratar}
            >
              <Text style={globalStyles.buttonText}>Contratar Plan</Text>
            </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  botonVolver: {
    fontSize: fontSize.md,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  precio: {
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  detalleContainer: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  detalleTitulo: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  botonContratar: {
    padding: spacing.lg,
    marginTop: spacing.md,
  },
});