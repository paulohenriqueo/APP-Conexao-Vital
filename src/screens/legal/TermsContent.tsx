import React from "react";
import { View, Text, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { styles } from "../../../styles/styles";
import { colors } from "../../../styles/colors";

type TermsContentProps = {
    onScrolledToEnd?: () => void; // callback opcional quando o scroll chegar ao final
};

export default function TermsContent({ onScrolledToEnd }: TermsContentProps) {
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const distanceFromBottom = contentSize.height - (layoutMeasurement.height + contentOffset.y);

        if (distanceFromBottom < 20 && onScrolledToEnd) {
            onScrolledToEnd();
        }
    };
    return (
        <View style={{ flex: 1, width: "100%" }}>
            <ScrollView
                contentContainerStyle={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                horizontal={false}
                showsVerticalScrollIndicator={true}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                    <Text style={[styles.paragraph, { color: colors.gray73, marginBottom: 24 }]}>
                        <Text style={{ fontWeight: "bold" }}>Última atualização:</Text> 1 de novembro de 2025 {"\n"}
                        <Text style={{ fontWeight: "bold" }}>Local:</Text> Itu/SP
                    </Text>

                    <Text style={styles.paragraph}>
                        O <Text style={{ fontWeight: "bold" }}>Conexão Vital</Text> é uma plataforma desenvolvida e mantida de forma independente em Itu/SP,
                        destinada a facilitar a conexão entre <Text style={{ fontWeight: "bold" }}>Clientes</Text> e{" "}
                        <Text style={{ fontWeight: "bold" }}>Profissionais</Text> de diversas áreas da saúde e bem-estar.
                        O acesso e uso do Conexão Vital estão condicionados à leitura e aceitação integral destes Termos de Uso.
                    </Text>

                    <Text style={styles.subtitle}>1. Objeto</Text>
                    <Text style={styles.paragraph}>
                        O Conexão Vital tem como finalidade aproximar Clientes e Profissionais de forma prática,
                        permitindo a busca, visualização de perfis e contato direto entre as partes.
                        A plataforma atua exclusivamente como intermediadora de contato, não participando de qualquer
                        relação contratual, trabalhista ou de prestação de serviços entre Clientes e Profissionais.
                    </Text>

                    <Text style={styles.subtitle}>2. Natureza da Relação</Text>
                    <Text style={styles.paragraph}>
                        O Conexão Vital não realiza seleção, contratação, supervisão ou validação profissional dos usuários cadastrados como Profissionais.
                        A responsabilidade pela verificação de qualificações, experiências, licenças, histórico e idoneidade dos Profissionais é integralmente do Cliente.
                        Recomenda-se que o Cliente verifique antecedentes, registros profissionais e referências antes de efetuar qualquer contratação.{"\n\n"}
                        Da mesma forma, os Profissionais são responsáveis por garantir que as informações fornecidas em seus perfis sejam verdadeiras,
                        atualizadas e compatíveis com sua atuação profissional.
                    </Text>

                    <Text style={styles.subtitle}>3. Isenção de Responsabilidade</Text>
                    <Text style={styles.paragraph}>
                        O Conexão Vital não se responsabiliza por:{"\n"}
                        • Qualquer dano, prejuízo, perda ou insatisfação decorrente da relação entre Cliente e Profissional;{"\n"}
                        • Informações incorretas, incompletas ou falsas fornecidas por qualquer usuário;{"\n"}
                        • Qualidade, pontualidade, segurança, eficácia ou resultados dos serviços prestados pelos Profissionais;{"\n"}
                        • Comunicações, pagamentos ou acordos realizados fora da plataforma.{"\n\n"}
                        A utilização do Conexão Vital ocorre por conta e risco do usuário,
                        que reconhece que a plataforma se limita a disponibilizar um meio de contato e não garante resultados ou segurança nas relações estabelecidas.
                    </Text>

                    <Text style={styles.subtitle}>4. Condições de Uso</Text>
                    <Text style={styles.paragraph}>
                        O uso do Conexão Vital deve respeitar as seguintes condições:{"\n"}
                        • É vedado publicar, enviar ou compartilhar conteúdos falsos, ofensivos, discriminatórios ou ilegais;{"\n"}
                        • O cadastro deve conter informações verdadeiras e atualizadas;{"\n"}
                        • O usuário compromete-se a não utilizar o Conexão Vital para fins fraudulentos, comerciais indevidos ou contrários à legislação vigente.{"\n\n"}
                        O descumprimento dessas condições poderá resultar em suspensão ou exclusão do acesso, sem necessidade de aviso prévio.
                    </Text>

                    <Text style={styles.subtitle}>5. Privacidade e Dados</Text>
                    <Text style={styles.paragraph}>
                        As informações fornecidas pelos usuários são utilizadas exclusivamente para viabilizar a funcionalidade da plataforma.
                        O Conexão Vital adota boas práticas de proteção de dados, mas não se responsabiliza por falhas de segurança decorrentes de fatores externos,
                        como acessos indevidos, ataques cibernéticos ou compartilhamento de senhas pelos próprios usuários.
                    </Text>

                    <Text style={styles.subtitle}>6. Alterações e Atualizações</Text>
                    <Text style={styles.paragraph}>
                        O Conexão Vital poderá modificar, atualizar ou remover partes destes Termos de Uso a qualquer momento.
                        As versões atualizadas serão disponibilizadas dentro da plataforma, sendo de responsabilidade do usuário revisá-las periodicamente.
                        O uso contínuo do Conexão Vital após eventuais alterações implicará na aceitação automática dos novos termos.
                    </Text>

                    <Text style={styles.subtitle}>7. Disposições Finais</Text>
                    <Text style={styles.paragraph}>
                        Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil.
                        Qualquer controvérsia será submetida ao foro da Comarca de Itu/SP, com renúncia expressa a qualquer outro, por mais privilegiado que seja.{"\n\n"}
                        Ao utilizar o Conexão Vital, o usuário declara que leu, compreendeu e aceita integralmente estes Termos de Uso.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}