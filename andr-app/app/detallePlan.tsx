// app/detallePlan.tsx (Modificado para cargar el plan específico)
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
  borderRadius,
  shadows
} from "../src/styles/theme";
import { supabase } from "../src/data/services/supabaseClient";
import { Plan } from "../src/domain/models/Plan";

export default function DetallePlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario } = useAuth();
  const { crear } = usePlanes(); // 
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
      Alert.alert("Debes iniciar sesión para continuar.");
      return;
    }
    if (!plan) {
      Alert.alert("Error", "Plan no disponible.");
      return;
    }


    router.push("/(tabs)/misPlanes"); 
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
      <View style={styles.planCard}>
        {/* Encabezado con gradiente (simulado con color sólido o imagen) */}
        <View style={styles.headerGradient}>
          {/* Aquí podrías usar una imagen o un gradiente real si es necesario */}
        </View>
        <View style={styles.planContent}>
          <Text style={styles.planTitle}>{plan.nombre_comercial}</Text>
          <Text style={styles.planPrice}>${plan.precio}/mes</Text>
          {/* Características del plan */}
          <View style={styles.featuresContainer}>
            {plan.redes_sociales && (
              <View style={styles.featureBadge}>
                <Text style={styles.featureBadgeText}>{plan.redes_sociales}</Text>
              </View>
            )}
            <Text style={styles.featureDescription}>{plan.publico_objetivo}</Text>
            <View style={styles.featureIcons}>
              <Text style={styles.featureIcon}>📱 {plan.datos_móviles}</Text>
              <Text style={styles.featureIcon}>📞 {plan.minutos_voz}</Text>
            </View>
          </View>
          {/* Botón "Ver Detalles" */}

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={handleContratar}
          >
            <Text style={styles.buttonText}>Ver Detalles.</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  planCard: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.white,
    ...shadows.medium,
  },
  headerGradient: {
    height: 150,
    backgroundColor: '#00BFFF', // Color azul cian como en la imagen (puedes usar un gradiente real)
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