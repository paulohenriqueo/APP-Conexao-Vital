import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { styles, typography } from "../../../styles/styles";
import { colors } from "../../../styles/colors";
import Logo from "../../assets/logo.png";


export default function Terms() {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Image source={Logo} style={{ height: 48, width: 48 }} />
                <Text style={{ ...typography.M0L2432 }}>Termos de Uso</Text>
            </View>

            <View style={{ flex: 1, width: "100%", marginBottom: 16 }}>
                <ScrollView
                    contentContainerStyle={{ width: "100%", alignItems: 'center', justifyContent: 'center' }}
                    horizontal={false}
                    showsVerticalScrollIndicator={true}
                >
                    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                        <Text style={styles.paragraph}>
                            Estes Termos de Uso são fictícios e foram elaborados exclusivamente para fins acadêmicos,
                            como parte do Trabalho de Graduação. Este documento é apenas uma simulação, criada para
                            exemplificar o funcionamento de um MVP (Produto Mínimo Viável), não possuindo validade
                            legal ou aplicação prática fora do contexto do projeto.
                        </Text>

                        <Text style={styles.subtitle}>1. Objetivo</Text>
                        <Text style={styles.paragraph}>
                            O objetivo destes termos simulados é apresentar de forma didática como seriam estabelecidas
                            as condições de uso de um aplicativo real. Assim, permite ao usuário compreender o fluxo
                            de aceitação de termos em soluções digitais sem que isso represente um contrato legítimo.
                        </Text>

                        <Text style={styles.subtitle}>2. Uso do Aplicativo</Text>
                        <Text style={styles.paragraph}>
                            O aplicativo desenvolvido no âmbito do Trabalho de Graduação é um protótipo funcional.
                            Qualquer dado fornecido pelos usuários neste ambiente não será utilizado para fins
                            comerciais, sendo empregado apenas para fins de demonstração acadêmica.
                        </Text>

                        <Text style={styles.subtitle}>3. Limitação de Responsabilidade</Text>
                        <Text style={styles.paragraph}>
                            Como este é um projeto de caráter exclusivamente educacional, os desenvolvedores não se
                            responsabilizam por qualquer interpretação que extrapole o propósito de simulação.
                            Nenhuma das funcionalidades apresentadas deve ser considerada definitiva, aplicável em
                            escala comercial ou como serviço formal.
                        </Text>

                        <Text style={styles.subtitle}>4. Alterações</Text>
                        <Text style={styles.paragraph}>
                            Por se tratar de um MVP, o conteúdo e as funcionalidades do aplicativo podem ser
                            modificados a qualquer momento durante o desenvolvimento acadêmico, sem aviso prévio,
                            visto que o foco está em testes e aprendizado.
                        </Text>

                        <Text style={styles.subtitle}>5. Aceitação</Text>
                        <Text style={styles.paragraph}>
                            Ao utilizar este aplicativo no contexto do Trabalho de Graduação, o usuário compreende
                            que está participando de uma experiência acadêmica e aceita que os presentes termos
                            são apenas simulados, não possuindo efeito jurídico.
                        </Text>
                    </View>

                </ScrollView>
            </View>
        </View>
    );
}
