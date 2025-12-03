import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";

/**
 * Tipagem oficial usada no app inteiro
 */
export type RequestItem = {
  id: string;
  patientId: string;
  caregiverId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: any;
  patientName?: string;
  caregiverName?: string;
  imageUrl?: string;
  careCategory?: string;
};

/**
 * Retorna todas as solicitações REALMENTE salvas no documento do usuário.
 * Junta:
 * - requests (enviadas)
 * - receivedRequests (recebidas)
 */
export async function getRequestsForUser(userId: string) {
  console.log("📌 [getRequestsForUser] Buscando solicitações para:", userId);

  const userRef = doc(FIRESTORE_DB, "Users", userId);
  const snap = await getDoc(userRef);
  const userData = snap.data();

  if (!userData) {
    console.log("⚠️ [getRequestsForUser] Usuário sem dados.");
    return [];
  }

const normalize = (req: any, direction: "sent" | "received") => {
  return {
    ...req,
    direction,
    id: req.id,
    status: req.status ?? "pending",

    // se não tiver caregiverId, colocamos baseado no usuário logado
    caregiverId: req.caregiverId ?? (direction === "received" ? userId : req.caregiverId),

    // se não tiver patientId e for enviado, mantemos
    patientId: req.patientId ?? "",
  };
};


  const sent = (userData.requests ?? []).map((req: any) =>
    normalize(req, "sent")
  );

  const received = (userData.receivedRequests ?? []).map((req: any) =>
    normalize(req, "received")
  );

  console.log("➡️ ENVIADAS:", sent);
  console.log("⬅️ RECEBIDAS:", received);

  return [...sent, ...received];
}

/**
 * Atualiza status da solicitação entre paciente e cuidador.
 *
 * IMPORTANTE:
 * - patientId SEMPRE é o paciente
 * - caregiverId SEMPRE é o cuidador
 */
export async function updateStatus(
  patientId: string,
  caregiverId: string,
  newStatus: "accepted" | "declined"
) {
  console.log("🔄 [updateStatus] Iniciando atualização...");
  console.log("👤 patientId:", patientId);
  console.log("🧑‍⚕️ caregiverId:", caregiverId);
  console.log("📌 Novo status:", newStatus);

  try {
    const patientRef = doc(FIRESTORE_DB, "Users", patientId);
    const caregiverRef = doc(FIRESTORE_DB, "Users", caregiverId);

    // Buscar documentos
    const patientSnap = await getDoc(patientRef);
    const caregiverSnap = await getDoc(caregiverRef);

    const patientData = patientSnap.data();
    const caregiverData = caregiverSnap.data();

    if (!patientData || !caregiverData) {
      console.log("❌ [updateStatus] Usuário não encontrado.");
      return { ok: false };
    }

    // ======================================================
    //  UPDATE DO LADO DO PACIENTE
    // ======================================================
    const updatedPatientRequests = (patientData.requests ?? []).map((req: any) => {
      if (req.caregiverId === caregiverId) {
        return {
          ...req,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return req;
    });

    await updateDoc(patientRef, {
      requests: updatedPatientRequests,
      updatedAt: serverTimestamp(),
    });
    console.log("✅ [updateStatus] Lado do paciente atualizado: ", updateDoc);

    // ======================================================
    //  UPDATE DO LADO DO CUIDADOR
    // ======================================================
    const updatedCaregiverReceived = (caregiverData.receivedRequests ?? []).map(
      (req: any) => {
        if (req.patientId === patientId) {
          return {
            ...req,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return req;
      }
    );

    await updateDoc(caregiverRef, {
      receivedRequests: updatedCaregiverReceived,
      updatedAt: serverTimestamp(),
    });

    console.log("✅ [updateStatus] Atualização concluída.");
    return { ok: true };
  } catch (error) {
    console.error("❌ updateStatus error:", error);
    return { ok: false, error };
  }
}

/** Wrapper para aceitar solicitação */
export async function acceptRequest(patientId: string, caregiverId: string) {
  return updateStatus(patientId, caregiverId, "accepted");
}

/** Wrapper para recusar solicitação */
export async function declineRequest(patientId: string, caregiverId: string) {
  return updateStatus(patientId, caregiverId, "declined");
}
