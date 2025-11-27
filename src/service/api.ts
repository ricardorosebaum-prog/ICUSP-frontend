import { buildApiUrl } from "@/config";

export async function apiPost(url: string, data: unknown) {
  const res = await fetch(buildApiUrl(url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));

    console.log("Erro backend:", err);

    throw new Error(err.message || "Erro na requisição");
  }

  return res.json();
}

export async function apiPostToken(url: string, data: unknown) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(buildApiUrl(url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro na requisição");
  }

  return res.json();
}

export async function apiGet(url: string) {

  const res = await fetch(buildApiUrl(url), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro na requisição");
  }

  return res.json();
}

export async function apiGetToken(url: string, data?: unknown) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(buildApiUrl(url), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro na requisição");
  }

  return res.json();
}

export async function apiDeleteToken(url: string) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(buildApiUrl(url), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro na requisição");
  }

  return res.json();
}

export async function apiPatchToken(url: string, data: unknown) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(buildApiUrl(url), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Erro na requisição");
  }

  return res.json();
}