import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const getAllCampaigns = () => axios.get(`${API}/public/campaigns`);

export const donateToCampaign = (campaignId, data, token) =>
  axios.post(`${API}/donor/donate/${campaignId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getDonationHistory = (token) =>
  axios.get(`${API}/donor/donations`, {
    headers: { Authorization: `Bearer ${token}` },
  });