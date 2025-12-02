import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    Image,
    Alert,
    ScrollView,
    ActivityIndicatorBase,
    KeyboardAvoidingView,
} from "react-native";
import { styles, typography } from "../../../styles/styles";
import Logo from '../../assets/logo.png'
import { colors } from "../../../styles/colors";
import { Input, InputPassword } from "../../components/Input";
import { PrimaryButton } from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as WebBrowser from 'expo-web-browser';
import { ActivityIndicator } from "react-native";
import { useAuthRequest } from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const [request, response, promptAsync] = useAuthRequest({
        webClientId: '219189836911-f3ctfh7196h8flpitlvete1t9uc8i5le.apps.googleusercontent.com',
        iosClientId: '582696474367-b9skl4jd704sqvpni9auinid4ksc35ti.apps.googleusercontent.com',
        androidClientId: '582696474367-ri81htmh94qvp3345ebtu158ef2bgqho.apps.googleusercontent.com',
    });

    // SignIn com Firebase Authentication
    const singIn = async () => {
        if (email === "" || password === "") {
            Alert.alert("Campos obrigatórios", "Por favor, preencha e-mail e senha para continuar.");
            console.warn("DEBUG: tentativa de login com campos vazios");
            return;
        }

        setLoading(true);
        console.log("DEBUG: iniciando login com email:", email);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("DEBUG: login bem-sucedido:", {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                metadata: userCredential.user.metadata,
            });
            navigation.navigate("Home");
        } catch (error: any) {
            console.error("DEBUG: erro no login ->", error);

            switch (error.code) {
                case "auth/invalid-email":
                    Alert.alert("E-mail inválido", "Verifique se o endereço de e-mail está correto.");
                    console.warn("DEBUG: formato de e-mail incorreto:", email);
                    break;

                case "auth/user-not-found":
                    Alert.alert(
                        "Conta não encontrada",
                        "Não encontramos uma conta com este e-mail. Ele pode estar incorreto ou ter sido removido."
                    );
                    console.warn("DEBUG: user-not-found:", email);
                    break;

                case "auth/invalid-credential":
                case "auth/wrong-password":
                    Alert.alert(
                        "Credenciais inválidas",
                        "E-mail ou senha incorretos. Verifique os dados e tente novamente."
                    );
                    console.warn("DEBUG: invalid-credential para o e-mail:", email);
                    console.warn("DEBUG: senha incorreta para o e-mail:", email);
                    break;

                case "auth/user-disabled":
                    Alert.alert("Conta desativada", "Esta conta foi desativada. Entre em contato com o suporte para mais informações.");
                    console.warn("DEBUG: usuário desativado:", email);
                    break;

                case "auth/too-many-requests":
                    Alert.alert("Muitas tentativas", "A conta foi temporariamente bloqueada devido a várias tentativas malsucedidas. Tente novamente mais tarde.");
                    console.warn("DEBUG: bloqueio temporário de login para:", email);
                    break;

                default:
                    Alert.alert("Erro inesperado", "Não foi possível fazer login. Tente novamente mais tarde.");
                    console.warn("DEBUG: erro não tratado:", error.code, error.message);
                    break;
            }
        } finally {
            setLoading(false);
            console.log("DEBUG: finalizando tentativa de login");
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1, width: "100%", alignItems: 'center', justifyContent: 'center' }}>
                <ScrollView
                    style={{ width: "100%" }}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
                    horizontal={false}
                    showsVerticalScrollIndicator={true}
                >
                    <View style={styles.boxTop}>
                        <Image source={Logo} style={styles.logoLogin} />
                        <Text style={typography.M0L3644}>Entrar</Text>
                    </View>

                    <View style={styles.containerBox}>
                        <Input
                            placeholder="E-mail"
                            value={email}
                            autoCapitalize="none"
                            onChangeText={(text) => setEmail(text)}
                        />
                        <InputPassword
                            placeholder="Senha"
                            value={password}
                            autoCapitalize="none"
                            onChangeText={(text) => setPassword(text)}
                        />
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.green382} />
                        ) : (
                            <PrimaryButton title="Entrar" onPress={singIn} />
                        )}

                    </View>

                    <View style={styles.boxBottom}>
                        <Text style={typography.M01R1624}>
                            Novo aqui?{" "}
                            <Text style={{ color: colors.green85F }} onPress={() => navigation.navigate("Register")}>
                                Crie a sua conta!
                            </Text>
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View >
    )
}
