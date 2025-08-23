import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const getAvailableCampaigns = (token) =>
  axios.get(`${API}/mentor/available-campaigns`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const assignMentorToCampaign = (campaignId, token) =>
  axios.post(`${API}/mentor/assign/${campaignId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAssignedCampaigns = (token) =>
  axios.get(`${API}/mentor/my-campaigns`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getSessions = (token) =>
  axios.get(`${API}/mentor/sessions`, {
    headers: { Authorization: `Bearer ${token}` },
  });