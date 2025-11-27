import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, styles, typography } from "../../../../styles/styles";
import { TopBar } from "../../../components/TopBar";
import { CaretLeft } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Avatar } from "../../../components/Avatar";
import { LinearGradient } from "expo-linear-gradient";
import { getAverageRatingColors } from "../../../../utils/getColors";

interface RatingItem {
    fromUserId?: string;
    fromUserName: string;
    rating: number;
    createdAt: string | Date | any;
}

interface FullRatingItem extends RatingItem {
    photoURL?: string;
}

const listStyles = StyleSheet.create({
    container: {
        backgroundColor: "#f9f9ff",
        padding: 12,
        borderRadius: 12,
        marginVertical: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    name: {
        fontSize: 14,
        color: colors.gray47,
        fontWeight: "600",
    },
    date: {
        fontSize: 12,
        color: colors.gray73,
    },
    box: {
        flex: 1,
        borderRadius: 16,
        padding: 12,
        color: colors.gray14,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: colors.gray7FD,
    },
    boxRow: {
        width: "100%",
        flexDirection: "row",
        paddingVertical: 12,
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    boxText: {
        color: colors.gray14,
    },
});

export default function ReceivedReviews() {
    const navigation = useNavigation<any>();

    const [totalRatings, setTotalRatings] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingsList, setRatingsList] = useState<FullRatingItem[]>([]);
    const [loading, setLoading] = useState(true);

    const { gradient: ratingGradient, textColor: ratingText } = getAverageRatingColors(averageRating);
    const neutralGradient = [colors.gray7FD, colors.grayF5, colors.grayEC] as const;

    function formatShortDate(date: Date) {
        const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

        const dia = date.getDate();
        const mes = meses[date.getMonth()];
        const ano = date.getFullYear();

        return `${dia} ${mes}. ${ano}`;
    }

    //mock para teste de visualização
    /*
    useEffect(() => {
        const mock = [
            {
                fromUserId: "u1",
                fromUserName: "Ana Paula",
                photoURL: "https://thispersonnotexist.org/downloadimage/Ac3RhdGljL3dvbWFuL3NlZWQyMzk2My5qcGVn",
                rating: 5,
                createdAt: new Date(),
            },
            {
                fromUserId: "u2",
                fromUserName: "João Silva",
                photoURL: "https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkMTc4NjIuanBlZw==",
                rating: 4,
                createdAt: new Date("2025-11-20"),
            },
            {
                fromUserId: "u3",
                fromUserName: "Marcos Vinícius",
                photoURL: "https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkMjQzODIuanBlZw==",
                rating: 3,
                createdAt: new Date("2025-11-15"),
            },
            {
                fromUserId: "u4",
                fromUserName: "Camila Andrade",
                photoURL: "https://thispersonnotexist.org/downloadimage/Ac3RhdGljL3dvbWFuL3NlZWQ5Nzg1LmpwZWc=",
                rating: 5,
                createdAt: new Date("2025-11-15"),
            },
            // {
            //     fromUserId: "u1",
            //     fromUserName: "Ana Paula",
            //     photoURL: "https://thispersonnotexist.org/downloadimage/Ac3RhdGljL3dvbWFuL3NlZWQyMzk2My5qcGVn",
            //     rating: 5,
            //     createdAt: new Date(),
            // },
            // {
            //     fromUserId: "u2",
            //     fromUserName: "João Silva",
            //     photoURL: "https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkMTc4NjIuanBlZw==",
            //     rating: 4,
            //     createdAt: new Date("2025-11-20"),
            // },
            // {
            //     fromUserId: "u3",
            //     fromUserName: "Marcos Vinícius",
            //     photoURL: "https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkMjQzODIuanBlZw==",
            //     rating: 3,
            //     createdAt: new Date("2025-11-15"),
            // },
            // {
            //     fromUserId: "u4",
            //     fromUserName: "Camila Andrade",
            //     photoURL: "https://thispersonnotexist.org/downloadimage/Ac3RhdGljL3dvbWFuL3NlZWQ5Nzg1LmpwZWc=",
            //     rating: 5,
            //     createdAt: new Date("2025-11-15"),
            // },
            // {
            //     fromUserId: "u1",
            //     fromUserName: "Ana Paula",
            //     photoURL: "https://thispersonnotexist.org/downloadimage/Ac3RhdGljL3dvbWFuL3NlZWQyMzk2My5qcGVn",
            //     rating: 5,
            //     createdAt: new Date(),
            // },
            // {
            //     fromUserId: "u2",
            //     fromUserName: "João Silva",
            //     photoURL: "https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkMTc4NjIuanBlZw==",
            //     rating: 4,
            //     createdAt: new Date("2025-11-20"),
            // },
            // {
            //     fromUserId: "u3",
            //     fromUserName: "Marcos Vinícius",
            //     photoURL: "https://thispersonnotexist.org/downloadimage/Ac3RhdGljL21hbi9zZWVkMjQzODIuanBlZw==",
            //     rating: 3,
            //     createdAt: new Date("2025-11-15"),
            // },
            // {
            //     fromUserId: "u4",
            //     fromUserName: "Camila Andrade",
            //     photoURL: "https://thispersonnotexist.org/downloadimage/Ac3RhdGljL3dvbWFuL3NlZWQ5Nzg1LmpwZWc=",
            //     rating: 5,
            //     createdAt: new Date("2025-11-15"),
            // },
        ];

        setRatingsList(mock);
        setTotalRatings(4);
        setAverageRating(4.25);
        setLoading(false);
    }, []);*/

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

                const ratings: RatingItem[] = data.ratings || [];

                const total = ratings.length;

                const avg =
                    ratings.length > 0
                        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                        : 0;

                setTotalRatings(total);
                setAverageRating(avg);
                setRatingsList(ratings);

                // Buscar foto do usuário avaliador
                const ratingsWithPhoto: FullRatingItem[] = await Promise.all(
                    ratings.map(async (r) => {
                        if (!r.fromUserId) return r;

                        const userSnap = await getDoc(doc(db, "Users", r.fromUserId));

                        return {
                            ...r,
                            photoURL: userSnap.exists() ? userSnap.data().photoURL : undefined,
                        };
                    })
                );

                setRatingsList(ratingsWithPhoto);

            } catch (error) {
                console.error("Erro ao carregar avaliações:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <View style={styles.container}>
            <TopBar title="" />

            <View
                style={{
                    flex: 1,
                    padding: 16,
                    width: "100%",
                    justifyContent: "flex-start",
                }}
            >
                {/* Header + Back */}
                <View
                    style={{
                        flexDirection: "row",
                        gap: 12,
                        alignItems: "center",
                        paddingTop: 8,
                        marginBottom: 12,
                    }}
                >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <CaretLeft size={24} color={colors.gray14} weight="bold" />
                    </TouchableOpacity>

                    <Text style={{ ...styles.subtitleText, textAlign: "left" }}>
                        Avaliações recebidas
                    </Text>
                </View>

                {/* Carregando */}
                {loading && (
                    <ActivityIndicator size="large" color={colors.gray14} />
                )}

                {/* Total + média */}
                {!loading && (
                    <View style={{ ...listStyles.boxRow }}>
                        {/* Total de avaliações */}
                        <LinearGradient
                            colors={neutralGradient}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={{ ...listStyles.box }}
                        >
                            <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", }}>
                                <Text style={{ ...typography.M01R1624, ...listStyles.boxText, marginBottom: 5 }}>Total</Text>
                                <Text style={{ ...typography.M01M1824, ...listStyles.boxText }}>{totalRatings}</Text>
                            </View>
                        </LinearGradient>

                        {/* Média de avaliações */}
                        <LinearGradient
                            colors={ratingGradient}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={{ ...listStyles.box }}
                        >
                            <Text style={{
                                ...typography.M01R1624,
                                ...listStyles.boxText,
                                marginBottom: 5,
                                color: ratingText,
                            }}>Média</Text>
                            <Text style={{
                                ...typography.M01M1824,
                                ...listStyles.boxText,
                                color: ratingText,
                            }}>{averageRating.toFixed(1)}</Text>
                        </LinearGradient>
                    </View>
                )}

                {/* Lista de avaliações */}
                {!loading && ratingsList.length > 0 ? (
                    <ScrollView>
                        {ratingsList.map((r, index) => (
                            <View key={index} style={listStyles.container}>

                                {/* Avatar */}
                                <Avatar
                                    name={r.fromUserName}
                                    photoURL={r.photoURL}
                                />

                                {/* Conteúdo */}
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    {/* Estrelas */}
                                    <View style={styles.ratingContainer}>
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Ionicons
                                                key={i}
                                                name={i < r.rating ? "star" : "star-outline"}
                                                size={16}
                                                color={colors.ambar400}
                                            />
                                        ))}
                                    </View>
                                    {/* Nome */}
                                    <Text style={listStyles.name}>
                                        {r.fromUserName}
                                    </Text>
                                    {/* Data */}
                                    <Text style={listStyles.date}>
                                        {formatShortDate(new Date(r.createdAt))}
                                    </Text>
                                </View>

                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    !loading && (
                        <Text style={{ ...styles.contentText, color: colors.gray47, alignSelf: "center", paddingVertical: 16 }}>
                            Nenhuma avaliação recebida ainda.
                        </Text>
                    )
                )}
            </View>
        </View>
    );
}
