// app/(tabs)/chat.tsx (Modificado para Asesor Comercial)
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useChat } from "@/src/presentation/hooks/useChat";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { Mensaje } from "@/src/domain/models/Mensaje";



import { colors, fontSize, spacing, borderRadius } from "@/src/styles/theme";


export default function ChatScreen() {
  const { mensajes, cargando, enviando, enviarMensaje, usuariosEscribiendo, setInputTexto, inputTexto } = useChat();
  const { usuario } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (mensajes.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [mensajes]);

  const handleEnviar = async () => {
    if (!inputTexto.trim() || enviando) return;
    const mensaje = inputTexto;
    setInputTexto("");
    const resultado = await enviarMensaje(mensaje);
    if (!resultado.success) {
      alert("Error: " + resultado.error);
      setInputTexto(mensaje);
    }
  };

  const renderMensaje = ({ item }: { item: Mensaje }) => {
    const esMio = item.usuario_id === usuario?.id;
    const emailUsuario = item.usuario?.email || "Usuario desconocido";
    return (
      <View
        style={[
          styles.mensajeContainer,
          esMio ? styles.mensajeMio : styles.mensajeOtro,
        ]}
      >
        {!esMio && (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{emailUsuario.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={[styles.contenidoMensajeContainer, esMio && styles.contenidoMensajeMio]}>
          <Text style={[styles.contenidoMensaje, esMio && styles.contenidoMensajeMio]}>
            {item.contenido}
          </Text>
          <Text style={[styles.horaMensaje, esMio && styles.horaMensajeMio]}>
            {new Date(item.created_at).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
    );
  };

  const renderUsuariosEscribiendo = () => {
    if (usuariosEscribiendo.length === 0) return null;
    const otrosUsuariosEscribiendo = usuariosEscribiendo.filter(id => id !== usuario?.id);
    if (otrosUsuariosEscribiendo.length === 0) return null;
    return (
      <View style={styles.indicadorEscrituraContainer}>
        <Text style={styles.indicadorEscrituraTexto}>
          {otrosUsuariosEscribiendo.length} usuario(s) están escribiendo...
        </Text>
      </View>
    );
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.textoCargando}>Cargando mensajes...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      {/* Barra superior */}
      <View style={styles.headerBar}>
        <View style={styles.rolLabelContainer}>
          <Text style={styles.rolLabel}>Asesor Comercial</Text>
        </View>
        <Text style={styles.headerTitle}>Conversaciones</Text>
        <TouchableOpacity style={styles.menuButton}>
          
          {/* <Text style={styles.menuIcon}>☰</Text> */}

        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={mensajes}
        renderItem={renderMensaje}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListFooterComponent={renderUsuariosEscribiendo}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputTexto}
          onChangeText={setInputTexto}
          placeholder="Escribe un mensaje..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.botonEnviar,
            (!inputTexto.trim() || enviando) && styles.botonDeshabilitado,
          ]}
          onPress={handleEnviar}
          disabled={!inputTexto.trim() || enviando}
        >
          <Text style={styles.textoBotonEnviar}>
            {enviando ? "..." : "Enviar"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textoCargando: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  listContainer: {
    padding: 16,
  },
  mensajeContainer: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mensajeMio: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF", // Azul
  },
  mensajeOtro: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF", // Blanco
    borderWidth: 1,
    borderColor: "#E0E0E0", // Gris claro
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF", // Azul
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  contenidoMensajeContainer: {
    flex: 1,
  },
  contenidoMensaje: {
    fontSize: 16,
    color: "#000", // Negro
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0F0F0', // Gris muy claro
  },
  contenidoMensajeMio: {
    color: "#FFF",
    backgroundColor: '#007AFF', // Azul
  },
  horaMensaje: {
    fontSize: 10,
    color: "#999", // Gris medio
    marginTop: 4,
    alignSelf: "flex-end",
  },
  horaMensajeMio: {
    color: "rgba(255, 255, 255, 0.7)", // Blanco semi-transparente
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFF", // Blanco
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0", // Gris claro
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F5F5F5", // Gris muy claro
    borderRadius: 20,
    fontSize: 16,
  },
  botonEnviar: {
    marginLeft: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    justifyContent: "center",
  },
  botonDeshabilitado: {
    backgroundColor: "#CCC", // Gris
  },
  textoBotonEnviar: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  indicadorEscrituraContainer: {
    padding: 8,
    alignItems: 'flex-start',
  },
  indicadorEscrituraTexto: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666', // Gris oscuro
  },
  // NUEVO: Estilos para la barra superior
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  rolLabelContainer: {
    backgroundColor: '#00C853', 
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  rolLabel: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    flex: 1,
    marginLeft: spacing.sm,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: fontSize.lg,
    color: colors.white,
  },
});