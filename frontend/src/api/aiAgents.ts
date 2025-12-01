import axios from "axios";
import type { AiAgent } from "./types";

const API = "http://localhost:4000/api";

export async function getAiAgents(): Promise<AiAgent[]> {
  const res = await axios.get(`${API}/ai-agents`);
  return res.data;
}
