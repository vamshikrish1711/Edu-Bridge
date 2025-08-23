import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const getUnapprovedNGOs = (token) =>
  axios.get(`${API}/admin/unapproved-ngos`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const approveNGO = (ngoId, token) =>
  axios.post(`${API}/admin/approve-ngo/${ngoId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUnapprovedMentors = (token) =>
  axios.get(`${API}/admin/unapproved-mentors`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const approveMentor = (mentorId, token) =>
  axios.post(`${API}/admin/approve-mentor/${mentorId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAllUsers = (token) =>
  axios.get(`${API}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAnalytics = (token) =>
  axios.get(`${API}/admin/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });