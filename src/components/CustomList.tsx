import React from "react";
import { FlatList } from "react-native";
import { HistoryItem } from "./HistoryItem";
import { SearchResultItem } from "./SearchResultItem";
import { useNavigation } from "@react-navigation/native";
import ExternalUser from "../screens/home/profile/ExternalUser";

type HistoryData = {
  id: string;
  name: string;
  rating: number;
  date: string;
  especialization: string;
  imageUrl?: string;
};

type SearchData = {
  id: string;
  name: string;
  rating: number;
  tags: string[];
  especialization: string;
  imageUrl?: string;
};

type CustomListProps = {
  type: "history" | "search";
  data: HistoryData[] | SearchData[];
};

export function CustomList({ type, data }: CustomListProps) {
  const navigation = useNavigation();

  return (
    <FlatList<any>
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => {
        const handlePress = () => {
          // navega para a tela ExternalUser passando o id - arrumar depois
          // navigation.navigate(ExternalUser(item.id) as never);
          console.log("Navega para a exibição do usuário: ", item.id)
        };

        return type === "history" ? (
          <HistoryItem
            name={(item as HistoryData).name}
            rating={(item as HistoryData).rating}
            date={(item as HistoryData).date}
            especialization={(item as HistoryData).especialization}
            imageUrl={(item as HistoryData).imageUrl || ""}
            onPress={handlePress}
          />
        ) : (
          <SearchResultItem
            name={(item as SearchData).name}
            rating={(item as SearchData).rating}
            tags={(item as SearchData).tags}
            especialization={(item as SearchData).especialization}
            imageUrl={(item as SearchData).imageUrl || ""}
            onPress={handlePress}
          />
        );
      }}
    />
  );
}
