import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import CheckBox from "@react-native-community/checkbox";

export default function PatientForms({ navigation }: any) {
  const [birthDate, setBirthDate] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Para o botão de selecionar foto, você pode integrar um picker depois
  const handleSelectPhoto = () => {
    // lógica para selecionar foto
  };

  const handleContinue = () => {
    // Validação e navegação para a próxima etapa
    // navigation.navigate("PatientFormsStep2");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#00996D" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Complete seu cadastro</Text>
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.photoCircle} onPress={handleSelectPhoto}>
            {/* <Image
              source={require("")} // Substitua pelo seu ícone de câmera
              style={{ width: 48, height: 48, tintColor: "#BDBDBD" }}
            /> */}
            <Text style={styles.photoText}>Selecione uma foto</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Data de nascimento"
            placeholderTextColor="#BDBDBD"
            value={birthDate}
            onChangeText={setBirthDate}
          />
          <TextInput
            style={styles.input}
            placeholder="CEP"
            placeholderTextColor="#BDBDBD"
            value={cep}
            onChangeText={setCep}
          />
          <TextInput
            style={styles.input}
            placeholder="Rua"
            placeholderTextColor="#BDBDBD"
            value={street}
            onChangeText={setStreet}
          />
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            placeholderTextColor="#BDBDBD"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder="Estado"
            placeholderTextColor="#BDBDBD"
            value={state}
            onChangeText={setState}
          />
          {/* <View style={styles.checkboxContainer}>
            <CheckBox value={agreed} onValueChange={setAgreed} />
            <Text style={styles.checkboxLabel}>
              Declaro que todas as informações acima são verdadeiras
            </Text>
          </View> */}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  skipButton: {
    position: "absolute",
    top: 40,
    right: 24,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 80,
    alignSelf: "center",
    marginBottom: 24,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: 24,
    flex: 1,
    alignItems: "center",
  },
  photoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  photoText: {
    color: "#BDBDBD",
    fontSize: 14,
    marginTop: 8,
  },
  input: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    alignSelf: "flex-start",
  },
  checkboxLabel: {
    fontSize: 13,
    color: "#888",
    marginLeft: 8,
    flexShrink: 1,
  },
  continueButton: {
    backgroundColor: "#00996D",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 8,
  },
});