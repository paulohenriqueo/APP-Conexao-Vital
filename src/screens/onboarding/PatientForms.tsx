import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { colors, styles, typography } from "../../../styles/styles";
import { Input } from "../../components/Input";

export default function PatientForms({ navigation }: any) {
  const [birthDate, setBirthDate] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleContinue = () => {
   navigation.navigate("Home");
  };

  const handleSelectPhoto = () => {
    // lógica para selecionar foto
  };

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
          <Input
            placeholder="Data de nascimento"
            value={birthDate}
            onChangeText={setBirthDate}
          />
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
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Finalizar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}