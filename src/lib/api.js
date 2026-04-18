const API_BASE = "/api";

function authHeaders(token) {
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

async function request(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  // ─── Auth ────────────────────────────────────────────────────
  register: (name, email, password) =>
    request(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    request(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),

  verifyEmail: (token) =>
    request(`${API_BASE}/auth/verify-email?token=${encodeURIComponent(token)}`),

  getMe: (token) =>
    request(`${API_BASE}/auth/me`, { headers: authHeaders(token) }),

  // ─── Elections ───────────────────────────────────────────────
  getElections: (token) =>
    request(`${API_BASE}/elections/`, { headers: authHeaders(token) }),

  getActiveElections: (token) =>
    request(`${API_BASE}/elections/active`, { headers: authHeaders(token) }),

  getElection: (electionId, token) =>
    request(`${API_BASE}/elections/${electionId}`, { headers: authHeaders(token) }),

  createElection: (data, token) =>
    request(`${API_BASE}/elections/`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    }),

  deleteElection: (electionId, token) =>
    request(`${API_BASE}/elections/${electionId}`, {
      method: "DELETE",
      headers: authHeaders(token),
    }),

  deactivateElection: (electionId, token) =>
    request(`${API_BASE}/elections/${electionId}/deactivate`, {
      method: "PUT",
      headers: authHeaders(token),
    }),

  // ─── Candidates ──────────────────────────────────────────────
  getCandidates: (electionId, token) =>
    request(`${API_BASE}/elections/${electionId}/candidates`, {
      headers: authHeaders(token),
    }),

  addCandidate: (electionId, data, token) =>
    request(`${API_BASE}/elections/${electionId}/candidates`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    }),

  deleteCandidate: (electionId, candidateId, token) =>
    request(`${API_BASE}/elections/${electionId}/candidates/${candidateId}`, {
      method: "DELETE",
      headers: authHeaders(token),
    }),

  // ─── Votes ───────────────────────────────────────────────────
  castVote: (electionId, candidateId, token) =>
    request(`${API_BASE}/votes/${electionId}`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ candidate_id: candidateId }),
    }),

  getResults: (electionId, token) =>
    request(`${API_BASE}/votes/${electionId}/results`, {
      headers: authHeaders(token),
    }),

  getMyVote: (electionId, token) =>
    request(`${API_BASE}/votes/${electionId}/my-vote`, {
      headers: authHeaders(token),
    }),

  // ─── Admin ───────────────────────────────────────────────────
  getAllUsers: (token) =>
    request(`${API_BASE}/admin/users`, { headers: authHeaders(token) }),

  makeAdmin: (userId, token) =>
    request(`${API_BASE}/admin/users/${userId}/make-admin`, {
      method: "PUT",
      headers: authHeaders(token),
    }),

  toggleUserActive: (userId, token) =>
    request(`${API_BASE}/admin/users/${userId}/toggle-active`, {
      method: "PUT",
      headers: authHeaders(token),
    }),
};