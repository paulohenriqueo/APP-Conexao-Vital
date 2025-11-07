import React, { useState } from "react";
import { View, Text, Image, Alert, ScrollView, Modal, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles, typography } from "../../../styles/styles";
import Logo from "../../assets/logo.png";
import { colors } from "../../../styles/colors";
import { Input, InputPassword } from "../../components/Input";
import { PrimaryButton, GoogleButton } from "../../components/Button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import TermsModal from "../legal/TermsModal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { formatName, toLowerCaseText } from "../../../utils/formatUtils";

export default function Register() {
  const navigation = useNavigation<any>();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const auth = FIREBASE_AUTH;

  // Validação de email simples
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // Função para validar força da senha
  const isStrongPassword = (password: string) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  // SignUp com Firebase Authentication
  const signUp = async () => {
    setLoading(true);

    if (password !== confirmPassword) {
      Alert.alert("Senhas distintas", "As senhas não coincidem. Por favor, tente novamente.");
      setLoading(false);
      return;
    }

    // if (!termsAccepted) {
    //   setShowTermsModal(true);
    //   setLoading(false);
    //   return;
    // }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(FIRESTORE_DB, "Users", user.uid), {
        name: nome,
        email: email,
        createdAt: new Date(),
      });

      Alert.alert("Conta criada com sucesso!", "Bem-vindo(a)!");
      console.log("Usuário cadastrado:", user.uid);
      navigation.navigate("Home");

    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        Alert.alert("Email inválido", "Por favor, insira um email válido.");
        console.log("Email inválido");
      }
      if (!isStrongPassword(password)) {
        Alert.alert(
          "Senha fraca",
          "A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos."
        );
        setLoading(false);
        return;
      }
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Email já cadastrado", "Este email já está em uso. Tente outro.");
        console.log("Email já cadastrado");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleAcceptTerms = () => {
    // setTermsAccepted(true);
    setShowTermsModal(false);
    // setTimeout(() => {
    //   signUp(); // espera o estado atualizar antes de chamar
    // }, 100);
  };

  const handleRegisterGoogle = () => {
    console.log("Cadastro com Google pressionado");
    Alert.alert("Cadastro com Google concluído com sucesso!");
    navigation.navigate("Login"); // simulação
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
        horizontal={false}
        showsVerticalScrollIndicator={true}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.boxTop}>
          <Image source={Logo} style={styles.logoLogin} />
          <Text style={typography.M0L3644}>Cadastrar</Text>
        </View>

        <View style={styles.containerBox}>
          <Input placeholder="Nome completo" value={nome} onChangeText={(text) => { setNome(formatName(text)) }} />
          <Input placeholder="E-mail" value={email} autoCapitalize="none" onChangeText={(text) => setEmail(toLowerCaseText(text))} />
          <Text style={{ color: isEmailValid ? 'green' : 'red', fontSize: 12, alignSelf: 'flex-start', marginLeft: 8, marginTop: -8 }}>
            Exemplo: usuario@email.com*
          </Text>
          <InputPassword placeholder="Senha" value={password} autoCapitalize="none" onChangeText={(text) => setPassword(text)} showForgotPassword={false} />
          <Text style={{ color: isStrongPassword(password) ? 'green' : 'red', fontSize: 12, alignSelf: 'flex-start', marginLeft: 8, marginTop: -8 }}>
            A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.*
          </Text>
          <InputPassword placeholder="Repita a senha" value={confirmPassword} onChangeText={setConfirmPassword} showForgotPassword={false} />
          {/* <Text style={{ ...typography.M01R1014, color: colors.gray75 }}>
            Ao cadastrar, você aceita os{" "}
            <Text style={{ color: colors.green382 }} onPress={() => navigation.navigate("Terms")}>Termos de Uso</Text> e a{" "}
            <Text style={{ color: colors.green382 }} onPress={() => navigation.navigate("PrivacyPolicy")}>Política de Privacidade</Text>.
          </Text> */}

          <PrimaryButton title="Criar conta" onPress={signUp} />

          {/* <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>
          <GoogleButton onPress={handleRegisterGoogle} /> */}
        </View>

        <View style={{ ...styles.boxBottom, marginTop: 16 }}>
          <Text style={{ ...typography.M01R1624 }}>
            Já possui cadastro?{" "}
            <Text
              style={{ color: colors.green85F }}
              onPress={() => navigation.navigate("Login")}
            >
              Acesse sua conta
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>

      {/* Modal de termos e política */}
      <TermsModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => { handleAcceptTerms(), setTimeout(() => { signUp(), 100 }), console.log("Termos aceitos") }}
      />
    </View>
  );
}
