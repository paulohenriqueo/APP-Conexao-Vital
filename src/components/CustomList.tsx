import React from "react";
import { FlatList } from "react-native";
import { HistoryItem } from "./HistoryItem";
import { SearchResultItem } from "./SearchResultItem";

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
  onItemPress: (id: string) => void;
};

export function CustomList({ type, data, onItemPress }: CustomListProps) {
  return (
    <FlatList<any>
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) =>
        type === "history" ? (
          <HistoryItem
            name={(item as HistoryData).name}
            rating={(item as HistoryData).rating}
            date={(item as HistoryData).date}
            especialization={(item as HistoryData).especialization}
            imageUrl={(item as HistoryData).imageUrl || ""}
            onPress={() => onItemPress(item.id)}
          />
        ) : (
          <SearchResultItem
            name={(item as SearchData).name}
            rating={(item as SearchData).rating}
            tags={(item as SearchData).tags}
            especialization={(item as SearchData).especialization}
            imageUrl={(item as SearchData).imageUrl || ""}
            onPress={() => onItemPress(item.id)}
          />
        )
      }
    />
  );
}
