import { colors } from "../styles/colors";

/**
 * Define cores e gradiente conforme o número de solicitações pendentes.
 */
export function getPendingRequestsColors(pendingRequests: number) {
    if (pendingRequests === 0) {
        return {
            gradient: [colors.gray7FD, colors.grayF5, colors.grayE8] as const,
            textColor: colors.gray14,
        };
    } else if (pendingRequests < 5) {
        return {
            gradient: ["#e7c623", "#eeab1b", "#e4740c"]  as const, // amarelo suave
            textColor: colors.whiteFBFE,
        };
    } else {
        return {
            gradient: ["#E77123CB", "#ee501bcB", "#d50707cB"] as const, // tons de vermelho
            textColor: colors.whiteFBFE,
        };
    }
}

/**
 * Define cores e gradiente conforme a média de avaliações.
 */
export function getAverageRatingColors(averageRating: number) {
    if (averageRating === 0) {
        return {
            gradient: [colors.gray7FD, colors.grayF5, colors.grayE8] as const,
            textColor: colors.gray14,
        };
    } else if (averageRating < 3) {
        return {
            gradient: ["#E77123", "#ee501b", "#d50707"] as const, // vermelho degradê
            textColor: colors.whiteFBFE,
        };
    } else if (averageRating < 4) {
        return {
            gradient: ["#e7c623", "#eeab1b", "#e4740c"] as const, // amarelo degradê
            textColor: colors.whiteFBFE,
        };
    } else {
        return {
            gradient: ["#7FD737CB", "#21b032CB", "#008a22CB"] as const, // verde degradê
            textColor: colors.whiteFBFE,
        };
    }
}
