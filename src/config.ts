// Centraliza a URL base da API. Permite sobrescrever via variável de ambiente VITE_API_BASE_URL.
export const API_BASE_URL = (
  (import.meta as any).env?.VITE_API_BASE_URL || "https://icuspbackend.onrender.com"
)
  .toString()
  .replace(/\/$/, "");

export function buildApiUrl(path: string) {
  if (!path) return API_BASE_URL;
  // Se já for uma URL absoluta, retorna direto
  if (/^https?:\/\//i.test(path)) return path;
  // Garante que não haja barras duplicadas
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
