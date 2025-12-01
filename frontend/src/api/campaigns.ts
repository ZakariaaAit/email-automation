import axios from "axios";
import type { Campaign, CampaignEmail, CreateCampaignPayload } from "./types";


const API = "http://localhost:4000/api";

export async function getCampaigns(): Promise<Campaign[]> {
  const res = await axios.get(`${API}/campaigns`);
  return res.data;
}

export async function createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
  const res = await axios.post(`${API}/campaigns`, payload);
  return res.data;
}

export async function runCampaign(id: string) {
  return axios.post(`${API}/campaigns/${id}/run`);
}

export async function runScheduler() {
  return axios.post(`${API}/scheduler/run`);
}

export async function updateCampaignStatus(id: string, action: "pause" | "resume" | "cancel") {
  return axios.patch(`${API}/campaigns/${id}/status`, { action });
}

export async function getCampaignEmails(id: string): Promise<CampaignEmail[]> {
  const res = await axios.get(`${API}/campaigns/${id}/emails`);
  return res.data;
}
