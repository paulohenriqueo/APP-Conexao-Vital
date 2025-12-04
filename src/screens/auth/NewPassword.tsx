import React, { useState } from "react";
import { View, Text, Image, Alert, TouchableOpacity } from "react-native";

import { colors, styles, typography } from "../../../styles/styles";
import Logo from "../../assets/logo.png";
import { InputPassword } from "../../components/Input";
import { PrimaryButton } from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import Register from "./Register";
import { CaretLeft } from "phosphor-react-native";
import { getAuth, updatePassword } from "firebase/auth";
import { isStrongPassword } from "../../../utils/validationUtils";


export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation<any>();

  const handleNewPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    if (!isStrongPassword(password)) {
      Alert.alert(
        "Senha fraca",
        "A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos."
      );
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Nenhum usuário logado.");
        return;
      }

      await updatePassword(user, password);
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      navigation.goBack(); // volta para perfil ou login
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/requires-recent-login") {
        Alert.alert(
          "Sessão expirada",
          "Por segurança, é necessário fazer login novamente antes de alterar a senha."
        );
        navigation.navigate("Login");
      } else {
        Alert.alert("Erro", "Não foi possível alterar a senha. Tente novamente.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.boxTop, { flex: 1 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", left: 24, top: 48, padding: 8 }}
          accessibilityLabel="Voltar"
        >
          <CaretLeft size={24} color={colors.whiteFBFE} weight="bold" />
        </TouchableOpacity>
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