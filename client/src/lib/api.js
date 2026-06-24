const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const getAuthToken = () => localStorage.getItem("tremoc_token");

export const apiFetch = (path, options = {}) => {
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(buildApiUrl(path), {
    ...options,
    headers,
  });
};

export const readJson = async (response) => {
  const text = await response.text();
  if (!text) return null;

  const contentType = response.headers.get("content-type") || "";

  try {
    return JSON.parse(text);
  } catch {
    const trimmed = text.trimStart();
    const isHtml = trimmed.startsWith("<") || trimmed.startsWith("<!");
    const serverHint = isHtml
      ? "Backend chưa chạy hoặc URL API không đúng. Hãy chạy TreMoc.exe / dotnet run rồi thử lại."
      : text.slice(0, 160);

    if (!contentType.includes("application/json") && isHtml) {
      throw new Error(serverHint);
    }

    throw new Error("Phản hồi từ máy chủ không hợp lệ. " + serverHint);
  }
};

// Upload files dạng multipart/form-data
export const uploadFiles = async (path, files) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }

  const token = getAuthToken();
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(buildApiUrl(path), {
    method: "POST",
    headers,
    body: formData,
  });
};
