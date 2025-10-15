import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, styles, typography } from "../../../../styles/styles";
import { Input } from "../../../components/Input";
import { Picker } from "@react-native-picker/picker";

export default function PatientForms({ navigation }: any) {
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthDateObj, setBirthDateObj] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
   navigation.navigate("PatientCondition");
  };

  const handleSelectPhoto = () => {
    // lógica para selecionar foto
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDateObj(selectedDate);
      // Formata para dd/mm/yyyy
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const year = selectedDate.getFullYear();
      setBirthDate(`${day}/${month}/${year}`);
    }
  };

  // Função para aplicar a máscara
  function maskPhone(value: string) {
    // Remove tudo que não for número
    let cleaned = value.replace(/\D/g, "");
    // Limita a 11 dígitos
    cleaned = cleaned.slice(0, 11);
    // Aplica a máscara
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 7)
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  function maskCpf(value: string) {
    // Remove tudo que não for número
    let cleaned = value.replace(/\D/g, "");
    // Limita a 11 dígitos
    cleaned = cleaned.slice(0, 11);
    // Aplica a máscara
    if (cleaned.length <= 3) {
        return cleaned;
    } else if (cleaned.length <= 6) {
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    } else if (cleaned.length <= 9) {
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    } else {
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
    }

  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.green382 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 80, // aumenta o espaço do topo
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            typography.montserratBold,
            {
              color: colors.whiteFBFE,
              fontSize: 22,
              marginBottom: 24,
              alignSelf: "center",
            },
          ]}
        >
          Complete seu cadastro
        </Text>
        {/* Template da foto */}
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
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
            onPress={handleSelectPhoto}
            activeOpacity={0.7}
          >
            {/* <Image
              source={require("../../../assets/camera.png")} // Substitua pelo seu ícone de câmera
              style={{ width: 56, height: 56, tintColor: colors.gray73, marginBottom: 8 }}
              resizeMode="contain"
            /> */}
            <Text style={{ color: colors.gray73, fontSize: 15, textAlign: "center" }}>
              Selecione uma{"\n"}foto
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card do formulário */}
        <View
          style={[
            styles.containerBox,
            {
              width: "90%",
              maxWidth: 400,
              marginTop: -70, // para encaixar o círculo da foto
              paddingTop: 80,
              paddingBottom: 24,
              borderRadius: 24,
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
            },
          ]}
        >

          {/* Campo CPF */}
          <Input 
          placeholder="CPF" 
          value={cpf} 
          onChangeText={text => setCpf(maskCpf(text))}
          keyboardType="numeric"
          maxLength={14}
          />

          {/* Campo Data de Nascimento com calendário */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
            <Input
              placeholder="Data de nascimento"
              value={birthDate}
              editable={false}
              pointerEvents="none"
            />
            {/* Ícone do calendário, se desejar */}
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthDateObj || new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
          <Input
            placeholder="Telefone"
            value={phone}
            onChangeText={text => setPhone(maskPhone(text))}
            keyboardType="numeric"
            maxLength={15}
          />
          <View
            style={{
              backgroundColor: colors.gray7FD,
              borderRadius: 8,
              marginBottom: 12,
              borderWidth: 0,
              overflow: "hidden",
            }}
          >
            <Picker
              selectedValue={gender}
              onValueChange={setGender}
              style={{
                height: 58,
                color: gender ? colors.gray23 : colors.gray75,
                paddingLeft: 8,
              }}
              dropdownIconColor={colors.gray75}
            >
              <Picker.Item label="Selecione o gênero" value="" color={colors.gray75} />
              <Picker.Item label="Feminino" value="Feminino" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Outro" value="Outro" />
              <Picker.Item label="Prefiro não informar" value="Prefiro não informar" />
            </Picker>
          </View>
          <Input placeholder="CEP" value={cep} onChangeText={setCep} />
          <Input placeholder="Rua" value={street} onChangeText={setStreet}/>
          <Input placeholder="Cidade" value={city} onChangeText={setCity}/>
          <Input placeholder="Estado" value={state} onChangeText={setState}/>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 12,
              alignSelf: "flex-start",
            }}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 1.5,
                borderColor: agreed ? colors.green85F : colors.grayE8,
                backgroundColor: agreed ? colors.green85F : "#fff",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}
            >
              {agreed && (
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  ✓
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 13,
                color: colors.gray73,
                flexShrink: 1,
              }}
            >
              Declaro que todas as informações acima são verdadeiras
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: agreed ? colors.green382 : colors.grayE8,
              borderRadius: 8,
              width: "100%",
              alignItems: "center",
              paddingVertical: 14,
              marginTop: 8,
            }}
            onPress={handleContinue}
            disabled={!agreed}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}