import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const createCampaign = (data, token) =>
  axios.post(`${API}/ngo/create-campaign`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getMyCampaigns = (token) =>
  axios.get(`${API}/ngo/my-campaigns`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getDonationsReceived = (token) =>
  axios.get(`${API}/ngo/donations`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getNGOMentors = (token) =>
  axios.get(`${API}/ngo/mentors`, {
    headers: { Authorization: `Bearer ${token}` },
  });