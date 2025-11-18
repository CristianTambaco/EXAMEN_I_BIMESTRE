// app/plan/crear.tsx (Modificado)
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
  borderRadius,
} from "../../src/styles/theme";

export default function CrearPlanScreen() {
  const { usuario, esAsesorComercial } = useAuth();
  const { crear } = usePlanes();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [datosMoviles, setDatosMoviles] = useState("");
  const [minutosVoz, setMinutosVoz] = useState("");
  const [promocion, setPromocion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleCrear = async () => {
    if (!nombre || !precio || !datosMoviles || !minutosVoz) {
      Alert.alert("Error", "Completa todos los campos obligatorios");
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
      segmento: "General",
      publico_objetivo: descripcion,
      datos_móviles: datosMoviles,
      minutos_voz: minutosVoz,
      sms: "0",
      velocidad_4g: "10 Mbps",
      redes_sociales: "Sí",
      whatsapp: "Sí",
      llamadas_internacionales: "No",
      roaming: "No",
      promocion: promocion,
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
            router.push("/(asesor)/dashboard");
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
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.push("/(asesor)/dashboard")}>
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
      {/* Barra superior */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.push("/(asesor)/dashboard")}>
          <Text style={styles.botonVolver}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Nuevo Plan</Text>
      </View>

      <View style={globalStyles.contentPadding}>
        {/* Formulario */}
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Nombre del Plan"
          value={nombre}
          onChangeText={setNombre}
          placeholderTextColor={colors.textSecondary}
        />
        <View style={styles.rowInputs}>
          <TextInput
            style={[globalStyles.input, styles.inputField, styles.halfInput]}
            placeholder="Precio Mensual ($)"
            value={precio}
            onChangeText={setPrecio}
            keyboardType="decimal-pad"
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={[globalStyles.input, styles.inputField, styles.halfInput]}
            placeholder="Gigas de Datos"
            value={datosMoviles}
            onChangeText={setDatosMoviles}
            keyboardType="numeric"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Minutos de Llamadas"
          value={minutosVoz}
          onChangeText={setMinutosVoz}
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={[globalStyles.input, styles.inputField, styles.multilineInput]}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={4}
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Promoción (Opcional)"
          value={promocion}
          onChangeText={setPromocion}
          placeholderTextColor={colors.textSecondary}
        />

        {/* Imagen del Plan (Placeholder) */}
        <Text style={styles.imageLabel}>Imagen del Plan</Text>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>🖼️</Text>
        </View>

        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonPrimary, styles.botonCrear]}
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
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  botonVolver: {
    fontSize: fontSize.md,
    color: colors.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    flex: 1,
  },
  inputField: {
    marginBottom: spacing.md,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  halfInput: {
    flex: 1,
    marginRight: spacing.sm,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imageLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  imagePlaceholderText: {
    fontSize: fontSize.xxxl,
    color: colors.textSecondary,
  },
  botonCrear: {
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  textoNoAsesor: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});