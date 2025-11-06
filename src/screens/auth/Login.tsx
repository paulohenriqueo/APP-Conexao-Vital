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
import { PrimaryButton, GoogleButton } from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import * as WebBrowser from 'expo-web-browser';
import { ActivityIndicator } from "react-native";
import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthRequest } from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const [request, response, promptAsync] = useAuthRequest({
        webClientId: '582696474367-m4r89vgv17k52h64ulgc27babi75ou8e.apps.googleusercontent.com',
        iosClientId: '582696474367-b9skl4jd704sqvpni9auinid4ksc35ti.apps.googleusercontent.com',
        androidClientId: '582696474367-ri81htmh94qvp3345ebtu158ef2bgqho.apps.googleusercontent.com',
    });


    // SignIn com Firebase Authentication
    const singIn = async () => {
        if (email === "" || password === "") {
            alert("Por favor, preencha todos os campos.");
            return;
        }
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.navigate("Home");
        } catch (error: any) {
            console.error("Erro no login:", error);
            // Tratamento de erros específicos do Firebase
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                Alert.alert("Credenciais inválidas", "Senha incorreta.");
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert("Usuário Não Cadastrado", "Este email não está cadastrado em nosso sistema.");
            }
            else if (error.code === 'auth/user-disabled') {
                Alert.alert("Usuário Bloqueado", "Sua conta foi bloqueada.");
            } else if (error.code === 'auth/too-many-requests') {
                Alert.alert("Muitas tentativas", "Acesso temporariamente bloqueado. Tente novamente mais tarde.");
            } else {
                Alert.alert("Erro", "Ocorreu um erro durante o login. Tente novamente.");
            }

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const signInWithGoogle = async () => {
            if (response?.type === 'success') {
                const { authentication } = response;
                if (authentication?.accessToken) {
                    const credential = GoogleAuthProvider.credential(null, authentication.accessToken);
                    try {
                        await signInWithCredential(auth, credential);
                        Alert.alert("Login Google bem-sucedido!");
                        navigation.navigate("Home");
                    } catch (error) {
                        Alert.alert("Erro ao autenticar com Firebase.");
                    }
                }
            }
        };
        signInWithGoogle();
    }, [response]);

    const handleGoogleLogin = () => {
        promptAsync();
    };


    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1, width: "100%", alignItems: 'center', justifyContent: 'center' }}>
                <ScrollView
                    style={{ flex: 1, width: "100%" }}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
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
                            <>
                                <PrimaryButton title="Entrar" onPress={singIn} />
                                {/* <View style={styles.dividerContainer}>
                                    <View style={styles.line} />
                                    <Text style={styles.dividerText}>ou</Text>
                                    <View style={styles.line} />
                                </View>
                                <GoogleButton onPress={handleGoogleLogin} />
                                */}
                            </>
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
