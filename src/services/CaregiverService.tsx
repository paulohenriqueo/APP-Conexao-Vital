// caregiverService.tsx
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { getDoc } from "firebase/firestore";
import { 
  collection, 
  getDocs, 
} from "firebase/firestore";




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

/**
 * Atualiza o status de uma solicitação feita para o cuidador.
 * (Versão correta — não duplicada)
 */
export async function updatePatientRequestStatus(
  patientId: string,
  caregiverId: string,
  newStatus: "aceito" | "recusado"
) {
  try {
    const ref = doc(FIRESTORE_DB, "Users", patientId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return { ok: false, error: new Error("Paciente não encontrado") };
    }

    const data = snap.data();
    const requests = Array.isArray(data?.requests) ? data.requests : [];

    // Atualiza somente a solicitação deste cuidador
    const updatedRequests = requests.map((req: any) => {
      if (req.caregiverId === caregiverId) {
        return {
          ...req,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return req;
    });

    await updateDoc(ref, {
      requests: updatedRequests,
      updatedAt: serverTimestamp(),
    });

    return { ok: true };
  } catch (error) {
    console.error("updatePatientRequestStatus error:", error);
    return { ok: false, error };
  }
}

/**
 * Busca todas as solicitações pendentes recebidas pelo cuidador atual.
 */
export async function getPendingRequestsForCaregiver() {
  const caregiverId = FIREBASE_AUTH?.currentUser?.uid;

  if (!caregiverId) return { ok: false, error: "Usuário não autenticado" };

  try {
    const usersRef = collection(FIRESTORE_DB, "Users");
    const snapshot = await getDocs(usersRef);

    const pendingList: any[] = [];

    snapshot.forEach((docSnap: any) => {
      const data = docSnap.data();

      if (!data.requests || !Array.isArray(data.requests)) return;

      data.requests.forEach((req: any) => {
        if (req.caregiverId === caregiverId && req.status === "pendente") {
          pendingList.push({
            patientId: docSnap.id,
            patientName: data.patientProfile?.name ?? "Paciente",
            patientPhoto: data.patientProfile?.photoUrl ?? null,
            requestStatus: req.status,
            createdAt: req.createdAt,
            caregiverId: req.caregiverId
          });
        }
      });
    });

    return { ok: true, data: pendingList };
  } catch (error) {
    console.error("getPendingRequestsForCaregiver error:", error);
    return { ok: false, error };
  }
}

