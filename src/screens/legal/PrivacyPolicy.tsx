import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { styles, typography } from "../../../styles/styles";
import Logo from "../../assets/logo.png";
import { CaretLeft } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../styles/colors";

export default function PrivacyPolicy() {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
                    <CaretLeft size={24} color={colors.whiteFBFE} weight="bold" />
                </TouchableOpacity>
                <Text style={{ ...typography.M0L2432 }}>Política de Privacidade</Text>
            </View>

            <View style={{ flex: 1, width: "100%", marginBottom: 24 }}>
                <ScrollView
                    contentContainerStyle={{ width: "100%", alignItems: "center", justifyContent: "center" }}
                    horizontal={false}
                    showsVerticalScrollIndicator={true}
                >
                    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>

                        <Text style={[styles.paragraph, { color: colors.gray73, marginBottom: 24 }]}>
                            <Text style={{ fontWeight: "bold" }}>Última atualização:</Text> 1 de novembro de 2025 {"\n"}
                            <Text style={{ fontWeight: "bold" }}>Local:</Text> Itu/SP
                        </Text>

                        <Text style={styles.paragraph}>
                            A presente <Text style={{ fontWeight: "bold" }}>Política de Privacidade</Text> tem por finalidade informar de forma clara e transparente como o{" "}
                            <Text style={{ fontWeight: "bold" }}>Conexão Vital</Text> realiza a coleta, uso, armazenamento e proteção das informações dos usuários.{" "}
                            Ao utilizar a plataforma, o usuário declara estar ciente e de acordo com as condições descritas neste documento.
                        </Text>

                        <Text style={styles.subtitle}>1. Coleta de Informações</Text>
                        <Text style={styles.paragraph}>
                            O Conexão Vital pode coletar informações fornecidas diretamente pelo usuário durante o uso da plataforma,
                            como nome, e-mail, telefone, localização aproximada, área de atuação profissional, e dados inseridos no perfil.{"\n\n"}
                            Também podem ser coletadas informações de uso, como data e horário de acesso, páginas visitadas e identificadores do dispositivo,
                            com o objetivo de aprimorar a experiência do usuário e garantir o funcionamento adequado do aplicativo.
                        </Text>

                        <Text style={styles.subtitle}>2. Uso das Informações</Text>
                        <Text style={styles.paragraph}>
                            As informações coletadas são utilizadas para:{"\n"}
                            • Permitir o funcionamento da plataforma e a comunicação entre Clientes e Profissionais;{"\n"}
                            • Personalizar a experiência de uso e melhorar o desempenho do aplicativo;{"\n"}
                            • Enviar comunicações relacionadas à conta, suporte ou atualizações de uso;{"\n"}
                            • Cumprir obrigações legais ou regulatórias, quando aplicável.{"\n\n"}
                            O Conexão Vital não comercializa, aluga ou vende dados pessoais de seus usuários.
                        </Text>

                        <Text style={styles.subtitle}>3. Compartilhamento de Dados</Text>
                        <Text style={styles.paragraph}>
                            O Conexão Vital poderá compartilhar dados apenas quando necessário para o funcionamento da plataforma,
                            como em integrações técnicas (ex.: serviços de autenticação ou banco de dados), sempre observando medidas
                            de segurança adequadas e em conformidade com a legislação vigente.{"\n\n"}
                            Nenhum dado será compartilhado com terceiros para fins publicitários, de marketing ou quaisquer finalidades não previstas nesta política.
                        </Text>

                        <Text style={styles.subtitle}>4. Armazenamento e Segurança</Text>
                        <Text style={styles.paragraph}>
                            As informações são armazenadas em ambiente seguro e controlado, utilizando práticas razoáveis de proteção
                            técnica e administrativa para evitar acessos não autorizados, perdas ou alterações indevidas.{"\n\n"}
                            Apesar disso, nenhum sistema é totalmente imune a incidentes, e o usuário reconhece que o uso da internet
                            implica em riscos inerentes, assumindo responsabilidade pelo uso consciente da plataforma e pela confidencialidade de suas credenciais.
                        </Text>

                        <Text style={styles.subtitle}>5. Direitos do Usuário</Text>
                        <Text style={styles.paragraph}>
                            O usuário poderá, a qualquer momento:{"\n"}
                            • Acessar e atualizar suas informações pessoais;{"\n"}
                            • Solicitar a exclusão de sua conta e dos dados associados;{"\n"}
                            • Revogar consentimentos previamente concedidos;{"\n"}
                            • Solicitar informações sobre o tratamento de seus dados pessoais.{"\n\n"}
                            As solicitações podem ser feitas diretamente pelos canais de contato disponíveis dentro da plataforma.
                        </Text>

                        <Text style={styles.subtitle}>6. Retenção das Informações</Text>
                        <Text style={styles.paragraph}>
                            As informações pessoais serão mantidas pelo tempo necessário para cumprir as finalidades descritas nesta política,
                            respeitando os prazos legais aplicáveis. Após o término do tratamento, os dados poderão ser anonimizados ou excluídos de forma segura.
                        </Text>

                        <Text style={styles.subtitle}>7. Cookies e Tecnologias de Registro</Text>
                        <Text style={styles.paragraph}>
                            O Conexão Vital pode utilizar cookies ou tecnologias similares para melhorar a experiência do usuário,
                            permitindo lembrar preferências, autenticar sessões e analisar o uso da plataforma.{"\n\n"}
                            O usuário pode, a qualquer momento, ajustar as permissões de seu dispositivo para limitar ou desativar o uso dessas tecnologias.
                        </Text>

                        <Text style={styles.subtitle}>8. Alterações nesta Política</Text>
                        <Text style={styles.paragraph}>
                            Esta Política de Privacidade poderá ser atualizada periodicamente, sempre que necessário para refletir
                            melhorias na plataforma ou adequações legais.{"\n\n"}
                            A versão atualizada estará disponível no aplicativo, sendo responsabilidade do usuário revisá-la regularmente.
                            O uso contínuo do Conexão Vital após eventuais alterações implica na aceitação da nova versão.
                        </Text>

                        <Text style={styles.subtitle}>9. Contato</Text>
                        <Text style={styles.paragraph}>
                            Em caso de dúvidas, solicitações ou reclamações relacionadas à privacidade e proteção de dados,
                            o usuário poderá entrar em contato pelo canal de suporte disponível dentro do aplicativo{" "}
                            ou pelo e-mail <Text style={{ fontWeight: "bold" }}>contato@conexaovital.com.br</Text>.
                        </Text>

                        <Text style={styles.subtitle}>10. Disposições Finais</Text>
                        <Text style={styles.paragraph}>
                            Esta Política de Privacidade é regida pelas leis da República Federativa do Brasil,
                            especialmente pela Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD).{"\n\n"}
                            Ao utilizar o Conexão Vital, o usuário declara que leu, compreendeu e concorda integralmente com
                            as condições aqui estabelecidas.
                        </Text>

                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
