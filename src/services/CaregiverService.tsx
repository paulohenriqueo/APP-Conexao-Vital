// caregiverService.tsx
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";

export type CaregiverFormPayload = {
  cpf?: string;
  birthDate?: string;
  phone?: string;
  gender?: string;
  cep?: string;
  street?: string;
  city?: string;
  state?: string;
  photoUrl?: string;
};

export type CaregiverSpecificationsPayload = {
  experiencias?: string[];
  qualificacoes?: string[];
  dispoDia?: string[];
  dispoPeriodo?: string[];
  publicoAtendido?: string[];
  observacoes?: string;
};

function getUid(providedUid?: string) {
  return providedUid ?? FIREBASE_AUTH?.currentUser?.uid ?? null;
}

/**
 * Salva ou atualiza os dados do formulário do cuidador
 */
export async function saveCaregiverForm(data: CaregiverFormPayload, uid?: string) {
  const userId = getUid(uid);
  if (!userId) return { ok: false, error: new Error("Usuário não autenticado (uid faltando)") };

  try {
    const ref = doc(FIRESTORE_DB, "Users", userId);
    await setDoc(
      ref,
      {
        caregiverProfile: data,
        profileCompleted: true,
        profileType: "caregiver", // grava tipo ao finalizar formulário
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { ok: true };
  } catch (error) {
    console.error("saveCaregiverForm error:", error);
    return { ok: false, error };
  }
}

/**
 * Salva/atualiza as especificações do cuidador
 */
export async function saveCaregiverSpecifications(specifications: CaregiverSpecificationsPayload, uid?: string) {
  const userId = getUid(uid);
  if (!userId) return { ok: false, error: new Error("Usuário não autenticado (uid faltando)") };

  try {
    const ref = doc(FIRESTORE_DB, "Users", userId);
    await setDoc(
      ref,
      {
        caregiverSpecifications: specifications,
        specificationsUpdatedAt: serverTimestamp(),
        profileType: "caregiver", // garante tipo ao salvar especificações
      },
      { merge: true }
    );
    return { ok: true };
  } catch (error) {
    console.error("saveCaregiverSpecifications error:", error);
    return { ok: false, error };
  }
}

/**
 * Atualiza campos arbitrários do usuário
 */
export async function updateUserFields(fields: Record<string, any>, uid?: string) {
  const userId = getUid(uid);
  if (!userId) return { ok: false, error: new Error("Usuário não autenticado (uid faltando)") };

  try {
    const ref = doc(FIRESTORE_DB, "Users", userId);
    await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() });
    return { ok: true };
  } catch (error) {
    console.error("updateUserFields error:", error);
    return { ok: false, error };
  }
}