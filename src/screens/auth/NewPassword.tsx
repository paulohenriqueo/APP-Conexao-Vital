import React, { useState } from "react";
import { View, Text, Image, Alert } from "react-native";

import { styles, typography } from "../../../styles/styles";
import Logo from "../../assets/logo.png";
import { InputPassword } from "../../components/Input";
import { PrimaryButton } from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import Register from "./Register";


export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleNewPassword = () => {
    setLoading(true);

    if (!password || !confirmPassword) {
      Alert.alert("Preencha todos os campos.");
    } else if (password !== confirmPassword) {
      Alert.alert("Senhas distintas", "As senhas não coincidem. Por favor, tente novamente.");
      return;
    } else {
      Alert.alert("Senha redefinida com sucesso!");
      navigation.navigate("Login"); // simulação
    }
  };

  const isStrongPassword = (password: string) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.boxTop, { flex: 1 }]}>
        <Image source={Logo} style={styles.logoLogin} />
        <Text style={typography.M0L3644}>Criar nova senha</Text>
      </View>

      <View style={[styles.containerBox, { marginBottom: "70%" }]}>
        <InputPassword placeholder="Senha" value={password} autoCapitalize="none" onChangeText={(text) => setPassword(text)} showForgotPassword={false} />
        <Text style={{ color: isStrongPassword(password) ? 'green' : 'red', fontSize: 12, alignSelf: 'flex-start', marginLeft: 8, marginTop: -8 }}>
          A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.*
        </Text>
        <InputPassword placeholder="Repita a senha" value={confirmPassword} onChangeText={setConfirmPassword} showForgotPassword={false} />
        <PrimaryButton title="Concluir" onPress={handleNewPassword} />
      </View>
    </View>
  );
}
