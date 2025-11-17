// app/plan/crear.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import {
  colors,
  fontSize,
  spacing,
} from "../../src/styles/theme";

export default function CrearPlanScreen() {
  const { usuario, esAsesorComercial } = useAuth();
  const { crear } = usePlanes();
  const router = useRouter();

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
  const [cargando, setCargando] = useState(false);

  const handleCrear = async () => {
    if (!nombre || !precio) {
      Alert.alert("Error", "Completa los campos obligatorios (Nombre y Precio)");
      return;
    }
    if (!usuario) {
        Alert.alert("Error", "Usuario no autenticado");
        return;
    }
    setCargando(true);
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
        asesor_id: usuario.id,
        activo: true,
    };
    const resultado = await crear(planData);
    setCargando(false);
    if (resultado.success) {
      Alert.alert("Éxito", "Plan creado correctamente", [
        {
          text: "OK",
          onPress: () => {
            router.push("/(tabs)/misPlanes");
          },
        },
      ]);
    } else {
      Alert.alert("Error", resultado.error || "No se pudo crear el plan");
    }
  };

  if (!esAsesorComercial) {
    return (
      <View style={globalStyles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/(tabs)")}>
            <Text style={styles.botonVolver}>← Volver</Text>
          </TouchableOpacity>
        </View>
        <View style={globalStyles.containerCentered}>
          <Text style={styles.textoNoAsesor}>
            Esta sección es solo para asesores comerciales 💼
          </Text>
        </View>
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
          <Text style={globalStyles.title}>Nuevo Plan</Text>
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
            styles.botonCrear,
          ]}
          onPress={handleCrear}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={globalStyles.buttonText}>Crear Plan</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.sm,
  },
  botonVolver: {
    fontSize: fontSize.md,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  textoNoAsesor: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  botonCrear: {
    marginTop: spacing.sm,
    padding: spacing.lg,
  },
});