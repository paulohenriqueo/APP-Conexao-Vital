import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, styles, typography } from "../../../../styles/styles";
import { Input } from "../../../components/Input";
import { savePatientCondition } from "../../../services/patientService";
import { CaretLeft } from "phosphor-react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { capitalizeFirstLetter } from "../../../../utils/formatUtils";
import CareCategoryPicker from "../../../components/CareCategoryPicker";


export default function PatientCondition({ navigation }: any) {
  const [careCategory, setCareCategory] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [inicioPeriodo, setInicioPeriodo] = useState("");
  const [inicioPeriodoObj, setInicioPeriodoObj] = useState<Date | undefined>(undefined);
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [observacoes, setObservacoes] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [saving, setSaving] = useState(false);

  // listas dinâmicas
  const [alergiaInput, setAlergiaInput] = useState("");
  const [alergias, setAlergias] = useState<string[]>([]);

  const [medInput, setMedInput] = useState("");
  const [medicamentos, setMedicamentos] = useState<string[]>([]);

  const [condInput, setCondInput] = useState("");
  const [condicoes, setCondicoes] = useState<string[]>([]);

  const [idiomaInput, setIdiomaInput] = useState("");
  const [idiomasPreferidos, setIdiomasPreferidos] = useState<string[]>([]);

  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);

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

  const handleInicioChange = (event: any, selectedDate?: Date) => {
    setShowInicioPicker(false);
    if (selectedDate) {
      setInicioPeriodoObj(selectedDate);
      const d = String(selectedDate.getDate()).padStart(2, "0");
      const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const y = selectedDate.getFullYear();
      setInicioPeriodo(`${d}/${m}/${y}`);
    }
  };

  const handleSave = async () => {
    const payload = {
      periodos: selectedPeriods, // agora utiliza selectedPeriods
      inicioPeriodo,
      observacoes,
      alergias,
      medicamentos,
      condicoes,
      idiomasPreferidos,
    };
    setSaving(true);
    const res = await savePatientCondition(payload);
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
      {/* header com seta de voltar */}
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
          <Text style={{ ...typography.M01SB2024, color: colors.whiteFBFE }}>Informações de cuidado
          </Text>
        </View>
      </View>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 8,

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
            label="Tipo de cuidado necessário"
          />

          {/* Períodos como checkboxes (múltipla seleção) */}
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

          {/* <TouchableOpacity onPress={() => setShowInicioPicker(true)} activeOpacity={0.9}>
            <Input placeholder="Início do período" value={inicioPeriodo} editable={false} pointerEvents="none" style={{ marginBottom: 12 }} />
          </TouchableOpacity>
          {showInicioPicker && (
            <DateTimePicker
              value={inicioPeriodoObj || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleInicioChange}
              maximumDate={new Date(2100, 0, 1)}
            />
          )} */}

          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Observações</Text>
          <TextInput
            value={observacoes}
            onChangeText={(text) => (setObservacoes(capitalizeFirstLetter(text)))}
            placeholder="Anotações, restrições, orientações..."
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

          {/* Alergias */}
          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Alergias</Text>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Input
              placeholder="Adicionar alergia"
              value={alergiaInput}
              onChangeText={(text) => (setAlergiaInput(capitalizeFirstLetter(text)))}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              onPress={() => addToList(alergiaInput, setAlergias, alergias, setAlergiaInput)}
              style={{ marginLeft: 8, alignSelf: "center", paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}
            >
              <Text style={{ color: "#fff" }}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={alergias}
            horizontal
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                <Text style={{ color: colors.gray23 }}>{item}</Text>
                <TouchableOpacity onPress={() => removeFromList(index, setAlergias, alergias)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.orange360 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ marginBottom: 12 }}
          />

          {/* Medicamentos */}
          <Text style={{ color: colors.gray73, marginBottom: 10 }}>Medicamentos</Text>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Input placeholder="Adicionar medicamento" value={medInput} onChangeText={(text) => (setMedInput(capitalizeFirstLetter(text)))} style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => addToList(medInput, setMedicamentos, medicamentos, setMedInput)} style={{ marginLeft: 8, alignSelf: "center", paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}>
              <Text style={{ color: "#fff" }}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={medicamentos}
            horizontal
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                <Text style={{ color: colors.gray23 }}>{item}</Text>
                <TouchableOpacity onPress={() => removeFromList(index, setMedicamentos, medicamentos)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.orange360 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ marginBottom: 12 }}
          />

          {/* Condições */}
          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Condições (ex: Diabetes, Hipertensão)</Text>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Input placeholder="Adicionar condição" value={condInput} onChangeText={(text) => (setCondInput(capitalizeFirstLetter(text)))} style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => addToList(condInput, setCondicoes, condicoes, setCondInput)} style={{ marginLeft: 8, alignSelf: "center", paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}>
              <Text style={{ color: "#fff" }}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={condicoes}
            horizontal
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                <Text style={{ color: colors.gray23 }}>{item}</Text>
                <TouchableOpacity onPress={() => removeFromList(index, setCondicoes, condicoes)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.orange360 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ marginBottom: 12 }}
          />

          {/* Idiomas preferidos */}
          <Text style={{ color: colors.gray73, marginBottom: 6 }}>Idiomas preferidos</Text>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Input placeholder="Adicionar idioma" value={idiomaInput} onChangeText={(text) => (setIdiomaInput(capitalizeFirstLetter(text)))} style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => addToList(idiomaInput, setIdiomasPreferidos, idiomasPreferidos, setIdiomaInput)} style={{ marginLeft: 8, alignSelf: "center", paddingVertical: 12, paddingHorizontal: 14, backgroundColor: colors.green382, borderRadius: 8 }}>
              <Text style={{ color: "#fff" }}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={idiomasPreferidos}
            horizontal
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.grayE8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}>
                <Text style={{ color: colors.gray23 }}>{item}</Text>
                <TouchableOpacity onPress={() => removeFromList(index, setIdiomasPreferidos, idiomasPreferidos)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: colors.orange360 }}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ marginBottom: 12 }}
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
              {agreed && (
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  ✓
                </Text>
              )}
            </View>
            <Text
              style={{
                fontSize: 13,
                color: colors.gray73,
                flexShrink: 1,
              }}
            >
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
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              {saving ? "Salvando..." : "Salvar"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View >
  );
}