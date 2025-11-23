import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";

/**
 * Atualiza a solicitação para ACEITA
 */
export async function acceptRequest(patientId: string, caregiverId: string) {
  return updateStatus(patientId, caregiverId, "aceito");
}

/**
 * Atualiza a solicitação para RECUSADA
 */
export async function declineRequest(patientId: string, caregiverId: string) {
  return updateStatus(patientId, caregiverId, "recusado");
}

/**
 * Função reutilizável que realmente faz o trabalho
 */
async function updateStatus(
  patientId: string, 
  caregiverId: string, 
  newStatus: "aceito" | "recusado"
) {
  try {
    const patientRef = doc(FIRESTORE_DB, "Users", patientId);
    const caregiverRef = doc(FIRESTORE_DB, "Users", caregiverId);

    // buscar paciente
    const patientSnap = await getDoc(patientRef);
    const patientData = patientSnap.data();

    // buscar cuidador
    const caregiverSnap = await getDoc(caregiverRef);
    const caregiverData = caregiverSnap.data();

    // === UPDATE lado do paciente ===
    const updatedPatientRequests = (patientData?.requests ?? []).map((req: any) => {
      if (req.caregiverId === caregiverId) {
        return { ...req, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return req;
    });

    await updateDoc(patientRef, {
      requests: updatedPatientRequests,
      updatedAt: serverTimestamp(),
    });

    // === UPDATE lado do cuidador ===
    const updatedReceived = (caregiverData?.receivedRequests ?? []).map((req: any) => {
      if (req.patientId === patientId) {
        return { ...req, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return req;
    });

    await updateDoc(caregiverRef, {
      receivedRequests: updatedReceived,
      updatedAt: serverTimestamp(),
    });

    return { ok: true };

  } catch (error) {
    console.error("updateStatus error:", error);
    return { ok: false, error };
  }
}
