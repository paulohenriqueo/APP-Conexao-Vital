import React, { useState } from "react";
import { View, Text, Image, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles, typography } from "../../../styles/styles";
import Logo from "../../assets/logo.png";
import { colors } from "../../../styles/colors";
import { Input, InputPassword } from "../../components/Input";
import { PrimaryButton, GoogleButton } from "../../components/Button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";

export default function Register() {
  const navigation = useNavigation<any>();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  // SignUp com Firebase Authentication
      const signUp = async () => {
          setLoading(true);
          try {
              await createUserWithEmailAndPassword(auth, email, password);
              Alert.alert("Conta criada com sucesso!");
              navigation.navigate("Home");
          } catch (error: any) {
              console.error("Erro no cadastro:", error);
              Alert.alert("Ocorreu um erro durante o cadastro. Tente novamente.");
              setLoading(false);
          } finally {
              setLoading(false);
          }
      }

  const handleRegister = () => {
    console.log("Cadastro pressionado");
    Alert.alert("Cadastro concluído com sucesso!");
    navigation.navigate("Login"); // simulação
  };

  const handleRegisterGoogle = () => {
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
          <Input placeholder="E-mail" value={email} autoCapitalize="none" onChangeText={(text) => setEmail(text)} />
          <InputPassword placeholder="Senha" value={password} autoCapitalize="none" onChangeText={(text) => setPassword(text)} showForgotPassword={false} />
          <InputPassword placeholder="Repita a senha" value={confirmPassword} onChangeText={setConfirmPassword} showForgotPassword={false} />
          <Text style={{ ...typography.M01R1014, color: colors.gray75 }}>
            Ao cadastrar, você aceita os{" "}
            <Text style={{ color: colors.green382 }} onPress={() => navigation.navigate("Terms")}>Termos de Uso</Text> e a{" "}
            <Text style={{ color: colors.green382 }} onPress={() => navigation.navigate("PrivacyPolicy")}>Política de Privacidade</Text>.
          </Text>

          <PrimaryButton title="Criar conta" onPress={signUp} />

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>
          <GoogleButton onPress={handleRegisterGoogle} />
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
