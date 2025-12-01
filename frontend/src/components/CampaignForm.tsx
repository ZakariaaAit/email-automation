import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";

import { getAiAgents } from "../api/aiAgents";
import { createCampaign, runScheduler } from "../api/campaigns";
import type { AiAgent, CreateCampaignPayload, ScheduleType } from "../api/types";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface Props {
  onCreated: () => void;
}

const CampaignForm: React.FC<Props> = ({ onCreated }) => {
  const [aiAgents, setAiAgents] = useState<AiAgent[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const [form, setForm] = useState<CreateCampaignPayload>({
    name: "",
    scheduleType: "DAILY",
    dailyEmailsPerDay: 2,
    weeklyEmailsPerDay: 5,
    weeklyDays: ["MON"],
    durationDays: 30,
    startDateUtc: new Date().toISOString().slice(0, 10),
    timeZone: "UTC",
    aiAgentId: "",
    leadIds: ["lead_1", "lead_2"],
  });

  useEffect(() => {
    getAiAgents().then((agents) => {
      setAiAgents(agents);
      if (agents.length) {
        setForm((f) => ({ ...f, aiAgentId: agents[0].id }));
      }
    });
  }, []);

  function update<K extends keyof CreateCampaignPayload>(key: K, value: CreateCampaignPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);

    try {
      await createCampaign(form);
      onCreated();
    }  // eslint-disable-next-line
    catch (err: any ) {
      const list = err.response?.data?.errors ?? ["Unexpected error"];
      setErrors(list);
    }
  }

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Create Campaign
      </Typography>

      <Box
        component="form"
        onSubmit={submit}
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        }}
      >
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />

        <FormControl>
          <InputLabel>Schedule Type</InputLabel>
          <Select
            label="Schedule Type"
            value={form.scheduleType}
            onChange={(e) => update("scheduleType", e.target.value as ScheduleType)}
          >
            <MenuItem value="DAILY">Daily</MenuItem>
            <MenuItem value="WEEKLY">Weekly</MenuItem>
          </Select>
        </FormControl>

        {form.scheduleType === "DAILY" && (
          <TextField
            type="number"
            label="Daily emails per day"
            value={form.dailyEmailsPerDay}
            onChange={(e) => update("dailyEmailsPerDay", Number(e.target.value))}
          />
        )}

        {form.scheduleType === "WEEKLY" && (
          <>
            <FormControl>
              <InputLabel>Weekly Days</InputLabel>
              <Select
                multiple
                value={form.weeklyDays}
                onChange={(e) => update("weeklyDays", e.target.value as string[])}
                input={<OutlinedInput />}
                renderValue={(v) => (v as string[]).join(", ")}
              >
                {WEEKDAYS.map((day) => (
                  <MenuItem key={day} value={day}>
                    <Checkbox checked={form.weeklyDays.includes(day)} />
                    <ListItemText primary={day} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="number"
              label="Weekly emails per day"
              value={form.weeklyEmailsPerDay}
              onChange={(e) => update("weeklyEmailsPerDay", Number(e.target.value))}
            />
          </>
        )}

        <TextField
          type="number"
          label="Duration (days)"
          value={form.durationDays}
          onChange={(e) => update("durationDays", Number(e.target.value))}
        />

        <TextField
          label="Start Date (UTC ISO)"
          value={form.startDateUtc}
          onChange={(e) => update("startDateUtc", e.target.value)}
        />

        <TextField
          label="Time Zone"
          value={form.timeZone}
          onChange={(e) => update("timeZone", e.target.value)}
        />

        <FormControl>
          <InputLabel>AI Agent</InputLabel>
          <Select
            value={form.aiAgentId}
            label="AI Agent"
            onChange={(e) => update("aiAgentId", e.target.value as string)}
          >
            {aiAgents.map((agent) => (
              <MenuItem key={agent.id} value={agent.id}>
                {agent.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ gridColumn: "span 2", display: "flex", justifyContent: "space-between" }}>
          <Button type="submit" variant="contained">
            Create
          </Button>

          <Button onClick={runScheduler} variant="outlined">
            Run Scheduler
          </Button>
        </Box>
      </Box>

      {errors.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {errors.map((e, i) => (
            <Typography key={i} color="error">
              • {e}
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default CampaignForm;
