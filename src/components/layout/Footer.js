import { Box, Grid, Divider, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#3b4f6b",
        color: "#ffffff",
        mt: 20,
        pt: 5,
      }}
    >
      <Grid
        container
        spacing={4}
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: 3,
        }}
      >
        {/* CLINIC INFO */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Agastya Clinic
          </Typography>
          <Typography sx={{ color: "gray" }}>
            Integrated healthcare for your wellness
          </Typography>
        </Grid>

        {/* QUICK LINKS */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Quick Links
          </Typography>
          <Typography sx={{ color: "gray" }}>Services</Typography>
          <Typography sx={{ color: "gray" }}>Doctor Profile</Typography>
        </Grid>

        {/* HOURS */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Hours
          </Typography>
          <Typography sx={{ color: "gray" }}>
            Mon - Sat: 6 PM - 10 PM
          </Typography>
          <Typography sx={{ color: "gray" }}>
            Sunday: Closed
          </Typography>
        </Grid>

        {/* EMERGENCY */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Emergency
          </Typography>
          <Typography sx={{ color: "gray" }}>
            Available round the clock for urgent medical needs
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, borderColor: "#374151" }} />

      {/* COPYRIGHT */}
      <Typography
        align="center"
        sx={{
          pb: 3,
          fontSize: "0.9rem",
          color: "gray",
        }}
      >
        © 2025 Agastya Clinic. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
