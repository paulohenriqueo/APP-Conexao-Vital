// import React, { useState, useEffect } from "react";
// import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
// import { MaterialIcons, Feather } from "@expo/vector-icons";
// import { getAuth, signOut } from "firebase/auth";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { colors } from "../../../../styles/colors";
// import { typography } from "../../../../styles/typography";
// import { useNavigation, NavigationProp } from "@react-navigation/native";
// import ProfileItem from "../../../components/ProfileItem";
// import { SignOut, WhatsAppLogo } from "phosphor-react-native";
// import { Avatar } from "../../../components/Avatar";
// import { styles } from "../../../../styles/styles";
// import { Ionicons } from "@expo/vector-icons";
// import { CaregiverProfileInfo } from "../../../components/CaregiverProfileInfo";
// import { OutlinedButton, PrimaryButton } from "../../../components/Button";
// import { PatientProfileInfo } from "../../../components/PatientProfileInfo";
// import { Linking } from 'react-native';

// interface User {
//   userContact?: number;
//   especification?: string;
//   bio?: string;
//   role?: "caregiver" | "client";
//   qualifications?: string[];
//   rating?: number;
// }

// interface SectionItem {
//   section: string;
//   title: string;
//   onPress: () => void;
//   icon?: React.ReactNode;
// }

// export default function Profile() {
//   const [activeTab, setActiveTab] = useState<"info" | "qualifications">("info");
//   const [userName, setUserName] = useState("");
//   const [userEmail, setUserEmail] = useState("");

//   let contactRequested = false; // Simulação de contato solicitado

//   // Dados provisórios do usuário
//   const user: User = {
//     userContact: 5511974041229, // número de contato do usuário
//     especification: "Enfermeira",
//     bio: "Cuidador experiente com foco em idosos.",
//     role: "caregiver", // agora é do tipo correto
//     qualifications: ["Primeiros Socorros", "Cuidador de Idosos"],
//     rating: 4.5,
//   };

//   // Buscar email e nome do usuário
//   useEffect(() => {
//     const auth = getAuth();
//     const currentUser = auth.currentUser;
//     if (currentUser) setUserEmail(currentUser.email || "");
//   }, []);

//   useEffect(() => {
//     const fetchUserName = async () => {
//       const auth = getAuth();
//       const db = getFirestore();
//       const currentUser = auth.currentUser;
//       if (currentUser) {
//         const userDocRef = doc(db, "Users", currentUser.uid);
//         const userDoc = await getDoc(userDocRef);
//         if (userDoc.exists()) setUserName(userDoc.data().name || "");
//       }
//     };
//     fetchUserName();
//   }, []);

//   return (
//     <ScrollView
//       contentContainerStyle={{
//         justifyContent: "center",
//         padding: 4,
//         backgroundColor: colors.whiteFBFE,
//         flexGrow: 1,
//       }}
//       showsVerticalScrollIndicator={false}
//       style={{ flex: 1, width: "100%" }} // Adicionando estilo para ocupar a largura máxima
//     >
//       {/* Foto de perfil, nome e estrelas */}
//       <View
//         style={{
//           alignItems: "center",
//           width: "100%",
//           backgroundColor: colors.gray7FD,
//           borderRadius: 16,
//           paddingVertical: 16,
//           marginBottom: 16,
//           gap: 4,
//         }}
//       >
//         <Avatar size={84} name={userName} />
//         <Text
//           style={{
//             ...typography.H01B2024,
//             marginTop: 8,
//             textAlign: "center",
//             fontWeight: "700",
//           }}
//         >
//           {userName}
//         </Text>
//         <Text
//           style={{
//             ...typography.H01SB1618,
//             color: colors.gray75,
//             textAlign: "center",
//             fontWeight: "600",
//           }}
//         >
//           {user.especification}
//         </Text>
//         <View style={{ ...styles.ratingContainer }}>
//           {Array.from({ length: 5 }).map((_, i) => (
//             <Ionicons
//               key={i}
//               name={i < (user.rating || 0) ? "star" : "star-outline"}
//               size={20}
//               color={colors.ambar400}
//             />
//           ))}
//         </View>
//       </View>

//       {/* Botões */}
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "center",
//           width: "100%",
//           marginBottom: 16,
//         }}
//       >
//         {contactRequested === false ? (
//           <OutlinedButton
//             title="Solicitar contato"
//             onPress={() => contactRequested = true}
//             icon={<WhatsAppLogo size={20} color={colors.green382} />}
//           />
//         ) : (
//           <PrimaryButton
//             title="Entrar em contato"
//             onPress={() => {
//               const url = `https://api.whatsapp.com/send/?phone=${String(user.userContact)}`;
//               Linking.openURL(url);
//             }}
//             icon={<WhatsAppLogo size={20} color={colors.whiteFBFE} />}
//           />
//         )}
//       </View>

//       {/* Abas */}
//       <View
//         style={{
//           flexDirection: "row",
//           width: "100%",
//           borderBottomWidth: 1,
//           borderBottomColor: colors.grayE8,
//           marginBottom: 8,
//         }}
//       >
//         <TouchableOpacity
//           style={{
//             flex: 1,
//             alignItems: "center",
//             paddingVertical: 8,
//             borderBottomWidth: activeTab === "info" ? 2 : 0,
//             borderBottomColor: colors.green382,
//           }}
//           onPress={() => setActiveTab("info")}
//         >
//           <Text
//             style={{
//               ...typography.M01B1624,
//               color: activeTab === "info" ? colors.green382 : colors.gray75,
//             }}
//           >
//             Informações {/* gerais */}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Conteúdo da aba */}
//       {activeTab === "info" && (
//         user.role === "caregiver" //atualizar de acordo com o banco de dados
//           ? (
//             <CaregiverProfileInfo
//               caregiverData={(user as any)?.caregiverSpecifications ?? {
//                 experiencia: ["Item"],
//                 qualificacoes: ["Item"],
//                 dispoDia: [],
//                 periodo: ["Item"],
//                 publicoAtendido: ["Item"],
//                 observacoes: "Teste",
//               }}
//             />
//           )
//           : (
//             <PatientProfileInfo patientData={
//               (user as any)?.patientSpecifications ?? {
//                 alergias: ["Pólen", "Amendoim"],
//                 medicamentos: ["Paracetamol", "Ibuprofeno"],
//                 condicoes: ["Diabetes", "Hipertensão"],
//                 idiomasPreferidos: ["Português", "Inglês"],
//                 observacoes: "Paciente em tratamento contínuo.",
//               }
//             }
//             />
//           )
//       )}
//     </ScrollView>
//   );
// }