import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, styles, typography } from "../../../../styles/styles";
import { Input } from "../../../components/Input";
import { Picker } from "@react-native-picker/picker";
import { saveCaregiverForm } from "../../../services/CaregiverService";

export default function CaregiverForms({ navigation }: any) {
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
  const [saving, setSaving] = useState(false);

  const handleContinue = async () => {
    // validações simples (adicione as que precisar)
    if (!cpf || !birthDate) {
      Alert.alert("Atenção", "Preencha CPF e data de nascimento antes de continuar.");
      return;
    }
    setSaving(true);
    const payload = {
      cpf,
      birthDate,
      phone,
      gender,
      cep,
      street,
      city,
      state,
    };
    const res = await saveCaregiverForm(payload);
    setSaving(false);
    if (res.ok) {
      navigation.navigate("CaregiverSpecifications");
    } else {
      Alert.alert("Erro", "Não foi possível salvar os dados. Tente novamente.");
      console.error(res.error);
    }
  };

  const handleSelectPhoto = () => {
    // lógica para selecionar foto
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDateObj(selectedDate);
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const year = selectedDate.getFullYear();
      setBirthDate(`${day}/${month}/${year}`);
    }
  };

  // Função para aplicar a máscara no telefone
  function maskPhone(value: string) {
    let cleaned = value.replace(/\D/g, "");
    cleaned = cleaned.slice(0, 11);
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }

  function maskCpf(value: string) {
    let cleaned = value.replace(/\D/g, "");
    cleaned = cleaned.slice(0, 11);
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
          paddingTop: 80,
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
            <Text style={{ color: colors.gray73, fontSize: 15, textAlign: "center" }}>
              Selecione uma{"\n"}foto
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.containerBox,
            {
              width: "90%",
              maxWidth: 400,
              marginTop: -70,
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
          <Input
            placeholder="CPF"
            value={cpf}
            onChangeText={text => setCpf(maskCpf(text))}
            keyboardType="numeric"
            maxLength={14}
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
            <Input placeholder="Data de nascimento" value={birthDate} editable={false} pointerEvents="none" />
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
          <Input placeholder="Rua" value={street} onChangeText={setStreet} />
          <Input placeholder="Cidade" value={city} onChangeText={setCity} />
          <Input placeholder="Estado" value={state} onChangeText={setState} />

          <TouchableOpacity
            style={{
              backgroundColor: colors.green382,
              borderRadius: 8,
              width: "100%",
              alignItems: "center",
              paddingVertical: 14,
              marginTop: 8,
            }}
            onPress={handleContinue}
            disabled={saving}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              {saving ? "Salvando..." : "Continuar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}