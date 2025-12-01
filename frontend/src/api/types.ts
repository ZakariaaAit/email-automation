export type ScheduleType = 'DAILY' | 'WEEKLY';

export interface AiAgent {
  id: string;
  name: string;
  model: string;
  systemPrompt: string;
}

export interface Campaign {
  id: string;
  name: string;
  scheduleType: ScheduleType;
  dailyEmailsPerDay?: number;
  weeklyEmailsPerDay?: number;
  weeklyDays?: string[];

  durationDays: number;
  startDateUtc: string;
  timeZone: string;

  aiAgentId: string;
  leadIds: string[];

  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CANCELED' | 'COMPLETED';

  createdAt: string;
  updatedAt: string;
}

export interface CampaignEmail {
  id: string;
  campaignId: string;
  leadId: string;
  scheduledSlotKey: string;
  subject: string;
  bodyHtml: string;
  status: string;
  createdAt: string;
}

export interface CreateCampaignPayload {
  name: string;
  scheduleType: ScheduleType;

  dailyEmailsPerDay: number;
  weeklyEmailsPerDay: number;
  weeklyDays: string[];

  durationDays: number;
  startDateUtc: string;
  timeZone: string;
  aiAgentId: string;
  leadIds: string[];
}
