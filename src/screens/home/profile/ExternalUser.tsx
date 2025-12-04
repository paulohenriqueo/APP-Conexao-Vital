"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { getAuth } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { colors } from "../../../../styles/colors"
import { typography } from "../../../../styles/typography"
import { useNavigation, type NavigationProp, useRoute, useFocusEffect } from "@react-navigation/native"
import { CaretLeft, Check, WhatsappLogo, X } from "phosphor-react-native"
import { Avatar } from "../../../components/Avatar"
import { Ionicons } from "@expo/vector-icons"
import CaregiverProfileInfo from "./CaregiverProfileInfo"
import { ActionButton, OutlinedButton, PrimaryButton } from "../../../components/Button"
import PatientProfileInfo from "./PatientProfileInfo"
import { openWhatsApp } from "../../../../utils/openWhatsApp"
import { TopBar } from "../../../components/TopBar"
import { savePatientContactRequest } from "../../../services/patientService"
import { acceptRequest, declineRequest, getRequestsForUser, type RequestItem } from "../../../services/requestService"
import { ClockCountdown, SealCheck, Prohibit } from "phosphor-react-native"
import type { HistoryData } from "./CustomList"
import { FIREBASE_AUTH } from "../../../../FirebaseConfig"
import { submitUserRating } from "../../../services/userService"
import { UserReviews } from "../../../components/UserReviews"

interface User {
  //Dados necessários para exibir perfil de outros usuários
  bio?: string
  role?: "caregiver" | "patient" | "undefined"
  userContact?: number
  qualifications?: string[]
  rating?: number
  imageUrl?: string
}

export default function ExternalUser() {
  const [userName, setUserName] = useState("")
  const [contactRequested, setContactRequested] = useState(false) // Estado para controlar se o contato foi solicitado
  const [acceptedContact, setAcceptedContact] = useState<boolean | null>(null)
  const [existingRequest, setExistingRequest] = useState<boolean>(false)
  const [showStars, setShowStars] = useState(false) // Estado para controlar se entrou em contato
  const [rating, setRating] = useState(0)

  const navigation = useNavigation<NavigationProp<any>>()
  const route: any = useRoute()

  // usar userId passado via navegação para carregar usuário externo
  const userIdParam: string | undefined = route.params?.userId

  const [loading, setLoading] = useState(true)
  const [remoteUser, setRemoteUser] = useState<any>(null)

  const auth = getAuth()

  const loggedUserId = auth.currentUser?.uid
  const currentUserId = FIREBASE_AUTH.currentUser?.uid!

  const [requestStatus, setRequestStatus] = useState<"pending" | "accepted" | "declined" | null>(null)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)

  const loadStatusForUsers = useCallback(async (remoteUserId: string, currentUserIdParam: string) => {
    if (!remoteUserId || !currentUserIdParam) {
      return
    }

    setIsLoadingStatus(true)
    try {
      const requests = await getRequestsForUser(currentUserIdParam)

      // Procurar a solicitação entre esses dois usuários
      const relatedRequest = requests.find((req: any) => {
        // Se foi enviada (paciente enviou para cuidador)
        if (req.direction === "sent") {
          return req.caregiverId === remoteUserId
        }
        // Se foi recebida (cuidador recebeu do paciente)
        if (req.direction === "received") {
          return req.patientId === remoteUserId
        }
        return false
      })

      if (relatedRequest) {
        setRequestStatus(relatedRequest.status as "pending" | "accepted" | "declined")
        console.log("[v0] Status encontrado:", relatedRequest.status)
      } else {
        setRequestStatus(null)
        console.log("[v0] Nenhuma solicitação encontrada entre", currentUserIdParam, "e", remoteUserId)
      }
    } catch (err) {
      console.warn("[v0] Erro ao carregar status:", err)
      setRequestStatus(null)
    } finally {
      setIsLoadingStatus(false)
    }
  }, [])

  useEffect(() => {
    if (remoteUser?.id && currentUserId) {
      loadStatusForUsers(remoteUser.id, currentUserId)
    }
  }, [remoteUser?.id, currentUserId])

  useFocusEffect(
    useCallback(() => {
      if (remoteUser?.id && currentUserId) {
        loadStatusForUsers(remoteUser.id, currentUserId)
      }
    }, [remoteUser?.id, currentUserId]), // Removed loadStatusForUsers from dependencies
  )

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const db = getFirestore()
        const uid = userIdParam ?? auth.currentUser?.uid

        if (!uid) {
          setRemoteUser(null)
          return
        }

        const userDocRef = doc(db, "Users", uid)
        const userSnap = await getDoc(userDocRef)

        if (!userSnap.exists()) {
          setRemoteUser(null)
          return
        }

        const data = userSnap.data()

        const role =
          data?.profileType ??
          (data?.caregiverSpecifications || data?.caregiverProfile
            ? "caregiver"
            : data?.patientProfile
              ? "patient"
              : "undefined")

        const city = data?.patientProfile?.city ?? data?.caregiverProfile?.city ?? ""
        const state = data?.patientProfile?.state ?? data?.caregiverProfile?.state ?? ""

        let location = ""
        if (city && state) location = `${city} | ${state}`
        else if (city) location = city
        else if (state) location = state
        else location = "Localização não informada"

        setRemoteUser({
          id: userSnap.id,
          name: data?.name ?? data?.displayName ?? "",
          email: data?.email ?? null,
          role,

          phone: data?.patientProfile?.phone ?? data?.caregiverProfile?.phone ?? null,

          rating: data?.rating ?? 0,
          imageUrl: data?.caregiverProfile?.photo ?? data?.patientProfile?.photo ?? undefined,

          city,
          state,
          location,

          caregiverSpecifications: data?.caregiverSpecifications ?? data?.caregiverProfile ?? null,

          patientProfile: {
            ...(data?.patientProfile ?? {}),
            ...(data?.condition ?? {}),
          },

          bio: data?.bio ?? data?.description ?? "",
        })
      } catch (err) {
        console.warn("Erro ao buscar ExternalUser:", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [userIdParam])

  const ProfileInfoComponent = remoteUser?.role === "caregiver" ? CaregiverProfileInfo : PatientProfileInfo
  const profileProps =
    remoteUser?.role === "caregiver"
      ? { caregiverData: remoteUser?.caregiverSpecifications ?? {} }
      : { patientData: remoteUser?.patientProfile ?? {} }

  useEffect(() => {
    if (remoteUser) {
      setUserName(remoteUser.name || "")
      setRating(remoteUser.rating ?? 0)
    }
  }, [remoteUser])

  const renderStar = (starNumber: number) => {
    return (
      <TouchableOpacity key={starNumber} onPress={() => setRating(starNumber)}>
        <Ionicons name={starNumber <= rating ? "star" : "star-outline"} size={20} color={colors.green85F} />
      </TouchableOpacity>
    )
  }

  const submitRating = async () => {
    if (rating === 0) {
      Alert.alert("Selecione uma avaliação antes de enviar!")
      return
    }
    const result = await submitUserRating(remoteUser.id, rating)

    if (result.ok) {
      Alert.alert("Obrigado!", "Avaliação enviada com sucesso.")
    } else {
      Alert.alert("Erro", "Não foi possível enviar sua avaliação.")
    }

    setShowStars(false)

    console.log("Avaliação enviada:", rating)
    Alert.alert("Obrigado pela avaliação!", `Você avaliou com ${rating} estrelas.`)

    setRating(0)
  }

  const handleRequest = async () => {
    setContactRequested(true)
    setAcceptedContact(null) // pending

    await savePatientContactRequest(remoteUser.id, remoteUser.name)

    Alert.alert("Contato solicitado", "Sua solicitação de contato foi enviada com sucesso!", [{ text: "OK" }])
  }

  const remoteUserId = remoteUser?.id

  const isPatient = remoteUser?.role === "patient"

  const [historyData, setHistoryData] = useState<HistoryData[]>([])

  const [requestsSent, setRequestsSent] = useState<RequestItem[]>([])

  useEffect(() => {
    const loadRequestsSent = async () => {
      if (!loggedUserId) {
        setRequestsSent([])
        return
      }

      try {
        const requests = await getRequestsForUser(loggedUserId)
        setRequestsSent(requests)
      } catch (err) {
        console.warn("Erro ao carregar requestsSent:", err)
        setRequestsSent([])
      }
    }

    loadRequestsSent()
  }, [loggedUserId])

  useFocusEffect(
    useCallback(() => {
      const loadRequestsSent = async () => {
        if (!loggedUserId) return

        try {
          const requests = await getRequestsForUser(loggedUserId)
          setRequestsSent(requests)
        } catch (err) {
          console.warn("Erro ao carregar requestsSent:", err)
        }
      }

      loadRequestsSent()
    }, [loggedUserId]),
  )

  const handleAccept = useCallback(async () => {
    if (!remoteUser) return

    const loggedUserId = FIREBASE_AUTH.currentUser?.uid
    const remoteUserId = remoteUser.id
    const isRemoteUserPatient = remoteUser.role === "patient"
    const patientIdToPass = isRemoteUserPatient ? remoteUserId : loggedUserId
    const caregiverIdToPass = isRemoteUserPatient ? loggedUserId : remoteUserId

    try {
      const result = await acceptRequest(patientIdToPass, caregiverIdToPass)

      if (result.ok) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        await loadStatusForUsers(remoteUserId, loggedUserId)
        Alert.alert("Sucesso!", "Solicitação aceita e status atualizado.")
      } else {
        console.error("Erro ao aceitar:", result.error)
        Alert.alert("Erro", "Não foi possível aceitar a solicitação.")
      }
    } catch (error) {
      console.error("Erro na exceção:", error)
    }
  }, [remoteUser])

  const handleDecline = useCallback(async () => {
    if (!remoteUser) return

    const loggedUserId = FIREBASE_AUTH.currentUser?.uid
    const remoteUserId = remoteUser.id
    const isRemoteUserPatient = remoteUser.role === "patient"
    const patientIdToPass = isRemoteUserPatient ? remoteUserId : loggedUserId
    const caregiverIdToPass = isRemoteUserPatient ? loggedUserId : remoteUserId

    try {
      const result = await declineRequest(patientIdToPass, caregiverIdToPass)

      if (result.ok) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        await loadStatusForUsers(remoteUserId, loggedUserId)
        Alert.alert("Solicitação recusada com sucesso.")
      } else {
        console.error("Erro ao recusar:", result.error)
        Alert.alert("Erro", "Não foi possível recusar a solicitação.")
      }
    } catch (error) {
      console.error("Erro na exceção:", error)
    }
  }, [remoteUser])

  useEffect(() => {
    if (!remoteUser) return

    const checkExistingRequest = async () => {
      try {
        const requests = await getRequestsForUser(loggedUserId)
        const alreadyRequested = requests.some(
          (req) => req.patientId === remoteUser.id || req.caregiverId === remoteUser.id,
        )
        setExistingRequest(alreadyRequested)
      } catch (err) {
        console.warn("Erro ao verificar solicitações existentes:", err)
      }
    }

    checkExistingRequest()
  }, [remoteUser, loggedUserId])

  function canRequestContact(targetUserId: string): boolean {
    if (!requestsSent || requestsSent.length === 0) {
      return true
    }

    const existingRequest = requestsSent.find((req) => {
      if (!isPatient && remoteUser?.role === "patient") {
        return req.patientId === targetUserId && req.caregiverId === loggedUserId
      }
      if (isPatient && remoteUser?.role === "caregiver") {
        return req.patientId === loggedUserId && req.caregiverId === targetUserId
      }
      return false
    })

    return !existingRequest
  }

  const requestAllowed = canRequestContact(remoteUser?.id ?? "")

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

          <View style={{ marginTop: -40, marginBottom: 8 }}>
            <Avatar size={84} name={userName} photoURL={remoteUser?.imageUrl} />
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
                    marginTop: 4,
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
                    marginTop: 4,
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
                ? profileProps.caregiverData?.careCategory
                : profileProps.patientData?.careType}
            </Text>
          )}
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontWeight: "600",
              color: colors.gray75,
              marginTop: 2,
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
        {isLoadingStatus ? (
          <View
            style={{
              width: "100%",
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color={colors.green382} />
          </View>
        ) : (
          <>
            {remoteUser?.role === "patient" ? (
              <View style={{ width: "100%", flexDirection: "column", gap: 16 }}>
                {requestStatus === "accepted" && (
                  <>
                    <View
                      style={{
                        width: "100%",
                        gap: 8,
                        flexDirection: "column",
                        marginBottom: 16,
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          backgroundColor: colors.greenAcceptBg,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          borderRadius: 8,
                        }}
                      >
                        <SealCheck size={18} color={colors.greenAccept} />
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: colors.greenAccept,
                          }}
                        >
                          Solicitação aceita
                        </Text>
                      </View>
                    </View>
                    <PrimaryButton
                      title="Entrar em contato"
                      onPress={() => {
                        setShowStars(true)
                        const firstName = remoteUser?.name?.split(" ")[0] || ""
                        if (remoteUser?.phone) {
                          const initialMessage =
                            remoteUser.role === "patient"
                              ? `Olá ${firstName}! Tenho interesse nos seus serviços e encontrei seu perfil pelo aplicativo Conexão Vital.`
                              : `Olá ${firstName}! Vi sua solicitação pelo aplicativo Conexão Vital e estou entrando em contato para conversarmos sobre o que você precisa.`
                          openWhatsApp(String(remoteUser.phone), initialMessage)
                        } else {
                          Alert.alert(
                            "Contato indisponível",
                            "O número de telefone deste usuário não está disponível no momento.",
                          )
                        }
                      }}
                      icon={<WhatsappLogo size={20} color={colors.whiteFBFE} />}
                      disabled={!remoteUser?.phone}
                    />
                  </>
                )}

                {requestStatus === "declined" && (
                  <View
                    style={{
                      width: "100%",
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor: colors.redc0019,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      borderRadius: 8,
                    }}
                  >
                    <Prohibit size={18} color={colors.redc00} />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: colors.redc00,
                      }}
                    >
                      Solicitação recusada
                    </Text>
                  </View>
                )}

                {requestStatus === "pending" && (
                  <View
                    style={{
                      width: "100%",
                      margin: 0,
                      padding: 0,
                      gap: 16,
                      flexDirection: "column",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor: colors.grayE8,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0,
                        borderRadius: 8,
                      }}
                    >
                      <ClockCountdown size={18} color={colors.gray47} />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: colors.gray47,
                        }}
                      >
                        Solicitação pendente
                      </Text>
                    </View>
                    <View style={{ width: "100%", flexDirection: "row", gap: 8 }}>
                      <ActionButton
                        title="Aceitar"
                        icon={<Check size={20} color={colors.greenAccept} />}
                        type="accepted"
                        onPress={() => {
                          handleAccept()
                        }}
                      />
                      <ActionButton
                        title="Recusar"
                        icon={<X size={20} color={colors.redc00} />}
                        type="declined"
                        onPress={() => {
                          handleDecline()
                        }}
                      />
                    </View>
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
                        submitRating()
                        setShowStars(false)
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
                {requestStatus === null && requestAllowed && (
                  <OutlinedButton
                    title="Solicitar contato"
                    onPress={() => {
                      handleRequest()
                    }}
                    icon={<WhatsappLogo size={20} color={colors.green382} />}
                  />
                )}

                {requestStatus === "pending" && (
                  <View
                    style={{
                      width: "100%",
                      margin: 0,
                      padding: 0,
                      gap: 8,
                      flexDirection: "column",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor: colors.grayE8,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        borderRadius: 8,
                      }}
                    >
                      <ClockCountdown size={18} color={colors.gray47} />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: colors.gray47,
                        }}
                      >
                        Solicitação pendente
                      </Text>
                    </View>
                  </View>
                )}

                {requestStatus === "accepted" && (
                  <View style={{ width: "100%", gap: 16, flexDirection: "column" }}>
                    <View
                      style={{
                        width: "100%",
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        backgroundColor: colors.greenAcceptBg,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        borderRadius: 8,
                      }}
                    >
                      <SealCheck size={18} color={colors.greenAccept} />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: colors.greenAccept,
                        }}
                      >
                        Solicitação aceita
                      </Text>
                    </View>
                    <PrimaryButton
                      title="Entrar em contato"
                      onPress={() => {
                        setShowStars(true)
                        const firstName = remoteUser?.name?.split(" ")[0] || ""
                        if (remoteUser?.phone) {
                          const initialMessage =
                            remoteUser.role === "patient"
                              ? `Olá ${firstName}! Tenho interesse nos seus serviços e encontrei seu perfil pelo aplicativo Conexão Vital.`
                              : `Olá ${firstName}! Vi sua solicitação pelo aplicativo Conexão Vital e estou entrando em contato para conversarmos sobre o que você precisa.`
                          openWhatsApp(String(remoteUser.phone), initialMessage)
                        } else {
                          Alert.alert(
                            "Contato indisponível",
                            "O número de telefone deste usuário não está disponível no momento.",
                          )
                        }
                      }}
                      icon={<WhatsappLogo size={20} color={colors.whiteFBFE} />}
                      disabled={!remoteUser?.phone}
                    />
                  </View>
                )}

                {requestStatus === "declined" && (
                  <View
                    style={{
                      width: "100%",
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor: colors.redc0019,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      borderRadius: 8,
                    }}
                  >
                    <Prohibit size={18} color={colors.redc00} />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: colors.redc00,
                      }}
                    >
                      Solicitação recusada
                    </Text>
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
                        submitRating()
                        setShowStars(false)
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
          </>
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
          <Text style={{ ...typography.M01B1624, color: colors.green382 }}>Informações</Text>
        </TouchableOpacity>
      </View>

      {ProfileInfoComponent ? (
        <ProfileInfoComponent {...(profileProps as any)} />
      ) : (
        <Text style={{ color: colors.gray75 }}>Informações não disponíveis</Text>
      )}
      {/* <View style={{ marginTop: 24, width: "92%", marginHorizontal: "4%" }}>
        <UserReviews userId={remoteUser?.id} />
      </View> */}
    </ScrollView>
  )
}
