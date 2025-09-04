import React, { useState } from "react";
import { View, Text, Image, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { styles, typography } from "./styles";
import Logo from "../assets/logo.png";
import { colors } from "../../styles/colors";
import { Input, InputPassword } from "../components/Input";
import { PrimaryButton, GoogleButton } from "../components/Button";

export default function Cadastro() {
  const navigation = useNavigation<any>();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCadastro = () => {
    console.log("Cadastro pressionado");
    Alert.alert("Cadastro concluído com sucesso!");
    navigation.navigate("Login"); // simulação
  };

  const handleCadastroGoogle = () => {
    console.log("Cadastro com Google pressionado");
    Alert.alert("Cadastro com Google concluído com sucesso!");
    navigation.navigate("Login"); // simulação
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
        horizontal={false}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.boxTop}>
          <Image source={Logo} style={styles.logoLogin} />
          <Text style={typography.M0L3644}>Cadastrar</Text>
        </View>

        <View style={styles.containerBox}>
          <Input placeholder="Nome completo" value={nome} onChangeText={setNome} />
          <Input placeholder="E-mail" value={email} onChangeText={setEmail} />
          <InputPassword placeholder="Senha" value={password} onChangeText={setPassword} showForgotPassword={false} />
          <InputPassword placeholder="Repita a senha" value={confirmPassword} onChangeText={setConfirmPassword} showForgotPassword={false} />
          <Text style={{ ...typography.M01R1014, color: colors.gray75 }}>
            Ao cadastrar, você aceita os{" "}
            <Text style={{ color: colors.green382 }} onPress={() => navigation.navigate("Termos")}>Termos de Uso</Text> e a{" "}
            <Text style={{ color: colors.green382 }} onPress={() => navigation.navigate("Politica")}>Política de Privacidade</Text>.
          </Text>

          <PrimaryButton title="Criar conta" onPress={handleCadastro} />

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>
          <GoogleButton onPress={handleCadastroGoogle} />
        </View>

        <View style={{ ...styles.boxBottom, marginTop: 16 }}>
          {'    '}
          <Text style={typography.M01R1624}>
            Já possui cadastro?{" "}
            <Text
              style={{ color: colors.green85F }}
              onPress={() => navigation.navigate("Login")}
            >
              Acesse sua conta
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
