import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/SearchResultItem";
import { colors } from "../../styles/colors";
import { Avatar } from "./Avatar";

type SearchResultItemProps = {
  name: string;
  rating: number;
  tags: string[];
  onPress: () => void;
};

export function SearchResultItem({ name, rating, tags, onPress }: SearchResultItemProps) {
  return (
    <View style={styles.container}>
      <Avatar name={name} />

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{name}</Text>

        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < rating ? "star" : "star-outline"}
              size={18}
              color= {colors.ambar400}
            />
          ))}
        </View>

        <View style={styles.tagsContainer}>
          {tags.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity onPress={onPress}>
        <Ionicons name="chevron-forward" size={22} color="#333" />
      </TouchableOpacity>
    </View>
  );
}
