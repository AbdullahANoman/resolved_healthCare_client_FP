"use client";

import { Box, Container, Grid, Card, CardContent, Avatar, Typography, Stack, Rating, Button } from "@mui/material";
import Image from "next/image";

const Testimonials = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "#f7f9fc" }}>
      <Container>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography component="p" fontSize={20} fontWeight={500} color="primary.main">
            What Patients Say
          </Typography>
          <Typography variant="h4" component="h2" fontWeight={700}>
            Trusted Care. Happy Patients.
          </Typography>
          <Typography component="p" fontSize={16} color="text.secondary" sx={{ mt: 1 }}>
            Compassionate service and expert doctors delivering great outcomes.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            {
              name: "Sarah Johnson",
              role: "Cardiology Patient",
              avatar: "/vercel.svg",
              quote:
                "The doctors were incredibly attentive and the entire process felt smooth and reassuring.",
              rating: 5,
            },
            {
              name: "Michael Chen",
              role: "General Care",
              avatar: "/next.svg",
              quote:
                "Booking an appointment was easy and I felt heard during my consultation.",
              rating: 4,
            },
            {
              name: "Emma Wilson",
              role: "Pediatrics",
              avatar: "/logo.png",
              quote:
                "Wonderful staff and modern facilities. Highly recommend for family healthcare!",
              rating: 5,
            },
          ].map((t, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar src={t.avatar} alt={t.name} sx={{ width: 50, height: 50 }} />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>{t.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{t.role}</Typography>
                    </Box>
                  </Stack>
                  <Rating value={t.rating} readOnly sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">{t.quote}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button variant="outlined">Read More Reviews</Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Testimonials;