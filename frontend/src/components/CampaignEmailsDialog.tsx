import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Typography,
} from "@mui/material";
import type { Campaign, CampaignEmail } from "../api/types";
import { formatDate } from "../utils/date";

interface Props {
  open: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  emails: CampaignEmail[];
}

const CampaignEmailsDialog: React.FC<Props> = ({ open, onClose, emails, campaign }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Emails {campaign ? `– ${campaign.name}` : ""}
      </DialogTitle>

      <DialogContent dividers>
        {emails.length === 0 ? (
          <Typography>No emails yet.</Typography>
        ) : (
          emails.map((e) => (
            <Paper key={e.id} sx={{ p: 2, mb: 2 }} variant="outlined">
              <Typography variant="caption">
                {formatDate(e.createdAt)} — Slot: {e.scheduledSlotKey}
              </Typography>

              <Typography variant="subtitle2">
                Subject: {e.subject}
              </Typography>

              <Typography
                variant="body2"
                sx={{ mt: 1 }}
                dangerouslySetInnerHTML={{ __html: e.bodyHtml }}
              />
            </Paper>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CampaignEmailsDialog;
