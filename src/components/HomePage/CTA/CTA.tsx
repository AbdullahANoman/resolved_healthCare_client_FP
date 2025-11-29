"use client";

import { Box, Container, Grid, Typography, Button, TextField, Paper } from "@mui/material";

const CTA = () => {
  return (
    <Box sx={{ py: 10, background: "linear-gradient(135deg, #1586FD 0%, #62d6ff 100%)" }}>
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" fontWeight={700} color="white">
              Book Your Appointment Today
            </Typography>
            <Typography component="p" fontSize={16} sx={{ mt: 2 }} color="white">
              Access expert physicians and modern facilities with quick scheduling.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" sx={{ bgcolor: "white", color: "primary.main", mr: 2 }}>
                Get Started
              </Button>
              <Button variant="outlined" sx={{ color: "white", borderColor: "white" }}>
                Contact Us
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Quick Appointment Form
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Name" size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone" size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Department" size="small" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Message" multiline rows={3} size="small" />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth>Submit</Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CTA;