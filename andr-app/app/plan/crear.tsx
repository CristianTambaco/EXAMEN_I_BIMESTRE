// app/plan/crear.tsx (Versión actualizada)
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
import { useRutinas } from "../../src/presentation/hooks/useRutinas"; // Importamos useRutinas
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
  const { subirFotoProgreso } = useRutinas(); // Obtenemos la función de subida de imagen
  const router = useRouter();

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [segmento, setSegmento] = useState("General");
  const [publicoObjetivo, setPublicoObjetivo] = useState("");
  const [datosMoviles, setDatosMoviles] = useState("");
  const [minutosVoz, setMinutosVoz] = useState("");
  const [sms, setSms] = useState("");
  const [velocidad4g, setVelocidad4g] = useState("");
  const [redesSociales, setRedesSociales] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [llamadasInternacionales, setLlamadasInternacionales] = useState("");
  const [roaming, setRoaming] = useState("");
  const [promocion, setPromocion] = useState(""); // Campo opcional

  // Estado para la imagen
  const [imagenUri, setImagenUri] = useState<string | null>(null); // URI local de la nueva imagen seleccionada

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

    let imagenUrlFinal = null; // Inicializamos la URL de la imagen

    // Si hay una nueva imagen seleccionada localmente (file://), la subimos
    if (imagenUri && imagenUri.startsWith('file://')) {
      try {
        // Subir la nueva imagen usando la utilidad de RutinasUseCase
        imagenUrlFinal = await subirFotoProgreso(imagenUri);
      } catch (uploadError) {
        console.error("Error al subir la imagen:", uploadError);
        Alert.alert("Error", "No se pudo subir la imagen. El plan se creará sin imagen.");
        // Continuamos con la creación del plan, pero sin imagen
        imagenUrlFinal = null;
      }
    }
    // Si imagenUri es una URL (por ejemplo, cargada previamente), la usamos directamente
    else if (imagenUri && !imagenUri.startsWith('file://')) {
      imagenUrlFinal = imagenUri;
    }
    // Si imagenUri es null, imagenUrlFinal seguirá siendo null

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
      promocion: promocion, // Incluir la promoción si se ha ingresado
      asesor_id: usuario.id,
      activo: true,
      imagen_url: imagenUrlFinal, // Incluir la URL de la imagen en los datos a crear
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

  const handleSeleccionarImagen = async () => {
    Alert.alert("Agregar Foto", "¿Cómo quieres agregar la foto del plan?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "📷 Cámara",
        onPress: async () => {
          const uri = await tomarFoto();
          if (uri) {
            setImagenUri(uri);
          }
        },
      },
      {
        text: "🖼️ Galería",
        onPress: async () => {
          const uri = await seleccionarImagen();
          if (uri) {
            setImagenUri(uri);
          }
        },
      },
    ]);
  };

  // Funciones auxiliares para la selección de imagen
  const seleccionarImagen = async (): Promise<string | null> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Necesitamos permisos para acceder a tus fotos');
        return null;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      return null;
    }
  };

  const tomarFoto = async (): Promise<string | null> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Necesitamos permisos para usar la cámara");
        return null;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error("Error al tomar foto:", error);
      return null;
    }
  };

  if (!esAsesorComercial) {
    return (
      <View style={globalStyles.container}>

        {/* Barra superior */}
        
        {/* <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.push("/(asesor)/dashboard")}>
            <Text style={styles.botonVolver}>← Volver</Text>
          </TouchableOpacity>
        </View> */}

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

        {/* <TouchableOpacity onPress={() => router.push("/(asesor)/dashboard")}>
          <Text style={styles.botonVolver}>← Volver</Text>
        </TouchableOpacity> */}

        <Text style={styles.headerTitle}>Crear Nuevo Plan</Text>
      </View>

      <View style={globalStyles.contentPadding}>
        {/* Formulario */}
        <Text style={globalStyles.subtitle}>Nombre Comercial *</Text>
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Nombre Comercial *"
          value={nombre}
          onChangeText={setNombre}
          placeholderTextColor={colors.textSecondary}
        />

        <View style={styles.rowInputs}>
          <View style={styles.columnInput}>
            <Text style={globalStyles.subtitle}>Precio Mensual ($)</Text>
            <TextInput
              style={[globalStyles.input, styles.halfInput]}
              placeholder="Precio Mensual ($)"
              value={precio}
              onChangeText={setPrecio}
              keyboardType="decimal-pad"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.columnInput}>
            <Text style={globalStyles.subtitle}>Segmento</Text>
            <TextInput
              style={[globalStyles.input, styles.halfInput]}
              placeholder="Segmento"
              value={segmento}
              onChangeText={setSegmento}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        <Text style={globalStyles.subtitle}>Público Objetivo</Text>
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Público Objetivo"
          value={publicoObjetivo}
          onChangeText={setPublicoObjetivo}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={globalStyles.subtitle}>Datos Móviles</Text>
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Datos Móviles"
          value={datosMoviles}
          onChangeText={setDatosMoviles}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={globalStyles.subtitle}>Minutos de Voz</Text>
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Minutos de Voz"
          value={minutosVoz}
          onChangeText={setMinutosVoz}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={globalStyles.subtitle}>SMS</Text>
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="SMS"
          value={sms}
          onChangeText={setSms}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={globalStyles.subtitle}>Velocidad 4G</Text>
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Velocidad 4G"
          value={velocidad4g}
          onChangeText={setVelocidad4g}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={globalStyles.subtitle}>Redes Sociales</Text>
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Redes Sociales"
          value={redesSociales}
          onChangeText={setRedesSociales}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={globalStyles.subtitle}>WhatsApp</Text>
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="WhatsApp"
          value={whatsapp}
          onChangeText={setWhatsapp}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={globalStyles.subtitle}>Llamadas Internacionales</Text>
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Llamadas Internacionales"
          value={llamadasInternacionales}
          onChangeText={setLlamadasInternacionales}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={globalStyles.subtitle}>Roaming</Text>
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Roaming"
          value={roaming}
          onChangeText={setRoaming}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={globalStyles.subtitle}>Promoción (Opcional)</Text>
        <TextInput
          style={[globalStyles.input, styles.inputField]}
          placeholder="Promoción (Opcional)"
          value={promocion}
          onChangeText={setPromocion}
          placeholderTextColor={colors.textSecondary}
        />

        {/* Sección de subida de imagen */}
        <Text style={styles.imageLabel}>Imagen del Plan</Text>
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.buttonSecondary, styles.botonSubirImagen]}
          onPress={handleSeleccionarImagen}
        >
          <Text style={globalStyles.buttonText}>
            {imagenUri ? "📷 Cambiar Foto" : "📷 Subir Foto del Plan"}
          </Text>
        </TouchableOpacity>

        {/* Vista previa de la imagen seleccionada */}
        {imagenUri && (
          <Image source={{ uri: imagenUri }} style={styles.vistaPrevia} />
        )}

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

// Importaciones adicionales necesarias
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

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
  columnInput: {
    flex: 1,
    marginRight: spacing.sm,
  },
  imageLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  botonSubirImagen: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  vistaPrevia: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginVertical: spacing.md,
    backgroundColor: colors.borderLight,
  },
  botonCrear: {
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  textoNoAsesor: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});