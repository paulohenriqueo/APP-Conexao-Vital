import React from "react";
import { FlatList, View } from "react-native";
import { HistoryItem } from "../../../components/HistoryItem";
import { SearchResultItem } from "../../../components/SearchResultItem";
import { useNavigation } from "@react-navigation/native";

export type HistoryData = {
  id: string;
  name: string;
  rating: number;
  date: string;
  careCategory: string;
  imageUrl?: string;
  requestStatus?: "accepted" | "declined" | "pending" | undefined;
  currentProfileType?: "caregiver" | "patient";
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
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
};

export function CustomList({ type, data, onAccept, onDecline }: CustomListProps) {
  const navigation = useNavigation<any>();
  return (
    <FlatList<any>
      data={data}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({ item }) => {
        const handlePress = () =>
          navigation.navigate("ExternalUser", { userId: String(item.id) });

        return (
          <View style={{ marginBottom: 12 }}>
            {type === "history" ? (
              <HistoryItem
                name={item.name}
                rating={item.rating}
                date={item.date}
                careCategory={item.careCategory}
                imageUrl={(item as HistoryData).imageUrl || ""}
                requestStatus={item.requestStatus}
                currentProfileType={item.currentProfileType}
                onPress={handlePress}
                onAccept={() => onAccept?.(item.id)}
                onDecline={() => onDecline?.(item.id)}
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
