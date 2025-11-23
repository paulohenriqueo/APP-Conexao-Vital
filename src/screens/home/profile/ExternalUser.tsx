import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { colors } from "../../../../styles/colors";
import { typography } from "../../../../styles/typography";
import {
  useNavigation,
  NavigationProp,
  useRoute,
} from "@react-navigation/native";
import { CaretLeft, Check, WhatsappLogo, X } from "phosphor-react-native";
import { Avatar } from "../../../components/Avatar";
import { Ionicons } from "@expo/vector-icons";
import CaregiverProfileInfo from "./CaregiverProfileInfo";
import {
  ActionButton,
  OutlinedButton,
  PrimaryButton,
} from "../../../components/Button";
import PatientProfileInfo from "./PatientProfileInfo";
import { openWhatsApp } from "../../../../utils/openWhatsApp";
import { TopBar } from "../../../components/TopBar";
import { savePatientContactRequest } from "../../../services/patientService";
import { acceptRequest, declineRequest } from "../../../services/requestService";
import { ClockCountdown, Confetti, SealCheck, Sparkle, Prohibit } from "phosphor-react-native";

interface User {
  //Dados necessários para exibir perfil de outros usuários
  bio?: string;
  role?: "caregiver" | "patient" | "undefined";
  userContact?: number;
  qualifications?: string[];
  rating?: number;
  imageUrl?: string;
}

export default function ExternalUser() {
  const [userName, setUserName] = useState("");
  const [contactRequested, setContactRequested] = useState(false); // Estado para controlar se o contato foi solicitado
  const [acceptedContact, setAcceptedContact] = useState<boolean | null>(null);
  const [showStars, setShowStars] = useState(false); // Estado para controlar se entrou em contato
  const [rating, setRating] = useState(0);

  const navigation = useNavigation<NavigationProp<any>>();
  const route: any = useRoute();

  // usar userId passado via navegação para carregar usuário externo
  const userIdParam: string | undefined = route.params?.userId;

  const [loading, setLoading] = useState(true);
  const [remoteUser, setRemoteUser] = useState<any>(null);

  const auth = getAuth();
  // busca os dados do usuário selecionado; se não houver param, tenta exibir currentUser como antes
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const db = getFirestore();
        const uid = userIdParam ?? auth.currentUser?.uid;

        if (!uid) {
          setRemoteUser(null);
          return;
        }

        const userDocRef = doc(db, "Users", uid);
        const userSnap = await getDoc(userDocRef);

        if (!userSnap.exists()) {
          setRemoteUser(null);
          return;
        }

        const data = userSnap.data();
        console.log("ExternalUser: user document data:", data);

        // Identificação do tipo de perfil
        const role =
          data?.profileType ??
          (data?.caregiverSpecifications || data?.caregiverProfile
            ? "caregiver"
            : data?.patientProfile
              ? "patient"
              : "undefined");

        // Localização (city + state)
        const city =
          data?.patientProfile?.city ??
          data?.caregiverProfile?.city ??
          "";
        const state =
          data?.patientProfile?.state ??
          data?.caregiverProfile?.state ??
          "";

        let location = "";
        if (city && state) location = `${city} | ${state}`;
        else if (city) location = city;
        else if (state) location = state;
        else location = "Localização não informada";

        // Set do usuário remoto
        setRemoteUser({
          id: userSnap.id,
          name: data?.name ?? data?.displayName ?? "",
          email: data?.email ?? null,
          role,

          phone:
            data?.patientProfile?.phone ??
            data?.caregiverProfile?.phone ??
            null,

          rating: data?.rating ?? 0,
          imageUrl: data?.photoUrl ?? data?.avatar ?? null,

          // Localização já tratada
          city,
          state,
          location, // <-- já formatado

          caregiverSpecifications:
            data?.caregiverSpecifications ??
            data?.caregiverProfile ??
            null,

          patientProfile: {
            ...(data?.patientProfile ?? {}),
            ...(data?.condition ?? {}),
          },

          bio: data?.bio ?? data?.description ?? "",
        });

      } catch (err) {
        console.warn("Erro ao buscar ExternalUser:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userIdParam]);

  const ProfileInfoComponent =
    remoteUser?.role === "caregiver"
      ? CaregiverProfileInfo
      : PatientProfileInfo;
  const profileProps =
    remoteUser?.role === "caregiver"
      ? { caregiverData: remoteUser?.caregiverSpecifications ?? {} }
      : { patientData: remoteUser?.patientProfile ?? {} };

  useEffect(() => {
    if (remoteUser) {
      setUserName(remoteUser.name || "");
      setRating(remoteUser.rating ?? 0);
    }
  }, [remoteUser]);

  const renderStar = (starNumber: number) => {
    return (
      <TouchableOpacity key={starNumber} onPress={() => setRating(starNumber)}>
        <Ionicons
          name={starNumber <= rating ? "star" : "star-outline"} // preenche estrelas anteriores
          size={20}
          color={colors.green85F}
        />
      </TouchableOpacity>
    );
  };

  const submitRating = () => {
    if (rating === 0) {
      Alert.alert("Selecione uma avaliação antes de enviar!");
      return;
    }

    // fazer a lógica de envio para o backend
    console.log("Avaliação enviada:", rating);
    Alert.alert(
      "Obrigado pela avaliação!",
      `Você avaliou com ${rating} estrelas.`
    );

    // Reset opcional
    setRating(0);
  };

  const handleRequest = async () => {
    setContactRequested(true);
    setAcceptedContact(null); // pendente

    await savePatientContactRequest(remoteUser.id, remoteUser.name);

    Alert.alert(
      "Contato solicitado",
      "Sua solicitação de contato foi enviada com sucesso!",
      [{ text: "OK" }]
    );
  };

  const loggedUserId = auth.currentUser?.uid;
  const remoteUserId = remoteUser?.id;

  const isPatient = remoteUser?.role === "patient";

  const patientId = isPatient ? loggedUserId : remoteUserId;
  const caregiverId = isPatient ? remoteUserId : loggedUserId;

  async function handleAccept() {
    if (!patientId || !caregiverId) {
      console.warn("IDs ausentes para aceitar solicitação");
      return;
    }

    const result = await acceptRequest(patientId, caregiverId);

    if (result.ok) {
      setAcceptedContact(true);
    } else {
      console.error(result.error);
    }
  }

  async function handleDecline() {
    if (!patientId || !caregiverId) {
      console.warn("IDs ausentes para recusar solicitação");
      return;
    }

    const result = await declineRequest(patientId, caregiverId);

    if (result.ok) {
      setAcceptedContact(false);
    } else {
      console.error(result.error);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",
        padding: 0,
        backgroundColor: colors.whiteFBFE,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        width: "100%",
      }}
    >
      <TopBar title="" />
      {/* Foto de perfil, nome e estrelas - estilo atualizado para card centralizado */}
      <View style={{ marginHorizontal: 16, marginTop: 20, marginBottom: 8 }}>
        <View
          style={{
            backgroundColor: colors.whiteFBFE,
            borderRadius: 12,
            paddingTop: 60,
            paddingVertical: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ position: "absolute", left: 12, top: 12, padding: 8 }}
            accessibilityLabel="Voltar"
          >
            <CaretLeft size={24} color={colors.gray73} weight="bold" />
          </TouchableOpacity>

          {/* avatar com leve overlap visual */}
          <View style={{ marginTop: -40, marginBottom: 8 }}>
            <Avatar size={84} name={userName} imageUrl={remoteUser?.imageUrl} />
          </View>

          <Text
            style={{
              ...typography.H01B2024,
              textAlign: "center",
              fontWeight: "700",
            }}
          >
            {userName}
          </Text>
          {remoteUser ? (
            <>
              {remoteUser?.role === "caregiver" ? (
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 18,
                    fontWeight: "600",
                    color: colors.gray7590,
                    marginTop: 8,
                  }}
                >
                  Área de atuação não informada
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 18,
                    fontWeight: "600",
                    color: colors.gray7590,
                    marginTop: 8,
                  }}
                >
                  Tipo de cuidado não informado
                </Text>
              )}
            </>
          ) : (
            <Text
              style={{
                ...typography.H01SB1618,
                color: colors.gray75,
                textAlign: "center",
                fontWeight: "600",
                marginTop: 4,
              }}
            >
              {remoteUser?.role === "caregiver"
                ? profileProps.caregiverData?.especialization
                : profileProps.patientData?.careType}
            </Text>
          )}
          {/* Cidade (exibida se existir em qualquer lugar do usuário) */}
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontWeight: "600",
              color: colors.gray75,
              marginTop: 6,
              textAlign: "center",
            }}
          >
            {remoteUser?.location}
          </Text>
          <View style={{ marginTop: 6, flexDirection: "row" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < (remoteUser?.rating ?? 0) ? "star" : "star-outline"}
                size={20}
                color={colors.ambar400}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Botão centralizado full-width */}
      <View
        style={{
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          width: "92%",
          marginHorizontal: "4%",
          marginVertical: 12,
        }}
      >
        {remoteUser?.role === "patient" ? (
          <View style={{ width: "100%", flexDirection: "column", gap: 16 }}>
            <View>
              {acceptedContact ? ( //solicitação aceita
                <PrimaryButton
                  title="Entrar em contato"
                  onPress={() => {
                    setShowStars(true);
                    const firstName = remoteUser?.name?.split(" ")[0] || "";
                    if (remoteUser?.phone) {
                      const initialMessage =
                        remoteUser.role === "patient"
                          ? `Olá ${firstName}! Tenho interesse nos seus serviços e encontrei seu perfil pelo aplicativo Conexão Vital.`
                          : `Olá ${firstName}! Vi sua solicitação pelo aplicativo Conexão Vital e estou entrando em contato para conversarmos sobre o que você precisa.`;
                      openWhatsApp(String(remoteUser.phone), initialMessage);
                    } else {
                      Alert.alert(
                        "Contato indisponível",
                        "O número de telefone deste usuário não está disponível no momento."
                      );
                    }
                  }}
                  icon={<WhatsappLogo size={20} color={colors.whiteFBFE} />}
                  disabled={!remoteUser?.phone}
                />
              ) : (
                <View style={{ width: "100%", margin: 0, padding: 0, gap: 16, flexDirection: "column" }} >
                  <View style={{ width: "100%", margin: 0, padding: 0, backgroundColor: colors.grayE8 }}>
                    <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray47, justifyContent: "center" }}>Solicitação pendente</Text>
                  </View>
                  <View style={{ width: "100%", flexDirection: "row", gap: 8 }}>
                    <ActionButton
                      title="Aceitar"
                      icon={<Check size={20} color={colors.greenAccept} />}
                      type="aceitar"
                      onPress={handleAccept}
                    />
                    <ActionButton
                      title="Recusar"
                      icon={<X size={20} color={colors.redc00} />}
                      type="recusar"
                      onPress={handleDecline}
                    />
                  </View>
                </View>
              )}
            </View>
            {showStars && (
              <View
                style={{
                  flexDirection: "column",
                  alignContent: "center",
                  justifyContent: "center",
                  gap: 12,
                  backgroundColor: colors.grayEF1,
                  paddingVertical: 16,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  marginTop: 16,
                  width: "100%",
                }}
              >
                <Text style={{ textAlign: "center", ...typography.M01R1214 }}>
                  Gostaria de avaliar esse perfil?
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {[1, 2, 3, 4, 5].map((starNumber) => renderStar(starNumber))}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    submitRating();
                    setShowStars(false);
                  }}
                  disabled={rating === 0}
                  style={{
                    paddingVertical: 4,
                    opacity: rating === 0 ? 0.6 : 1,
                  }}
                >
                  <Text
                    style={{
                      ...typography.M01R1214,
                      color: colors.green85F,
                      textAlign: "center",
                      fontWeight: "600",
                      textDecorationLine: "underline",
                    }}
                  >
                    Enviar avaliação
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={{ width: "100%", flexDirection: "column", gap: 8 }}>
            {!contactRequested && (
              <OutlinedButton
                title="Solicitar contato"
                onPress={() => {
                  handleRequest()
                  //Reativar

                  // Alert.alert(
                  //   "Atenção",
                  //   "Ao solicitar o contato, seu número também ficará visível para o outro usuário caso ele aceite sua solicitação. Deseja continuar?",
                  //   [
                  //     { text: "Cancelar", style: "cancel" },
                  //     {
                  //       text: "Continuar",
                  //       onPress: handleRequest,
                  //     },
                  //   ]
                  // );
                }}
                icon={<WhatsappLogo size={20} color={colors.green382} />}
              />
            )}

            {/* Contato pendente */}
            {contactRequested && acceptedContact === null && (
              <View style={{ width: "100%", paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.grayE8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 8 }}>
                <ClockCountdown size={18} color={colors.gray47} />
                <Text style={{ fontSize: 14, fontWeight: 600, color: colors.gray47 }}>Solicitação pendente</Text>
              </View>
            )}

            {/* Contato aceito */}
            {contactRequested && acceptedContact === true && (
              <View style={{ width: "100%", gap: 16, flexDirection: "column" }}>
                <View style={{ width: "100%", paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.greenAcceptBg, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 8 }}>
                  <SealCheck size={18} color={colors.greenAccept} />
                  <Text style={{ fontSize: 14, fontWeight: 600, color: colors.greenAccept }}>Solicitação aceita</Text>
                </View>
                <PrimaryButton
                  title="Entrar em contato"
                  onPress={() => {
                    setShowStars(true);
                    const firstName = remoteUser?.name?.split(" ")[0] || "";
                    if (remoteUser?.phone) {
                      const initialMessage =
                        remoteUser.role === "patient"
                          ? `Olá ${firstName}! Tenho interesse nos seus serviços e encontrei seu perfil pelo aplicativo Conexão Vital.`
                          : `Olá ${firstName}! Vi sua solicitação pelo aplicativo Conexão Vital e estou entrando em contato para conversarmos sobre o que você precisa.`;
                      openWhatsApp(String(remoteUser.phone), initialMessage);
                    } else {
                      Alert.alert(
                        "Contato indisponível",
                        "O número de telefone deste usuário não está disponível no momento."
                      );
                    }
                  }}
                  icon={<WhatsappLogo size={20} color={colors.whiteFBFE} />}
                  disabled={!remoteUser?.phone}
                />
              </View>
            )}

            {/* Contato recusado */}
            {contactRequested && acceptedContact === false && (
              <View style={{ width: "100%", paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.redc0019, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 8 }}>
                <Prohibit size={18} color={colors.redc00} />
                <Text style={{ fontSize: 14, fontWeight: 600, color: colors.redc00 }}>Solicitação recusada</Text>
              </View>
            )}

            {showStars && (
              <View
                style={{
                  flexDirection: "column",
                  alignContent: "center",
                  justifyContent: "center",
                  gap: 12,
                  backgroundColor: colors.grayEF1,
                  paddingVertical: 16,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  marginTop: 16,
                  // width: "100%",
                }}
              >
                <Text style={{ textAlign: "center", ...typography.M01R1214 }}>
                  Gostaria de avaliar esse perfil?
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {[1, 2, 3, 4, 5].map((starNumber) => renderStar(starNumber))}
                </View>
                <TouchableOpacity
                  onPress={() => {
                    submitRating;
                    setShowStars(false);
                  }}
                  disabled={rating === 0}
                  style={{
                    paddingVertical: 4,
                    opacity: rating === 0 ? 0.6 : 1,
                  }}
                >
                  <Text
                    style={{
                      ...typography.M01R1214,
                      color: colors.green85F,
                      textAlign: "center",
                      fontWeight: "600",
                      textDecorationLine: "underline",
                    }}
                  >
                    Enviar avaliação
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          width: "92%",
          marginHorizontal: "4%",
          borderBottomWidth: 1,
          borderBottomColor: colors.grayE8,
          marginBottom: 8,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 8,
            borderBottomWidth: 2,
            borderBottomColor: colors.green382,
          }}
        >
          <Text style={{ ...typography.M01B1624, color: colors.green382 }}>
            Informações {/* gerais */}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      {
        ProfileInfoComponent ? (
          <ProfileInfoComponent {...(profileProps as any)} />
        ) : (
          <Text style={{ color: colors.gray75 }}>
            Informações não disponíveis
          </Text>
        )
      }
    </ScrollView >
  );
}
