import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import auth from "@react-native-firebase/auth";

export type RequestItem = {
  id: string;
  clientId: string;
  professionalId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: any;
};

export async function getRequestsForUser(userId: string) {
  console.log("📌 [getRequestsForUser] Buscando solicitações para:", userId);

  const userRef = doc(FIRESTORE_DB, "Users", userId);
  const snap = await getDoc(userRef);
  const userData = snap.data();

  console.log("📄 [getRequestsForUser] DOCUMENTO DO USER:", userData);

  if (!userData) return [];

  const sent = (userData.requests ?? []).map((req: any) => ({
    ...req,
    direction: "sent",
  }));

  const received = (userData.receivedRequests ?? []).map((req: any) => ({
    ...req,
    direction: "received",
  }));

  console.log("➡️ [getRequestsForUser] ENVIADAS:", sent);
  console.log("⬅️ [getRequestsForUser] RECEBIDAS:", received);

  return [...sent, ...received];
}

/**
 * Atualiza a solicitação para ACEITA
 */
export async function acceptRequest(patientId: string, caregiverId: string) {
  return updateStatus(patientId, caregiverId, "aceita");
}

/**
 * Atualiza a solicitação para RECUSADA
 */
export async function declineRequest(patientId: string, caregiverId: string) {
  return updateStatus(patientId, caregiverId, "recusada");
}

/**
 * Função reutilizável que realmente faz o trabalho
 */
export async function updateStatus(
  patientId: string,
  caregiverId: string,
  newStatus: "aceita" | "recusada"
) {
  console.log("🔄 [updateStatus] Iniciando atualização...");
  console.log("👤 Paciente:", patientId);
  console.log("🧑‍⚕️ Cuidador:", caregiverId);
  console.log("📌 Novo status:", newStatus);

  try {
    const patientRef = doc(FIRESTORE_DB, "Users", patientId);
    const caregiverRef = doc(FIRESTORE_DB, "Users", caregiverId);

    // buscar paciente
    const patientSnap = await getDoc(patientRef);
    const patientData = patientSnap.data();

    // buscar cuidador
    const caregiverSnap = await getDoc(caregiverRef);
    const caregiverData = caregiverSnap.data();

    console.log("📄 [updateStatus] Dados do paciente:", patientSnap.data());
    console.log("📄 [updateStatus] Dados do cuidador:", caregiverSnap.data());

    // === UPDATE lado do paciente ===
    const updatedPatientRequests = (patientData?.requests ?? []).map((req: any) => {
      if (req.caregiverId === caregiverId) {
        console.log("📝 [updateStatus] Atualizando no paciente:", req);
        return { ...req, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return req;
    });

    console.log("📦 [updateStatus] Novo array do paciente:", updatedPatientRequests);

    await updateDoc(patientRef, {
      requests: updatedPatientRequests,
      updatedAt: serverTimestamp(),
    });

    // === UPDATE lado do cuidador ===
    const updatedReceived = (caregiverData?.receivedRequests ?? []).map((req: any) => {
      if (req.patientId === patientId) {
        console.log("📝 [updateStatus] Atualizando no cuidador:", req);
        return { ...req, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return req;
    });

    console.log("📦 [updateStatus] Novo array do cuidador:", updatedReceived);

    await updateDoc(caregiverRef, {
      receivedRequests: updatedReceived,
      updatedAt: serverTimestamp(),
    });

    console.log("✅ [updateStatus] Atualização concluída.");

    return { ok: true };

  } catch (error) {
    console.error("updateStatus error:", error);
    return { ok: false, error };
  }
}