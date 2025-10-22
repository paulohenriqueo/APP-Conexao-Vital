import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";

export type PatientFormPayload = {
  cpf?: string;
  birthDate?: string;
  phone?: string;
  gender?: string;
  cep?: string;
  street?: string;
  city?: string;
  state?: string;
  photoUrl?: string;
  // adicione mais campos conforme necessário
};

export type PatientConditionPayload = {
  cuidadoTotal?: boolean;
  periodos?: string[]; // ex: ['matutino','noturno']
  inicioPeriodo?: string;
  observacoes?: string;
  alergias?: string[];
  medicamentos?: string[];
  condicoes?: string[];
  idiomasPreferidos?: string[];
};

function getUid(providedUid?: string) {
  return providedUid ?? FIREBASE_AUTH?.currentUser?.uid ?? null;
}

/**
 * Salva ou atualiza os dados do formulário do paciente no documento do usuário.
 * Usa setDoc(..., { merge: true }) para não sobrescrever outros campos do usuário.
 */
export async function savePatientForm(data: PatientFormPayload, uid?: string) {
  const userId = getUid(uid);
  if (!userId) return { ok: false, error: new Error("Usuário não autenticado (uid faltando)") };

  try {
    const ref = doc(FIRESTORE_DB, "Users", userId);
    await setDoc(
      ref,
      {
        patientProfile: data,
        profileCompleted: true,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { ok: true };
  } catch (error) {
    console.error("savePatientForm error:", error);
    return { ok: false, error };
  }
}

/**
 * Salva/atualiza as informações de condição (cuidado) do paciente.
 * Grava em Users/{uid}.condition
 */
export async function savePatientCondition(condition: PatientConditionPayload, uid?: string) {
  const userId = getUid(uid);
  if (!userId) return { ok: false, error: new Error("Usuário não autenticado (uid faltando)") };

  try {
    const ref = doc(FIRESTORE_DB, "Users", userId);
    await setDoc(
      ref,
      {
        condition: condition,
        conditionUpdatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { ok: true };
  } catch (error) {
    console.error("savePatientCondition error:", error);
    return { ok: false, error };
  }
}

/**
 * Opcional: atualiza parcialmente o documento do usuário (campo arbitrary)
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