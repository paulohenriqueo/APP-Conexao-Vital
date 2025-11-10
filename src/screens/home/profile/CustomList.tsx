import React from "react";
import { FlatList, View } from "react-native";
import { HistoryItem } from "../../../components/HistoryItem";
import { SearchResultItem } from "../../../components/SearchResultItem";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

type HistoryData = {
  id: string;
  name: string;
  rating: number;
  date: string;
  careCategory: string;
  imageUrl?: string;
};

type SearchData = {
  id: string;
  name: string;
  rating: number;
  tags: string[];
  careCategory: string;
  imageUrl?: string;
};

type CustomListProps = {
  type: "history" | "search";
  data: HistoryData[] | SearchData[];
};

export function CustomList({ type, data }: CustomListProps) {
  const navigation = useNavigation<any>();

  return (
    <FlatList<any>
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const handlePress = () =>
          navigation.navigate("ExternalUser", { userId: String(item.id) });

        return (
          <View style={{ marginBottom: 12 }}>
            {type === "history" ? (
              <HistoryItem
                name={(item as HistoryData).name}
                rating={(item as HistoryData).rating}
                date={(item as HistoryData).date}
                careCategory={(item as HistoryData).careCategory}
                imageUrl={(item as HistoryData).imageUrl || ""}
                onPress={handlePress}
              />
            ) : (
              <SearchResultItem
                name={(item as SearchData).name}
                rating={(item as SearchData).rating}
                tags={(item as SearchData).tags}
                careCategory={(item as SearchData).careCategory}
                imageUrl={(item as SearchData).imageUrl || ""}
                onPress={handlePress}
              />
            )}
          </View>
        );
      }}
    />
  );
}
