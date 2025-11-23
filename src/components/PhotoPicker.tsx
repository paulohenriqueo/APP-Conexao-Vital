import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system"; // ← IMPORTAÇÃO CORRETA
import { Camera, Images } from "phosphor-react-native";
import { colors } from "../../styles/colors";

interface PhotoPickerProps {
  value?: string | null;          // recebe foto base64 ou URL
  onChange: (uri: string) => void; // envia foto em base64 para o hook
}

export function PhotoPicker({ value, onChange }: PhotoPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  // ---------------------------------------------------
  // Converte uri local → base64
  // ---------------------------------------------------
  const convertToBase64 = async (fileUri: string) => {
    try {
      return await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (err) {
      console.error("Erro ao converter imagem em base64:", err);
      return null;
    }
  };

  // ---------------------------------------------------
  // GALERIA
  // ---------------------------------------------------
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Precisamos da permissão para acessar sua galeria!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const base64 = await convertToBase64(uri);

      if (base64) {
        onChange(`data:image/jpeg;base64,${base64}`);
      }
    }

    setModalVisible(false);
  };

  // ---------------------------------------------------
  // CÂMERA
  // ---------------------------------------------------
  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Precisamos da permissão para usar a câmera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const base64 = await convertToBase64(uri);

      if (base64) {
        onChange(`data:image/jpeg;base64,${base64}`);
      }
    }

    setModalVisible(false);
  };

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
    <View
      style={{
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        zIndex: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 8,
      }}
    >
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <View
          style={{
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: "#f3f3f3",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {value ? (
            <Image
              source={{ uri: value }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <>
              <Camera size={40} color={colors.gray73} />
              <Text style={{ color: colors.gray73, fontSize: 13 }}>
                Selecionar foto
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 12,
              width: 280,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 16,
                color: colors.gray23,
              }}
            >
              Como deseja adicionar sua foto de perfil?
            </Text>

            <TouchableOpacity
              onPress={pickFromCamera}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.grayE8,
                alignItems: "center",
              }}
            >
              <Camera size={40} color={colors.gray73} />
              <Text style={{ color: colors.gray23 }}>
                Tirar uma nova foto
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickFromGallery}
              style={{
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Images size={40} color={colors.gray73} />
              <Text style={{ color: colors.gray23 }}>
                Escolher da galeria
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
