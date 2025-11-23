import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { arrayUnion } from "firebase/firestore";
import { getDoc } from "firebase/firestore";

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
        profileType: "patient", // grava tipo ao finalizar formulário
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
        profileType: "patient", // garante tipo ao salvar condições também
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

// ===============================================
// 3) SALVAR SOLICITAÇÃO NO HISTÓRICO DO PACIENTE
// ===============================================

export async function savePatientContactRequest(caregiverId: string, caregiverName: string) {
  const patientId = FIREBASE_AUTH.currentUser?.uid;

  console.log("🟦 [savePatientContactRequest] Iniciando...");
  console.log("👤 Paciente:", patientId);
  console.log("🧑‍⚕️ Cuidador:", caregiverId, caregiverName);

  if (!patientId) {
    console.error("❌ [savePatientContactRequest] Usuário não autenticado");
    return { ok: false, error: new Error("Usuário não autenticado") };
  }

  try {
    const patientRef = doc(FIRESTORE_DB, "Users", patientId);

    const newRequest = {
      caregiverId,
      caregiverName,
      status: "pendente",
      createdAt: new Date().toISOString(), // ✔ permitido
    };

    console.log("📝 [savePatientContactRequest] Salvando no paciente:", newRequest);

    // 1) Salvar no paciente
    await updateDoc(patientRef, {
      requests: arrayUnion(newRequest),
      updatedAt: serverTimestamp(), // ✔ permitido pois NÃO está no array
    });

    // 2) Buscar nome do paciente
    const patientSnap = await getDoc(patientRef);
    const patientName = patientSnap.data()?.name ?? "Paciente";

    console.log("📄 [savePatientContactRequest] Nome do paciente:", patientName);

    // 3) Salvar no cuidador
    const caregiverRef = doc(FIRESTORE_DB, "Users", caregiverId);

    const receivedEntry = {
      patientId,
      patientName,
      status: "pendente",
      createdAt: new Date().toISOString(), // ✔ permitido
    };

    console.log("📥 [savePatientContactRequest] Salvando no cuidador:", receivedEntry);

    await updateDoc(caregiverRef, {
      receivedRequests: arrayUnion(receivedEntry),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ [savePatientContactRequest] FINALIZADO com sucesso.");

    return { ok: true };
  } catch (error) {
    console.error("savePatientContactRequest error:", error);
    return { ok: false, error };
  }
}


// =======================================================
// 4) SALVAR HISTÓRICO DE SOLICITAÇÕES NO DOCUMENTO DO CUIDADOR
// =======================================================

export async function saveCaregiverReceivedRequest(
  caregiverId: string,
  patientId: string,
  patientName: string
) {
  try {
    const caregiverRef = doc(FIRESTORE_DB, "Users", caregiverId);

    const newEntry = {
      patientId,
      patientName,
      status: "pendente",
      createdAt: serverTimestamp(),
    };

    await updateDoc(caregiverRef, {
      receivedRequests: arrayUnion(newEntry),
      updatedAt: serverTimestamp(),
    });

    return { ok: true };
  } catch (error) {
    console.error("saveCaregiverReceivedRequest error:", error);
    return { ok: false, error };
  }
}
