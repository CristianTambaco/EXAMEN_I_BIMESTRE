// app/plan/editar.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/presentation/hooks/useAuth";
import { usePlanes } from "../../src/presentation/hooks/usePlanes";
import { globalStyles } from "../../src/styles/globalStyles";
import { colors, fontSize, spacing } from "../../src/styles/theme";
import { supabase } from "../../src/data/services/supabaseClient";
import { Plan } from "../../src/domain/models/Plan";

export default function EditarPlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario, esAsesorComercial } = useAuth();
  const { actualizar } = usePlanes();
  const router = useRouter();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoGuardado, setCargandoGuardado] = useState(false);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [segmento, setSegmento] = useState("");
  const [publicoObjetivo, setPublicoObjetivo] = useState("");
  const [datosMoviles, setDatosMoviles] = useState("");
  const [minutosVoz, setMinutosVoz] = useState("");
  const [sms, setSms] = useState("");
  const [velocidad4g, setVelocidad4g] = useState("");
  const [redesSociales, setRedesSociales] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [llamadasInternacionales, setLlamadasInternacionales] = useState("");
  const [roaming, setRoaming] = useState("");

  useEffect(() => {
    if (!id) return;
    cargarPlanEspecifico(id);
  }, [id]);

  const cargarPlanEspecifico = async (planId: string) => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("planes_moviles")
        .select("*")
        .eq("id", planId)
        .single();
      if (error) throw error;
      setPlan(data as Plan);
      setNombre(data.nombre_comercial);
      setPrecio(data.precio.toString());
      setSegmento(data.segmento);
      setPublicoObjetivo(data.publico_objetivo);
      setDatosMoviles(data.datos_móviles);
      setMinutosVoz(data.minutos_voz);
      setSms(data.sms);
      setVelocidad4g(data.velocidad_4g);
      setRedesSociales(data.redes_sociales);
      setWhatsapp(data.whatsapp);
      setLlamadasInternacionales(data.llamadas_internacionales);
      setRoaming(data.roaming);
    } catch (error) {
      console.error("Error al cargar el plan:", error);
      Alert.alert("Error", "No se pudo cargar el plan");
      router.push("/(tabs)/misPlanes");
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async () => {
    if (!nombre || !precio) {
      Alert.alert("Error", "Completa los campos obligatorios (Nombre y Precio)");
      return;
    }
    if (!plan || !usuario || plan.asesor_id !== usuario.id) {
        Alert.alert("Error", "No tienes permiso para editar este plan.");
        return;
    }
    setCargandoGuardado(true);
    const planData = {
        nombre_comercial: nombre,
        precio: parseFloat(precio),
        segmento,
        publico_objetivo: publicoObjetivo,
        datos_móviles: datosMoviles,
        minutos_voz: minutosVoz,
        sms,
        velocidad_4g: velocidad4g,
        redes_sociales: redesSociales,
        whatsapp,
        llamadas_internacionales: llamadasInternacionales,
        roaming,
    };
    const resultado = await actualizar(plan.id, planData);
    setCargandoGuardado(false);
    if (resultado.success) {
      Alert.alert("Éxito", "Plan actualizado correctamente", [
        { text: "OK", onPress: () => router.push("/(tabs)/misPlanes") },
      ]);
    } else {
      Alert.alert("Error", resultado.error || "No se pudo actualizar");
    }
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
            onPress={() => router.push("/(tabs)/misPlanes")}
            >
            <Text style={globalStyles.buttonText}>Volver</Text>
            </TouchableOpacity>
        </View>
     );
  }

  if (plan.asesor_id !== usuario?.id) {
    return (
      <View style={globalStyles.containerCentered}>
        <Text style={globalStyles.textSecondary}>No tienes permiso para editar este plan.</Text>
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonPrimary, { marginTop: spacing.md }]}
          onPress={() => router.push("/(tabs)/misPlanes")}
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
          <TouchableOpacity onPress={() => router.push("/(tabs)/misPlanes")}>
            <Text style={styles.botonVolver}>← Volver</Text>
          </TouchableOpacity>
          <Text style={globalStyles.title}>Editar Plan</Text>
        </View>
        <TextInput style={globalStyles.input} placeholder="Nombre Comercial *" value={nombre} onChangeText={setNombre} />
        <TextInput style={globalStyles.input} placeholder="Precio *" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
        <TextInput style={globalStyles.input} placeholder="Segmento" value={segmento} onChangeText={setSegmento} />
        <TextInput style={globalStyles.input} placeholder="Público Objetivo" value={publicoObjetivo} onChangeText={setPublicoObjetivo} />
        <TextInput style={globalStyles.input} placeholder="Datos Móviles" value={datosMoviles} onChangeText={setDatosMoviles} />
        <TextInput style={globalStyles.input} placeholder="Minutos de Voz" value={minutosVoz} onChangeText={setMinutosVoz} />
        <TextInput style={globalStyles.input} placeholder="SMS" value={sms} onChangeText={setSms} />
        <TextInput style={globalStyles.input} placeholder="Velocidad 4G" value={velocidad4g} onChangeText={setVelocidad4g} />
        <TextInput style={globalStyles.input} placeholder="Redes Sociales" value={redesSociales} onChangeText={setRedesSociales} />
        <TextInput style={globalStyles.input} placeholder="WhatsApp" value={whatsapp} onChangeText={setWhatsapp} />
        <TextInput style={globalStyles.input} placeholder="Llamadas Internacionales" value={llamadasInternacionales} onChangeText={setLlamadasInternacionales} />
        <TextInput style={globalStyles.input} placeholder="Roaming" value={roaming} onChangeText={setRoaming} />
        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.buttonPrimary,
            styles.botonGuardar,
          ]}
          onPress={handleGuardar}
          disabled={cargandoGuardado}
        >
          {cargandoGuardado ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={globalStyles.buttonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>
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
  botonGuardar: {
    padding: spacing.lg,
    marginTop: spacing.md,
  },
});