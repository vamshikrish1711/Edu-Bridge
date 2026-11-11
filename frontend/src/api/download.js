// frontend/src/api/download.js
import api from "./client";

export async function downloadReceipt(id, receiptNo) {
  const response = await api.get(`/donations/${id}/receipt`, {
    responseType: "blob",
  });
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${receiptNo || "receipt"}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
