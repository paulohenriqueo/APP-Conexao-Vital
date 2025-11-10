import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { colors, styles, typography } from "../../../../styles/styles";
import { Input } from "../../../components/Input";
import { saveCaregiverSpecifications } from "../../../services/CaregiverService";
import { CaretLeft } from "phosphor-react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { capitalizeFirstLetter } from "../../../../utils/formatUtils";
import CareCategoryPicker from "../../../components/CareCategoryPicker";

export default function CaregiverSpecifications({ navigation }: any) {
  const [careCategory, setCareCategory] = useState("");
  const [experienciaInput, setExperienciaInput] = useState("");
  const [experiencias, setExperiencias] = useState<string[]>([]);

  const [qualInput, setQualInput] = useState("");
  const [qualificacoes, setQualificacoes] = useState<string[]>([]);

  const [dispoDiaInput, setDispoDiaInput] = useState("");
  const [dispoDia, setDispoDia] = useState<string[]>([]);

  // disponibilidade por dias — opções fixas e seleção múltipla (checkbox)
  const dayOptions = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [dispoHora, setDispoHora] = useState<string[]>([]);

  // opções de público e seleção múltipla
  const publicoOptions = [
    "Crianças",
    "Adultos",
    "Idosos",
  ];
  const [selectedPublico, setSelectedPublico] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);

  const periodOptions = [
    { key: "matutino", label: "Matutino" },
    { key: "vespertino", label: "Vespertino" },
    { key: "noturno", label: "Noturno" },
  ];


  const addToList = (value: string, setter: (v: string[]) => void, list: string[], clear: (v: string) => void) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setter([...list, trimmed]);
    clear("");
  };

  const removeFromList = (index: number, setter: (v: string[]) => void, list: string[]) => {
    const copy = [...list];
    copy.splice(index, 1);
    setter(copy);
  };

  const togglePeriod = (key: string) => {
    setSelectedPeriods(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    if (!agreed) {
      Alert.alert("Atenção", "É necessário declarar que as informações são verdadeiras.");
      return;
    }

    const payload = {
      experiencia: experiencias,
      qualificacoes,
      dispoDia: selectedDays, // agora usa os dias selecionados (array)
      dispoHora,
      publicoAtendido: selectedPublico, // agora é array
      observacoes,
    };

    setSaving(true);
    const res = await saveCaregiverSpecifications(payload);
    setSaving(false);

    if (res.ok) {
      navigation.navigate("Home");
    } else {
      Alert.alert("Erro", "Não foi possível salvar as informações de cuidado.");
      console.error(res.error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.green382 }}>
      {/* header com seta */}
      <View
        style={{
          width: "100%",
          paddingTop: Platform.OS === "android" ? 24 : 40,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={[styles.header, { paddingTop: 20, marginVertical: 8 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <CaretLeft size={24} color={colors.whiteFBFE} weight="bold" accessibilityLabel="Voltar para o formulário" />
          </TouchableOpacity>
          <Text style={{ ...typography.M01SB2024, color: colors.whiteFBFE }}>Especificações do cuidador</Text>
        </View>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 8,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.containerBox,
            {
              width: "90%",
              maxWidth: 430,
              paddingBottom: 24,
              borderRadius: 24,
              overflow: "hidden",
              marginTop: 0,
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
            },
          ]}
        >
          <CareCategoryPicker
            selectedValue={careCategory}
            onValueChange={setCareCategory}
            label="Área de atuação"
          />

          {/* Experiência */}
          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Experiência</Text>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Input
              placeholder="Adicionar experiência"
              value={experienciaInput}
              onChangeText={(text) => (setExperienciaInput(capitalizeFirstLetter(text)))}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              onPress={() => addToList(experienciaInput, setExperiencias, experiencias, setExperienciaInput)}
              style={{
                marginLeft: 8,
                alignSelf: "center",
                paddingHorizontal: 16,
                paddingVertical: 10,
                backgroundColor: colors.green382,
                borderRadius: 8,
                minHeight: 42,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={experiencias}
            horizontal
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.grayE8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: colors.gray23 }}>{item}</Text>
                <TouchableOpacity onPress={() => removeFromList(index, setExperiencias, experiencias)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.orange360 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ marginBottom: 12 }}
          />

          {/* Qualificações */}
          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Qualificações</Text>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Input placeholder="Adicionar qualificação" value={qualInput} onChangeText={(text) => (setQualInput(capitalizeFirstLetter(text)))} style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={() => addToList(qualInput, setQualificacoes, qualificacoes, setQualInput)}
              style={{
                marginLeft: 8,
                alignSelf: "center",
                paddingHorizontal: 16,
                paddingVertical: 10,
                backgroundColor: colors.green382,
                borderRadius: 8,
                minHeight: 42,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={qualificacoes}
            horizontal
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.grayE8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: colors.gray23 }}>{item}</Text>
                <TouchableOpacity onPress={() => removeFromList(index, setQualificacoes, qualificacoes)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.orange360 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ marginBottom: 12 }}
          />

          {/* Disponibilidade por dia (checkboxes - múltipla seleção) */}
          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Disponibilidade - Dias</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
            {dayOptions.map(day => {
              const selected = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  activeOpacity={0.8}
                  onPress={() =>
                    setSelectedDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]))
                  }
                  style={{ flexDirection: "row", alignItems: "center", marginRight: 12, marginBottom: 8 }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      borderWidth: 1.5,
                      borderColor: selected ? colors.green85F : colors.grayE8,
                      backgroundColor: selected ? colors.green85F : "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 8,
                    }}
                  >
                    {selected && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
                  </View>
                  <Text style={{ color: colors.gray73 }}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Disponibilidade por horário */}
          <Text style={{ color: colors.gray73, marginBottom: 8 }}>Período</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
            {periodOptions.map(opt => {
              const selected = selectedPeriods.includes(opt.key);
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => togglePeriod(opt.key)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 12,
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      borderWidth: 1.5,
                      borderColor: selected ? colors.green85F : colors.grayE8,
                      backgroundColor: selected ? colors.green85F : "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 8,
                    }}
                  >
                    {selected && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
                  </View>
                  <Text style={{ color: colors.gray73 }}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <FlatList
            data={dispoHora}
            horizontal
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.grayE8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: colors.gray23 }}>{item}</Text>
                <TouchableOpacity onPress={() => removeFromList(index, setDispoHora, dispoHora)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.orange360 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ marginBottom: 12 }}
          />

          {/* Público atendido */}
          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Público atendido</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
            {publicoOptions.map(opt => {
              const selected = selectedPublico.includes(opt);
              return (
                <TouchableOpacity
                  key={opt}
                  activeOpacity={0.8}
                  onPress={() =>
                    setSelectedPublico(prev => (prev.includes(opt) ? prev.filter(p => p !== opt) : [...prev, opt]))
                  }
                  style={{ flexDirection: "row", alignItems: "center", marginRight: 12, marginBottom: 8 }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      borderWidth: 1.5,
                      borderColor: selected ? colors.green85F : colors.grayE8,
                      backgroundColor: selected ? colors.green85F : "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 8,
                    }}
                  >
                    {selected && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}
                  </View>
                  <Text style={{ color: colors.gray73 }}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Observações</Text>
          <TextInput
            value={observacoes}
            onChangeText={(text) => (setObservacoes(capitalizeFirstLetter(text)))}
            placeholder="Informações adicionais..."
            placeholderTextColor={colors.gray75}
            style={{
              backgroundColor: colors.gray7FD,
              borderRadius: 8,
              height: 100,
              textAlignVertical: "top",
              padding: 12,
              marginBottom: 12,
            }}
            multiline
          />

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 12,
              alignSelf: "flex-start",
            }}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 1.5,
                borderColor: agreed ? colors.green85F : colors.grayE8,
                backgroundColor: agreed ? colors.green85F : "#fff",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}
            >
              {agreed && <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>✓</Text>}
            </View>
            <Text style={{ fontSize: 13, color: colors.gray73, flexShrink: 1 }}>
              Declaro que todas as informações acima são verdadeiras
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: agreed ? colors.green382 : colors.grayE8,
              borderRadius: 8,
              width: "100%",
              alignItems: "center",
              paddingVertical: 14,
              marginTop: 8,
            }}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>{saving ? "Salvando..." : "Salvar"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}