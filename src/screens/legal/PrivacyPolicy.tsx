import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { styles, typography } from "../../../styles/styles";
import Logo from "../../assets/logo.png";

export default function PrivacyPolicy() {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Image source={Logo} style={{ height: 48, width: 48 }} />
                <Text style={{ ...typography.M0L2432 }}>Política de Privacidade</Text>
            </View>

            <View style={{ flex: 1, width: "100%", marginBottom: 16 }}>
                <ScrollView
                    contentContainerStyle={{ width: "100%", alignItems: 'center', justifyContent: 'center' }}
                    horizontal={false}
                    showsVerticalScrollIndicator={true}
                >
                    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                        <Text style={styles.paragraph}>
                            Esta Política de Privacidade é fictícia e foi elaborada exclusivamente para fins
                            acadêmicos, como parte do Trabalho de Graduação. O documento a seguir é apenas uma
                            simulação, criada para exemplificar o funcionamento de um MVP (Produto Mínimo Viável),
                            não possuindo validade legal ou aplicação prática fora do contexto do projeto.
                        </Text>

                        <Text style={styles.subtitle}>1. Coleta de Informações</Text>
                        <Text style={styles.paragraph}>
                            O aplicativo desenvolvido no âmbito acadêmico não realiza a coleta real de dados pessoais.
                            Todas as informações eventualmente solicitadas têm caráter ilustrativo, servindo apenas para
                            demonstrar o fluxo de um sistema em funcionamento.
                        </Text>

                        <Text style={styles.subtitle}>2. Uso das Informações</Text>
                        <Text style={styles.paragraph}>
                            As informações fornecidas no ambiente do MVP não serão armazenadas, compartilhadas ou
                            utilizadas para qualquer finalidade comercial. Seu único objetivo é contribuir para a
                            compreensão e apresentação do projeto acadêmico.
                        </Text>

                        <Text style={styles.subtitle}>3. Segurança</Text>
                        <Text style={styles.paragraph}>
                            Como este é um protótipo de caráter educacional, não foram aplicadas medidas de segurança
                            avançadas. O foco está em demonstrar conceitos e funcionalidades básicas de um sistema,
                            sem garantir níveis de proteção equivalentes a aplicativos comerciais.
                        </Text>

                        <Text style={styles.subtitle}>4. Alterações na Política</Text>
                        <Text style={styles.paragraph}>
                            Esta Política de Privacidade simulada pode ser alterada a qualquer momento durante o
                            desenvolvimento do Trabalho de Graduação, visando ajustes técnicos ou conceituais que
                            contribuam para o aprendizado.
                        </Text>

                        <Text style={styles.subtitle}>5. Consentimento</Text>
                        <Text style={styles.paragraph}>
                            Ao utilizar este aplicativo acadêmico, o usuário compreende e concorda que esta Política
                            de Privacidade é apenas uma simulação e não gera direitos, obrigações ou responsabilidades
                            de caráter legal.
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
