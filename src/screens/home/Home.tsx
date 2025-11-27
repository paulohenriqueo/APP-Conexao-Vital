import React, { useEffect, useState } from "react";
import { View, Text, Alert, BackHandler, StyleSheet, Modal, Button, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TopBar } from "../../components/TopBar";
import { BottomNavBar } from "../../components/BottomNavbar";
import { colors, styles, typography } from "../../../styles/styles";
import { CompleteProfileModal } from "../../components/Modal";
import { SearchBar } from "../../components/SearchBar";
import Profile from "./profile/Profile";
import { CustomList } from "./profile/CustomList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PopUpFormsModel from "../model/PopUpFormsModel";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { getCurrentUserType, getProfilesByType, searchProfilesByName, PublicProfile, getUserProfile } from "../../services/userService";
import { SecondaryButton } from "../../components/Button";
import { Picker } from "@react-native-picker/picker";
import { getPendingRequestsColors, getAverageRatingColors } from "../../../utils/getColors";
import { LinearGradient } from "expo-linear-gradient";
import { getRequestsForUser, RequestItem, updateStatus } from "../../services/requestService";
import type { HistoryData } from "./profile/CustomList";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default function Home() {
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState("home");
  const [showModal, setShowModal] = useState(false); // start false, set after check
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterCity, setFilterCity] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("");
  const [filterLanguages, setFilterLanguages] = useState<string[]>([]);
  const [currentProfileType, setCurrentProfileType] = useState<string | null>(null);
  const [profilesList, setProfilesList] = useState<PublicProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const searchTimeoutRef = React.useRef<any>(null);
  // lista de estados (UF + nome). Ordem aqui para o Picker (o código UF será usado para buscar cidades)
  const BRAZIL_STATES: { uf: string; name: string }[] = [
    { uf: "AC", name: "Acre" }, { uf: "AL", name: "Alagoas" }, { uf: "AP", name: "Amapá" },
    { uf: "AM", name: "Amazonas" }, { uf: "BA", name: "Bahia" }, { uf: "CE", name: "Ceará" },
    { uf: "DF", name: "Distrito Federal" }, { uf: "ES", name: "Espírito Santo" }, { uf: "GO", name: "Goiás" },
    { uf: "MA", name: "Maranhão" }, { uf: "MT", name: "Mato Grosso" }, { uf: "MS", name: "Mato Grosso do Sul" },
    { uf: "MG", name: "Minas Gerais" }, { uf: "PA", name: "Pará" }, { uf: "PB", name: "Paraíba" },
    { uf: "PR", name: "Paraná" }, { uf: "PE", name: "Pernambuco" }, { uf: "PI", name: "Piauí" },
    { uf: "RJ", name: "Rio de Janeiro" }, { uf: "RN", name: "Rio Grande do Norte" }, { uf: "RS", name: "Rio Grande do Sul" },
    { uf: "RO", name: "Rondônia" }, { uf: "RR", name: "Roraima" }, { uf: "SC", name: "Santa Catarina" },
    { uf: "SP", name: "São Paulo" }, { uf: "SE", name: "Sergipe" }, { uf: "TO", name: "Tocantins" },
  ];
  const PERIODS = ["", "Manhã", "Tarde", "Noite"];
  const LANGUAGES = ["Português", "Inglês", "Espanhol"];

  // cidades carregadas dinamicamente ao selecionar estado
  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [pendingRequests, setPendingRequests] = useState(0);
  const [receivedRequests, setReceivedRequests] = useState(0);
  const [acceptedRequests, setAcceptedRequests] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const { gradient: pendingGradient, textColor: pendingText } = getPendingRequestsColors(pendingRequests);
  const { gradient: ratingGradient, textColor: ratingText } = getAverageRatingColors(averageRating);
  const neutralGradient = [colors.gray7FD, colors.grayF5, colors.grayE8] as const;

  const currentUserId = FIREBASE_AUTH.currentUser?.uid!;

  console.log("USER LOGADO:", FIREBASE_AUTH.currentUser?.uid);
  useEffect(() => {
    async function loadDebugUser() {
      const userId = FIREBASE_AUTH.currentUser?.uid;

      console.log("🔵 [DEBUG] Usuário logado:", userId);

      if (!userId) {
        console.log("⚠️ [DEBUG] Nenhum usuário logado.");
        return;
      }

      try {
        const ref = doc(FIRESTORE_DB, "Users", userId);
        const snap = await getDoc(ref);

        console.log("🟣 [DEBUG] Documento bruto do usuário:");
        console.log(snap.data());

      } catch (err) {
        console.log("❌ [DEBUG] Erro ao buscar usuário:", err);
      }
    }

    loadDebugUser();
  }, []);

  interface RequestItem {
    status: string;
    patientId: string;
    createdAt: string;
    patientName: string;
  }

  interface RatingItem {
    fromUserId?: string;
    fromUserName: string;
    rating: number;
    createdAt: string | Date | any;
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const currentUser = auth.currentUser;

        if (!currentUser) return;

        const userRef = doc(db, "Users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) return;

        const data = snap.data();

        // ========== SOLICITAÇÕES ==========
        const receivedRequests: RequestItem[] = data.receivedRequests || [];

        const totalReceived = receivedRequests.length;
        const pending = receivedRequests.filter((r) => r.status === "pending").length;
        const accepted = receivedRequests.filter((r) => r.status === "accepted").length;

        setReceivedRequests(totalReceived);
        setPendingRequests(pending);
        setAcceptedRequests(accepted);

        // ========== AVALIAÇÕES ==========
        // Só falta o nome do campo no Firestore
        const ratings: RatingItem[] = data.ratings || [];

        const totalRatings = ratings.length;

        const avgRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;

        setTotalRatings(totalRatings);
        setAverageRating(avgRating);

      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    // carrega tipo do usuário inicialmente e a lista padrão (sem filtro)
    (async () => {
      try {
        const type = await getCurrentUserType();
        setCurrentProfileType(type);
      } catch (e) {
        console.warn("Erro carregando tipo do usuário:", e);
      }
    })();
  }, []);

  // Reage a mudanças no search e currentProfileType: debounce e busca no Firestore
  useEffect(() => {
    if (!currentProfileType) return;
    const targetType = currentProfileType === "caregiver" ? "patient" : currentProfileType === "patient" ? "caregiver" : null;
    if (!targetType) {
      setProfilesList([]);
      return;
    }

    // debounce
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      setLoadingProfiles(true);
      try {
        const term = search?.trim() ?? "";
        const filters = {
          city: filterCity,
          state: filterState,
          period: filterPeriod,
          languages: filterLanguages,
        };

        if (term === "" && !filters.city && !filters.state && !filters.period && (!filters.languages || filters.languages.length === 0)) {
          const items = await getProfilesByType(targetType);
          setProfilesList(items);
        } else {
          const items = await searchProfilesByName(targetType, term, filters);
          setProfilesList(items);
        }
      } catch (e) {
        console.warn("Erro buscando perfis:", e);
      } finally {
        setLoadingProfiles(false);
      }
    }, 450);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [search, currentProfileType, filterCity, filterState, filterPeriod, filterLanguages]);

  useEffect(() => {
    const backAction = () => {
      const previousRoute = navigation.getState()?.routes?.slice(-2, -1)[0];

      if (previousRoute?.name === "Login") {
        Alert.alert(
          "Sair da conta",
          "Deseja realmente sair da sua conta?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Sair",
              style: "destructive",
              onPress: () => navigation.replace("Login"),
            },
          ]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    (async () => {
      try {
        const seen = await AsyncStorage.getItem("hasSeenCompleteProfileModal");
        console.log(
          "DEBUG:",
          "\nTipo de usuário =", currentProfileType,
          "\nhasSeenCompleteProfileModal =", seen,
          "\nprofileCompleted =", profileCompleted
          //perfil não está sendo completo
        );
        // só mostra se ainda não viu e perfil não completo
        if (!seen && !profileCompleted) {
          setShowModal(true);
          // ⚠️ para testar manualmente, descomente abaixo
          // } else if (__DEV__) {
          //   // durante desenvolvimento, forçar a modal aparecer para testar
          //   console.log("DEBUG: forcing modal visible in __DEV__");
          //   setTimeout(() => setShowModal(true), 300);
        }
      } catch (e) {
        console.warn("AsyncStorage error", e);
        setShowModal(!profileCompleted);
      }
    })();
  }, [profileCompleted]);

  const handleSelectPatient = async () => {
    try {
      await AsyncStorage.setItem("hasSeenCompleteProfileModal", "true");
    } catch (e) { }
    setShowModal(false);
    navigation.navigate("PatientForms");
  };

  const handleSelectCaregiver = async () => {
    try {
      await AsyncStorage.setItem("hasSeenCompleteProfileModal", "true");
    } catch (e) { }
    setShowModal(false);
    navigation.navigate("CaregiverForms");
  };

  const [historyData, setHistoryData] = useState<HistoryData[]>([]);

  // ------------------------------
  // FUNÇÃO GLOBAL — pode ser usada no accept/decline
  // ------------------------------
  async function loadRequests() {
    try {
      console.log("🔄 Carregando solicitações...");

      const requests = await getRequestsForUser(currentUserId);

      const formatted: HistoryData[] = [];

      for (const req of requests) {
        const isCaregiver = currentProfileType === "caregiver";
        const otherUserId = isCaregiver ? req.patientId : req.caregiverId;

        // pegar dados do outro usuário
        const otherRef = doc(FIRESTORE_DB, "Users", otherUserId);
        const otherSnap = await getDoc(otherRef);
        const otherData = otherSnap.data();

        const name =
          otherData?.name ||
          otherData?.displayName ||
          otherData?.patientProfile?.nome ||
          otherData?.caregiverProfile?.nome ||
          "Usuário";

        const photo =
          otherData?.patientProfile?.photo ||
          otherData?.caregiverProfile?.photo ||
          null;

        const careCategory =
          otherData?.caregiverSpecifications?.careCategory ||
          otherData?.condition?.careCategory ||
          otherData?.careCategory ||
          "";

        const rating =
          otherData?.rating ??
          otherData?.averageRating ??
          0;

        // converter status
        const statusMap: any = {
          pending: "pendente",
          accepted: "aceita",
          rejected: "recusada",
        };

        const mappedStatus = statusMap[req.status] ?? "pendente";

        // formatar data
        const dateObj = new Date(req.createdAt);
        const formattedDate = dateObj.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

        formatted.push({
          id: otherUserId,
          name,
          imageUrl: photo,
          careCategory,
          rating,
          date: formattedDate,
          requestStatus: mappedStatus,
          currentProfileType: currentProfileType as any,
        });
      }

      setHistoryData(formatted.reverse());
      console.log("🟩 Histórico formatado:", formatted);

    } catch (err) {
      console.warn("Erro ao carregar solicitações:", err);
    }
  }

  // ------------------------------
  // useEffect apenas chama loadRequests
  // ------------------------------
  useEffect(() => {
    if (!currentUserId || !currentProfileType) return;

    console.log("🟦 Chamando loadRequests: userId e type prontos");
    loadRequests();
  }, [currentUserId, currentProfileType]);

  // ------------------------------
  // Funções de aceitar/recusar
  // ------------------------------
  async function acceptRequestFromHistory(id: string) {
    console.log("✔️ [acceptRequest] Aceitando ID:", id);
    await updateStatus(id, currentUserId, "accepted");
    console.log("🔄 [acceptRequest] Atualizando lista...");
    await loadRequests();
  }

  async function declineRequestFromHistory(id: string) {
    console.log("❌ [declineRequest] Recusando ID:", id);
    await updateStatus(id, currentUserId, "declined");
    console.log("🔄 [declineRequest] Atualizando lista...");
    await loadRequests();
  }

  const searchData = [] as any;

  // Função para renderizar conteúdo dependendo da aba selecionada
  const renderContent = () => {
    switch (selectedTab) {
      case "home":
        return (
          <>
            {currentProfileType === "caregiver" ? (
              // Home do profissional
              //Pegar métricas
              <View style={{ flex: 1, width: "100%", padding: 0, gap: 16 }}>
                {/* Solicitações pendentes */}
                <LinearGradient
                  colors={pendingGradient}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.professionalHomeBox}
                >
                  {pendingRequests > 0 ? (
                    <TouchableOpacity
                      onPress={() => setSelectedTab("history")}
                      style={{ justifyContent: "center", alignItems: "center", width: "100%" }}
                    >
                      <Text
                        style={{
                          ...typography.M01R1824,
                          ...styles.professionalHomeText,
                          marginBottom: 5,
                          color: pendingText,
                        }}
                      >
                        Solicitações pendentes
                      </Text>

                      <Text
                        style={{
                          ...typography.M01M2024,
                          ...styles.professionalHomeText,
                          color: pendingText,
                        }}
                      >
                        {pendingRequests}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <Text
                        style={{
                          ...typography.M01R1824,
                          ...styles.professionalHomeText,
                          marginBottom: 5,
                          color: pendingText,
                        }}
                      >
                        Solicitações pendentes
                      </Text>

                      <Text
                        style={{
                          ...typography.M01M2024,
                          ...styles.professionalHomeText,
                          color: pendingText,
                        }}
                      >
                        {pendingRequests}
                      </Text>
                    </>
                  )}
                </LinearGradient>

                <LinearGradient
                  colors={neutralGradient}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ ...styles.professionalHomeBox }}
                >
                  <Text style={{ ...typography.M01R1824, ...styles.professionalHomeText, marginBottom: 5 }}>Solicitações</Text>
                  <View style={{ ...styles.professionalHomeBoxRow }}>
                    <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", }}>
                      <Text style={{ ...typography.M01R1624, ...styles.professionalHomeText }}>Recebidas</Text>
                      <Text style={{ ...typography.M01M2024, ...styles.professionalHomeText }}>{receivedRequests}</Text>
                    </View>
                    <View style={{ width: 0.5, height: "100%", backgroundColor: colors.blackShadow, marginTop: 8 }}>
                    </View>
                    <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", }}>
                      <Text style={{ ...typography.M01R1624, ...styles.professionalHomeText }}>Aceitas</Text>
                      <Text style={{ ...typography.M01M2024, ...styles.professionalHomeText }}>{acceptedRequests}</Text>
                    </View>
                  </View>
                </LinearGradient>

                {/* Média de avaliações */}
                <LinearGradient
                  colors={ratingGradient}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ ...styles.professionalHomeBox }}
                >
                  <Text style={{
                    ...typography.M01R1824,
                    ...styles.professionalHomeText,
                    marginBottom: 5,
                    color: ratingText,
                  }}>Média de avaliações</Text>
                  <Text style={{
                    ...typography.M01M2024,
                    ...styles.professionalHomeText,
                    color: ratingText,
                  }}>{averageRating.toFixed(1)}</Text>
                </LinearGradient>

                <LinearGradient
                  colors={neutralGradient}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ ...styles.professionalHomeBox }}
                >
                  <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", }}>
                    <Text style={{ ...typography.M01R1824, ...styles.professionalHomeText, marginBottom: 5 }}>Total de avaliações</Text>
                    <Text style={{ ...typography.M01M2024, ...styles.professionalHomeText }}>{totalRatings}</Text>
                  </View>
                </LinearGradient>
              </View >
            ) : (
              // Home do cliente ou sem usuário definido
              <View style={{ flex: 1, width: "100%", padding: 0 }}>
                <SearchBar
                  value={search}
                  onChangeText={setSearch}
                  onPressFilter={() => setFilterVisible(v => !v)}
                  placeholder="Pesquisar..."
                />

                {/* filtros ativos: chips removíveis */}
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16, marginTop: 8 }}>
                  {filterCity ? (
                    <TouchableOpacity onPress={() => setFilterCity("")} style={{ backgroundColor: "#eee", padding: 8, borderRadius: 16, marginRight: 8 }}>
                      <Text>{filterCity} ✕</Text>
                    </TouchableOpacity>
                  ) : null}
                  {filterState ? (
                    <TouchableOpacity onPress={() => setFilterState("")} style={{ backgroundColor: "#eee", padding: 8, borderRadius: 16, marginRight: 8 }}>
                      <Text>{filterState} ✕</Text>
                    </TouchableOpacity>
                  ) : null}
                  {filterPeriod ? (
                    <TouchableOpacity onPress={() => setFilterPeriod("")} style={{ backgroundColor: "#eee", padding: 8, borderRadius: 16, marginRight: 8 }}>
                      <Text>{filterPeriod} ✕</Text>
                    </TouchableOpacity>
                  ) : null}
                  {filterLanguages.map((l) => (
                    <TouchableOpacity key={l} onPress={() => setFilterLanguages(prev => prev.filter(x => x !== l))} style={{ backgroundColor: "#eee", padding: 8, borderRadius: 16, marginRight: 8 }}>
                      <Text>{l} ✕</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* painel de filtros (pequeno) */}
                {filterVisible && (
                  <View style={{ backgroundColor: "#fff", padding: 12, marginHorizontal: 16, borderRadius: 8, marginTop: 12, elevation: 2 }}>
                    <Text style={{ marginBottom: 6 }}>Estado</Text>
                    <View style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
                      <Picker selectedValue={filterState} onValueChange={(v) => { setFilterState(String(v)); setFilterCity(""); }}>
                        <Picker.Item key={""} label={"Qualquer"} value={""} />
                        {BRAZIL_STATES.map((s) => (<Picker.Item key={s.uf} label={`${s.name} (${s.uf})`} value={s.uf} />))}
                      </Picker>
                    </View>

                    <Text style={{ marginBottom: 6 }}>Cidade</Text>
                    <View style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 6, overflow: "hidden", marginBottom: 8, minHeight: 48, justifyContent: "center" }}>
                      {citiesLoading ? (
                        <View style={{ paddingVertical: 8, alignItems: "center" }}>
                          <ActivityIndicator size="small" />
                        </View>
                      ) : (
                        <Picker selectedValue={filterCity} onValueChange={(v) => setFilterCity(String(v))}>
                          {citiesList.length === 0 ? (
                            <Picker.Item key={""} label={"Qualquer"} value={""} />
                          ) : (
                            citiesList.map((c) => (<Picker.Item key={c} label={c === "" ? "Qualquer" : c} value={c} />))
                          )}
                        </Picker>
                      )}
                    </View>

                    <Text style={{ marginBottom: 6 }}>Período</Text>
                    <View style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
                      <Picker selectedValue={filterPeriod} onValueChange={(v) => setFilterPeriod(String(v))}>
                        {PERIODS.map((p) => (<Picker.Item key={p} label={p === "" ? "Qualquer" : p} value={p} />))}
                      </Picker>
                    </View>

                    <Text style={{ marginBottom: 6 }}>Idiomas</Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
                      {LANGUAGES.map((lang) => {
                        const active = filterLanguages.includes(lang);
                        return (
                          <TouchableOpacity
                            key={lang}
                            onPress={() => setFilterLanguages(prev => active ? prev.filter(x => x !== lang) : [...prev, lang])}
                            style={{ backgroundColor: active ? "#cfe" : "#f4f4f4", padding: 8, borderRadius: 16, marginRight: 8, marginBottom: 8 }}
                          >
                            <Text>{lang}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
                      <TouchableOpacity onPress={() => { setFilterCity(""); setFilterState(""); setFilterPeriod(""); setFilterLanguages([]); }} style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                        <Text>Limpar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setFilterVisible(false);
                          // Força nova busca imediatamente
                          setSearch((prev) => prev + ""); // apenas dispara o useEffect de busca
                        }}
                        style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "#007aff", borderRadius: 6 }}>
                        <Text style={{ color: "#fff" }}>Aplicar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <Text style={{ ...styles.subtitleText, textAlign: "left", paddingVertical: 16 }}>
                  {/* Melhores avaliados */} Novos usuários
                </Text>

                {currentProfileType ? (
                  <CustomList
                    type="search"
                    data={profilesList as any} // cast para evitar conflito de tipos com HistoryData/SearchData
                  />
                ) : (
                  <View style={{ paddingHorizontal: 16, paddingVertical: 32, alignItems: "center", gap: 32 }}>
                    <Text style={{ color: colors.gray75, textAlign: "center" }}>
                      Selecione seu tipo de conta e tenha acesso às conexões certas para o seu perfil.
                    </Text>
                    <SecondaryButton title="Selecionar tipo de conta" onPress={handleOpenSelectModal} />
                  </View>
                )}
              </View>
            )
            }
          </>
        );

      // exibir a pesquisa
      case "search":
        return (
          <View style={{ flex: 1, width: "100%", padding: 0 }}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              onPressFilter={() => console.log("Filter pressed in Home")}
              placeholder="Pesquisar..."
            />
            <Text style={{ ...styles.subtitleText, textAlign: "left", paddingVertical: 16 }}>
              Resultados encontrados
            </Text>
            <CustomList
              type="search"
              data={searchData}
            />
          </View>
        );

      case "history":
        return (
          <View style={{ flex: 1, width: "100%", padding: 0 }}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              onPressFilter={() => console.log("Filter pressed in History")}
              placeholder="Pesquisar..."
            />
            <View style={{ flexDirection: "column", gap: 2, alignContent: "flex-start" }}>
              <Text style={{ ...styles.subtitleText, textAlign: "left", paddingTop: 16 }}>
                Histórico de solicitações
              </Text>
              <Text style={{ ...typography.M01M1420, color: colors.gray94, textAlign: "left", paddingBottom: 16 }}>
                Total de solicitações: {receivedRequests}
              </Text>
            </View>
            <CustomList
              type="history"
              data={historyData}
              onAccept={async (id) => {
                await acceptRequestFromHistory(id);
              }}
              onDecline={async (id) => {
                await declineRequestFromHistory(id);
              }}
            />
          </View>
        );

      case "profile":
        return <Profile />
      default:
        return <Text style={styles.contentText}>Início</Text>;
    }
  };

  const handleOpenSelectModal = async () => {
    setShowModal(true);
  };

  // ao trocar o estado, busca cidades via API do IBGE
  useEffect(() => {
    if (!filterState) {
      setCitiesList([]);
      return;
    }

    let active = true;
    const uf = String(filterState);
    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        // IBGE API: retorna municípios para UF
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        if (!res.ok) throw new Error("Erro ao buscar cidades");
        const json = await res.json();
        if (!active) return;
        const names = Array.isArray(json) ? json.map((m: any) => m.nome as string) : [];
        // adiciona opção vazia como "Qualquer"
        setCitiesList(["", ...names]);
      } catch (e) {
        console.warn("IBGE fetch error:", e);
        setCitiesList([""]); // fallback
      } finally {
        if (active) setCitiesLoading(false);
      }
    };

    fetchCities();

    return () => { active = false; };
  }, [filterState]);

  return (
    <View style={styles.container}>
      <TopBar title="" />

      <View style={styles.contentArea}>{renderContent()}</View>
      <BottomNavBar selected={selectedTab} onSelect={setSelectedTab} />

      <PopUpFormsModel
        visible={showModal && !profileCompleted}
        onClose={() => setShowModal(false)}
        onSelectPatient={handleSelectPatient}
        onSelectCaregiver={handleSelectCaregiver}
      />
    </View >
  );
}
