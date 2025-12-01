import React from "react";
import { Box, Container, Typography } from "@mui/material";

import CampaignForm from "./components/CampaignForm";
import CampaignList from "./components/CampaignList";
import CampaignEmailsDialog from "./components/CampaignEmailsDialog";

import { getCampaigns, getCampaignEmails } from "./api/campaigns";
import type { Campaign, CampaignEmail } from "./api/types";

function App() {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = React.useState<Campaign | null>(null);
  const [emails, setEmails] = React.useState<CampaignEmail[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  async function refresh() {
    const data = await getCampaigns();
    setCampaigns(data);
  }

  React.useEffect(() => {
    refresh();
  }, []);

  async function viewEmails(c: Campaign) {
    const items = await getCampaignEmails(c.id);
    setSelectedCampaign(c);
    setEmails(items);
    setDialogOpen(true);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
        m: 0,
        p: 0,

        background: `
          linear-gradient(135deg, rgba(66,133,244,0.35), rgba(234,67,53,0.35)),
          linear-gradient(45deg, rgba(251,188,5,0.35), rgba(52,168,83,0.35)),
          linear-gradient(180deg, #f6f9ff, #e9f0ff)
        `,
        backgroundBlendMode: "overlay, overlay, normal",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          py: 6,
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          fontWeight={900}
          sx={{
            background:
              "linear-gradient(90deg, #4285F4, #EA4335, #FBBC05, #34A853)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            letterSpacing: "1px",
            mb: 1,
          }}
        >
          Email Automation 
        </Typography>

        <Typography
          variant="h6"
          sx={{
            opacity: 0.9,
            maxWidth: "900px",
            margin: "0 auto",
            px: 2,
            color: "blue",
          }}
        >
         Create, schedule and automate email campaigns with AI-generated content, timezone-aware delivery, and smart lead targeting — all from a single, intuitive dashboard.
        </Typography>
      </Box>

      {/* Main Full-Width Content Area */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            width: "100%",
            backdropFilter: "blur(8px)",
            background: "rgba(255,255,255,0.7)",
            borderRadius: "20px",
            p: { xs: 2, md: 4 },
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <CampaignForm onCreated={refresh} />

          <CampaignList
            campaigns={campaigns}
            onViewEmails={viewEmails}
            refresh={refresh}
          />

          <CampaignEmailsDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            campaign={selectedCampaign}
            emails={emails}
          />
        </Container>
      </Box>
    </Box>
  );
}

export default App;