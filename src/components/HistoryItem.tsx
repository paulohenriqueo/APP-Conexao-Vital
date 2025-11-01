import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles as historyStyles } from "./styles/HistoryItem";
import { colors } from "../../styles/colors";
import { styles, typography } from "../../styles/styles";
import { Avatar } from "./Avatar";

type HistoryItemProps = {
    name: string;
    rating: number;
    date: string;
    especialization: string;
    imageUrl?: string;
    onPress: () => void;
};

export function HistoryItem({ name, especialization, rating, date, imageUrl, onPress }: HistoryItemProps) {
    return (
        <View style={historyStyles.container}>
            <Avatar name={name} imageUrl={imageUrl}/>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={historyStyles.name}>{name}
                    <Text style={historyStyles.especialization}>  {especialization}</Text>
                </Text>
                <View style={{ ...styles.ratingContainer }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Ionicons
                            key={i}
                            name={i < rating ? "star" : "star-outline"}
                            size={14}
                            color={colors.ambar400}
                        />
                    ))}
                </View>
                <Text style={historyStyles.date}>{date}</Text>
            </View>

            <TouchableOpacity onPress={onPress}>
                <Ionicons name="chevron-forward" size={22} color="#333" />
            </TouchableOpacity>
        </View>
    );
}
