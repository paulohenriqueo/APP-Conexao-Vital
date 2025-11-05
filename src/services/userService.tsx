import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";

export type PublicProfile = {
  id: string;
  name: string;
  rating?: number;
  tags?: string[];
  imageUrl?: string | null;
  especialization?: string;
  profileType?: string;
};

export async function getCurrentUserType(): Promise<string | null> {
  try {
    const uid = FIREBASE_AUTH?.currentUser?.uid;
    if (!uid) return null;
    const ref = doc(FIRESTORE_DB, "Users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    // ajuste aqui conforme o campo real no documento (profileType / type / role)
    return data?.profileType ?? data?.type ?? data?.role ?? null;
  } catch (err) {
    console.error("getCurrentUserType error:", err);
    return null;
  }
}

/**
 * Busca todos os perfis do tipo informado (ex: "patient" ou "caregiver").
 * Retorna um array simplificado compatível com o CustomList esperado.
 */
export async function getProfilesByType(type: string): Promise<PublicProfile[]> {
  try {
    const col = collection(FIRESTORE_DB, "Users");
    const q = query(col, where("profileType", "==", type));
    const snaps = await getDocs(q);
    // tipagem explícita para evitar 'implicitly has any' (alternativa: usar QueryDocumentSnapshot<DocumentData>)
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
        imageUrl: data?.photoUrl ?? data?.avatar ?? null,
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