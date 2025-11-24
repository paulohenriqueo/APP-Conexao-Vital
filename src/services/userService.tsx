import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  arrayUnion, 
  serverTimestamp 
} from "firebase/firestore";

import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";

// ------------------------------------------------------
// TIPAGEM DO PERFIL PÚBLICO (para listas, busca, etc.)
// ------------------------------------------------------

export type PublicProfile = {
  id: string;
  name: string;
  rating?: number;
  tags?: string[];
  imageUrl?: string | null;
  especialization?: string;
  profileType?: string;
};

// ------------------------------------------------------
// OBTÉM O TIPO DO USUÁRIO ATUAL (patient / caregiver)
// ------------------------------------------------------

export async function getCurrentUserType(): Promise<string | null> {
  try {
    const uid = FIREBASE_AUTH?.currentUser?.uid;
    if (!uid) return null;

    const ref = doc(FIRESTORE_DB, "Users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data();
    return data?.profileType ?? null;

  } catch (err) {
    console.error("getCurrentUserType error:", err);
    return null;
  }
}

// ------------------------------------------------------
// BUSCA PERFIS POR TIPO (para listas)
// ------------------------------------------------------

export async function getProfilesByType(type: string): Promise<PublicProfile[]> {
  try {
    const col = collection(FIRESTORE_DB, "Users");
    const q = query(col, where("profileType", "==", type));
    const snaps = await getDocs(q);

    const list: PublicProfile[] = snaps.docs.map((d: any) => {
      const data: any = d.data();

      const name =
        data?.patientProfile?.nome ||
        data?.caregiverProfile?.nome ||
        data?.displayName ||
        data?.name ||
        "";

      return {
        id: d.id,
        name,
        rating: data?.rating ?? 0,
        tags: data?.tags ?? data?.especializacoes ?? [],
        imageUrl: data?.caregiverProfile?.photo ||
                  data?.patientProfile?.photo ||
                  null,
        especialization: data?.especialization ?? data?.especializacoes?.[0] ?? type,
        profileType: data?.profileType ?? null,
      };
    });

    return list;

  } catch (err) {
    console.error("getProfilesByType error:", err);
    return [];
  }
}

// ------------------------------------------------------
// BUSCA PERFIL COMPLETO DO USUÁRIO
// ------------------------------------------------------

export async function getUserProfile(userId: string) {
  console.log("🔎 [getUserProfile] Buscando perfil do UID:", userId);

  const docRef = doc(FIRESTORE_DB, "Users", userId);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() ? docSnap.data() : null;
}

// ------------------------------------------------------
// SALVAR AVALIAÇÃO DE USUÁRIO
// ------------------------------------------------------

export async function submitUserRating(targetUserId: string, rating: number) {
  try {
    const userRef = doc(FIRESTORE_DB, "Users", targetUserId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return { ok: false, error: "Usuário não encontrado" };

    const userData = userSnap.data();
    const currentUser = FIREBASE_AUTH.currentUser;

    const review = {
      fromUserId: currentUser?.uid,
      fromUserName: currentUser?.displayName || currentUser?.email || "Usuário",
      rating,
      createdAt: new Date().toISOString(),
    };

    const previousTotal = userData.totalRatings ?? 0;
    const previousAvg = userData.rating ?? 0;

    const updatedTotal = previousTotal + 1;
    const updatedSum = previousAvg * previousTotal + rating;

    const updatedAverage = Number((updatedSum / updatedTotal).toFixed(1));

    await updateDoc(userRef, {
      reviews: arrayUnion(review),
      totalRatings: updatedTotal,
      rating: updatedAverage,
      updatedAt: serverTimestamp(),
    });

    return { ok: true };

  } catch (err) {
    console.error("submitUserRating error:", err);
    return { ok: false, error: err };
  }
}

// ------------------------------------------------------
// BUSCAR AVALIAÇÕES DO USUÁRIO (listagem + média + total)
// ------------------------------------------------------

export async function getUserReviews(userId: string) {
  try {
    const ref = doc(FIRESTORE_DB, "Users", userId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data();
    let reviews = data.reviews ?? [];

    reviews = reviews.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      rating: data.rating ?? 0,
      totalRatings: data.totalRatings ?? 0,
      reviews,
    };

  } catch (err) {
    console.error("getUserReviews error:", err);
    return null;
  }
}

// ------------------------------------------------------
// FORMATAÇÃO DA DATA DAS AVALIAÇÕES
// ------------------------------------------------------

export function formatReviewDate(dateValue: any) {
  if (!dateValue) return "";

  let d: Date;

  if (typeof dateValue === "string") {
    d = new Date(dateValue);
  } else if (dateValue?.toDate) {
    d = dateValue.toDate();
  } else {
    d = new Date(dateValue);
  }

  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
