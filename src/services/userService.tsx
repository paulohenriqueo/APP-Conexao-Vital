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
// BUSCA PERFIL PELO NOME
// ------------------------------------------------------
export async function searchProfilesByName(
  type: string,
  nameQuery: string,
  filters?: { city?: string; state?: string; period?: string; languages?: string[] }
): Promise<PublicProfile[]> {
  try {
    const col = collection(FIRESTORE_DB, "Users");
    const q = query(col, where("profileType", "==", type));
    const snaps = await getDocs(q);
    const term = (nameQuery || "").trim().toLowerCase();

    const list: PublicProfile[] = snaps.docs
      .map((d: any) => {
        const data: any = d.data();
        const name =
          data?.name ||
          "";

        // campos para filtro
        const city =
          data?.patientProfile?.city ||
          data?.caregiverProfile?.city ||
          "";
        const state =
          data?.patientProfile?.state ||
          data?.caregiverProfile?.state ||
          "";
        const period =
          data?.condition?.periodOptions ||
          data?.caregiverProfile?.periodOptions ||
          "";
        const languages: string[] =
          data?.patientProfile?.idiomasPreferidos ||
          data?.caregiverSpecifications?.idiomasPreferidos ||
          [];

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
          _meta: { city, state, period, languages },
        } as PublicProfile;
      })
      .filter((p: any) => {
        // filtro por nome
        if (term && (!p.name || !p.name.toLowerCase().includes(term))) return false;
        // filtro cidade
        if (filters?.city && filters.city.trim() !== "") {
          if (!p._meta.city || !p._meta.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
        }
        // filtro estado
        if (filters?.state && filters.state.trim() !== "") {
          if (!p._meta.state || !p._meta.state.toLowerCase().includes(filters.state.toLowerCase())) return false;
        }
        // filtro período
        if (filters?.period && filters.period.trim() !== "") {
          if (!p._meta.period || !p._meta.period.toLowerCase().includes(filters.period.toLowerCase())) return false;
        }
        // filtro idiomas
        if (filters?.languages && filters.languages.length > 0) {
          const langs = (p._meta.languages || []).map((l: string) => l.toLowerCase());
          const required = filters.languages.map((l) => l.toLowerCase());
          if (!required.some((r) => langs.includes(r))) return false;
        }
        return true;
      });

    return list;
  } catch (err) {
    console.error("searchProfilesByName error:", err);
    return [];
  }
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
    
    const previousTotal = userData.totalRatings ?? 0;

    const previousAvg = userData.rating ?? 0;

    const updatedSum = previousAvg * previousTotal + rating;

    const updatedTotal = previousTotal + 1;

    const review = {
      fromUserId: currentUser?.uid,
      fromUserName: currentUser?.displayName || currentUser?.email || "Usuário",
      rating,
      createdAt: new Date().toISOString()
    };

    

    const updatedAverage = Number((updatedSum / updatedTotal).toFixed(1));

    await updateDoc(userRef, {
      reviews: arrayUnion(review),
      totalRatings: updatedTotal,
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
    const ref = doc(FIRESTORE_DB, "Users", userId)
    const snap = await getDoc(ref)

    if (!snap.exists()) return null

    const data = snap.data()
    let reviews = data.reviews ?? []

    reviews = reviews.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return {
      rating: data.reviews.rating ?? 0,
      totalRatings: data.totalRatings ?? 0,
      reviews,
    }
  } catch (err) {
    console.error("getUserReviews error:", err)
    return null
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
