import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import { formatDate } from "../utils/date";
import { runCampaign, updateCampaignStatus } from "../api/campaigns";
import type { Campaign } from "../api/types";

interface Props {
  campaigns: Campaign[];
  onViewEmails: (c: Campaign) => void;
  refresh: () => void;
}

const CampaignList: React.FC<Props> = ({ campaigns, onViewEmails, refresh }) => {
  async function handleAction(id: string, action: "pause" | "resume" | "cancel") {
    await updateCampaignStatus(id, action);
    refresh();
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Campaigns
      </Typography>

      {campaigns.length === 0 ? (
        <Typography>No campaigns yet.</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {campaigns.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>
                  {c.scheduleType === "DAILY"
                    ? `Daily (${c.dailyEmailsPerDay})`
                    : `Weekly (${c.weeklyEmailsPerDay} on ${c.weeklyDays?.join(", ")})`}
                </TableCell>

                <TableCell>
                  <Chip
                    label={c.status}
                    color={
                      c.status === "ACTIVE"
                        ? "success"
                        : c.status === "PAUSED"
                        ? "warning"
                        : c.status === "CANCELED"
                        ? "error"
                        : "default"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell>{formatDate(c.createdAt, c.timeZone)}</TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => onViewEmails(c)}>
                      Emails
                    </Button>

                    <Button size="small" onClick={() => runCampaign(c.id)}>
                      Run
                    </Button>

                    {c.status === "ACTIVE" && (
                      <Button size="small" onClick={() => handleAction(c.id, "pause")}>
                        Pause
                      </Button>
                    )}

                    {c.status === "PAUSED" && (
                      <Button size="small" onClick={() => handleAction(c.id, "resume")}>
                        Resume
                      </Button>
                    )}

                    {c.status !== "CANCELED" && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleAction(c.id, "cancel")}
                      >
                        Cancel
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

export default CampaignList;
