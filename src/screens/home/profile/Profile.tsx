import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { colors } from "../../../../styles/colors";
import { fontWeights } from "../../../../styles/typography";
import { styles } from "../../../../styles/styles";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"info" | "qualifications">("info");

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "flex-start",
        padding: 16,
        backgroundColor: colors.whiteFBFE,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Foto de perfil, nome e estrelas */}
      <View
        style={{
          alignItems: "center",
          width: "100%",
          backgroundColor: colors.gray7FD,
          borderRadius: 16,
          paddingVertical: 24,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            width: 84,
            height: 84,
            borderRadius: 42,
            marginBottom: 12,
            backgroundColor: colors.grayE8,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <MaterialIcons name="person" size={54} color={colors.gray75} />
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: fontWeights.bold,
            marginBottom: 4,
            color: colors.gray23,
            textAlign: "center",
          }}
        >
          João Almeida Júnior
        </Text>
        <View style={{ flexDirection: "row", marginTop: 4 }}>
          {[...Array(5)].map((_, i) => (
            <MaterialIcons key={i} name="star" size={20} color="#FFD700" />
          ))}
        </View>
      </View>

      {/* Botões */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.green382,
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 8,
            marginRight: 8,
            justifyContent: "center",
          }}
        >
          <Feather name="edit-2" size={18} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontWeight: fontWeights.bold,
              marginLeft: 8,
            }}
          >
            Editar perfil
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            borderColor: colors.green382,
            borderWidth: 1.5,
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 8,
            marginLeft: 8,
            backgroundColor: "#fff",
            justifyContent: "center",
          }}
        >
          <Feather name="repeat" size={18} color={colors.green382} />
          <Text
            style={{
              color: colors.green382,
              fontWeight: fontWeights.bold,
              marginLeft: 8,
            }}
          >
            Alternar conta
          </Text>
        </TouchableOpacity>
      </View>

      {/* Abas */}
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          borderBottomWidth: 1,
          borderBottomColor: colors.grayE8,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 8,
            borderBottomWidth: activeTab === "info" ? 2 : 0,
            borderBottomColor: colors.green382,
          }}
          onPress={() => setActiveTab("info")}
        >
          <Text
            style={{
              color: activeTab === "info" ? colors.green382 : colors.gray75,
              fontWeight: fontWeights.bold,
            }}
          >
            Informações gerais
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 8,
            borderBottomWidth: activeTab === "qualifications" ? 2 : 0,
            borderBottomColor: colors.green382,
          }}
          onPress={() => setActiveTab("qualifications")}
        >
          <Text
            style={{
              color:
                activeTab === "qualifications" ? colors.green382 : colors.gray75,
              fontWeight: fontWeights.bold,
            }}
          >
            Qualificações
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo das abas */}
      <View style={{ width: "100%", marginBottom: 16, paddingHorizontal: 4 }}>
        {activeTab === "info" ? (
          <Text
            style={{...styles.contentText, padding: 0, marginTop: 12}}
          >
            Lorem ipsum dolor sit amet consectetur. Eget condimentum amet enim
            lacinia at. Nunc felis orci vestibulum adipiscing sit in erat porta
            feugiat. Fermentum quis eget et massa amet aliquet blandit. Magnis
            aliquam penatibus augue fringilla urna nisl quisque viverra.
          </Text>
        ) : (
          <Text
            style={{...styles.contentText, padding: 0, marginTop: 12}}
          >
            Qualificações do usuário exibidas aqui.
          </Text>
        )}
      </View>

      {/* Históricos */}
      <Text
        style={{
          fontSize: 17,
          fontWeight: fontWeights.bold,
          marginBottom: 8,
          alignSelf: "flex-start",
          marginTop: 8,
          color: colors.gray23,
        }}
      >
        Históricos
      </Text>
      <View
        style={{
          width: "100%",
          backgroundColor: colors.gray7FD,
          borderRadius: 12,
          padding: 0,
          marginBottom: 24,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 18,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.grayE8,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: colors.gray23,
            }}
          >
            Avaliações realizadas
          </Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={colors.gray75}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 18,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: colors.gray23,
            }}
          >
            Compra de créditos
          </Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={colors.gray75}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}