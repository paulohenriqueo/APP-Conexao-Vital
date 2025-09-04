import React, { useState } from "react";
import { View, Text, Image, Alert } from "react-native";

import { styles, typography } from "./styles";
import Logo from "../assets/logo.png";
import { InputPassword } from "../components/Input";
import { PrimaryButton } from "../components/Button";
import { useNavigation } from "@react-navigation/native";


export default function NovaSenha() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation<any>();

  const handleNovaSenha = () => {
    if (!password || !confirmPassword) {
      Alert.alert("Preencha todos os campos.");
    } else if (password !== confirmPassword) {
      Alert.alert("As senhas não coincidem.");
    }else {
      Alert.alert("Senha redefinida com sucesso!");
      navigation.navigate("Login"); // simulação
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxTop}>
        <Image source={Logo} style={styles.logoLogin} />
        <Text style={typography.M0L3644}>Criar nova senha</Text>
      </View>

      <View style={styles.containerBox}>
        <InputPassword
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          showForgotPassword={false}
        />
        <InputPassword
          placeholder="Repita a senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          showForgotPassword={false}
        />
        <PrimaryButton title="Concluir" onPress={handleNovaSenha} />
      </View>
    </View>
  );
}
