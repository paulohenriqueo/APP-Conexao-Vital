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

// nova função: busca por tipo + filtra por nome (client-side)
export async function searchProfilesByName(
  type: string,
  nameQuery: string,
  filters?: { city?: string; state?: string; period?: string; languages?: string[] }
): Promise<PublicProfile[]> {
  const normalize = (s: any) =>
    String(s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  try {
    const col = collection(FIRESTORE_DB, "Users");
    const q = query(col, where("profileType", "==", type));
    const snaps = await getDocs(q);
    const term = normalize(nameQuery);

    const list: PublicProfile[] = snaps.docs
      .map((d: any) => {
        const data: any = d.data();
        const name =
          data?.patientProfile?.nome ||
          data?.caregiverProfile?.nome ||
          data?.displayName ||
          data?.name ||
          "";

        // tenta extrair cidade/estado por vários caminhos possíveis no documento
        const profileCity =
          data?.patientProfile?.city ||
          data?.caregiverProfile?.city ||
          "";

        const profileState =
          data?.patientProfile?.state ||
          data?.caregiverProfile?.state ||
          "";

        const profilePeriod =
          data?.condition?.periodos ||
          data?.caregiverSpecifications?.periodOptions||
          "";

        let profileLanguages: string[] = [];
        if (Array.isArray(data?.condition?.idiomasPreferidos)) {
          profileLanguages = data.condition.idiomasPreferidos;
        } else if (typeof data?.condition?.idiomasPreferidos === "string") {
            profileLanguages = data.condition.idiomasPreferidos
            .split(",")
            .map((x: string) => x.trim());
        }
        if (Array.isArray(data?.caregiverSpecifications?.idiomasPreferidos)) {
          profileLanguages = data.caregiverSpecifications.idiomasPreferidos;
        } else if (typeof data?.caregiverSpecifications?.idiomasPreferidos === "string") {
            profileLanguages = data.caregiverSpecifications.idiomasPreferidos
            .split(",")
            .map((x: string) => x.trim());
        }
        return {
          id: d.id,
          name,
          rating: data?.rating ?? 0,
          tags: data?.tags ?? data?.especializacoes ?? [],
          imageUrl: data?.photoUrl ?? data?.avatar ?? null,
          especialization: data?.especialization ?? data?.especializacoes?.[0] ?? type,
          profileType: data?.profileType ?? null,
          // meta para filtragem
          // @ts-ignore
          _meta: {
            city: profileCity,
            state: profileState,
            period: profilePeriod,
            languages: profileLanguages,
          },
        } as PublicProfile;
      })
      .filter((p: PublicProfile) => {
        const meta: any = (p as any)._meta || {};

        // nome (se termo vazio -> sempre true)
        const nameOk = normalize(p.name).includes(term);
        if (!nameOk) return false;

        if (!filters) return true;

        // cidade
        if (filters.city && filters.city.trim() !== "") {
          const cityMatch =
          meta.city && normalize(meta.city).includes(normalize(filters.city));
          if (!cityMatch) return false;
        }

        // estado
        if (filters.state && filters.state.trim() !== "") {
          const metaState = normalize(meta.state);
          const want = normalize(filters.state);
          const stateMatch =
          want.length <= 2 ? metaState === want : metaState.includes(want);
          if (!stateMatch) return false;
        }

        // período (string ou array)
        if (filters.period && filters.period.trim() !== "") {
          const metaPeriod = Array.isArray(meta.period)
          ? meta.period.join(" ")
          : String(meta.period || "");
          const periodMatch = normalize(metaPeriod).includes(normalize(filters.period));
          if (!periodMatch) return false;
        }

        // idiomas
        if (filters.languages && filters.languages.length > 0) {
          const profileLangs: string[] = (meta.languages || []).map((l: any) =>
          normalize(l)
        );
        const required: string[] = filters.languages.map((l) => normalize(l));

        // verifica se pelo menos um idioma filtrado bate com os idiomas do perfil
        const anyMatch = required.some((r) =>
        profileLangs.some((pl: string) => pl.includes(r))
      );

      if (!anyMatch) return false;
  }

  return true;
});

    // debug: quando não encontra nada, logar alguns metadados para inspeção
    if (list.length === 0) {
      console.debug("[searchProfilesByName] nenhum resultado — amostra de documentos (3):");
      snaps.docs.slice(0, 3).forEach((d: any) => {
        const data = d.data();
        console.debug("docId:", d.id, {
          patientProfile: data?.patientProfile,
          caregiverProfile: data?.caregiverProfile,
          neighborhood: data?.neighborhood,
          street: data?.street,
          city: data?.city,
          state: data?.state,
          idiomas: data?.idiomas,
          languages: data?.languages,
          availability: data?.availability,
        });
      });
    }

    return list;
  } catch (err) {
    console.error("searchProfilesByName error:", err);
    return [];
  }
}