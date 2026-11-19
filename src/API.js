export const TOKEN_KEY = "airbnbToken";

const RAW_API_URL = process.env.REACT_APP_API_URL || "";

export const API_BASE = RAW_API_URL.replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const getToken = () => {
  try {
    return window.localStorage.getItem(TOKEN_KEY) || null;
  } catch (error) {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {}
};

const request = async (path, { method = "GET", body, isForm = false } = {}) => {
  const headers = {};
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (!isForm && body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(`${API_BASE}/api${path}`, {
      method,
      headers,
      body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new ApiError("Cannot reach the server. Is the backend running?", 0);
  }

  const text = await response.text();
  let payload = null;
  let parseFailed = false;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (error) {
      parseFailed = true;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      payload?.error || "Something went wrong",
      response.status,
    );
  }

  if (parseFailed || payload === null) {
    throw new ApiError(
      response.status === 200
        ? "Received a non-JSON response from the server. Set REACT_APP_API_URL to your API origin, or exempt /api from the Netlify redirect rule."
        : "Empty response from server",
      response.status,
    );
  }

  return payload;
};

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
  upload: (path, formData, method = "POST") =>
    request(path, { method, body: formData, isForm: true }),
};

export const imageUrl = (value) => {
  if (!value) return "";
  if (/^(https?:)?\/\//.test(value) || value.startsWith("data:")) {
    return value;
  }
  return `${API_BASE}/uploads/${value}`;
};