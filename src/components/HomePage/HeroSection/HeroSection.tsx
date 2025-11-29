import { Box, Button, Container, Typography, Grid, Stack, Paper, TextField, InputAdornment, Chip } from "@mui/material";
import Image from "next/image";
import doctor1 from "@/assets/images/doctor1.png";
import doctor2 from "@/assets/images/doctor2.png";
import doctor3 from "@/assets/images/doctor3.png";
import stethoscope from "@/assets/images/Stetoscope.png";
import arrow from "@/assets/svgs/arrow.svg";
import grid from "@/assets/svgs/grid.svg";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const HeroSection = () => {
  return (
    <Box sx={{
      background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
      pt: { xs: 8, md: 12 },
      pb: { xs: 6, md: 10 },
      position: "relative"
    }}>
      <Container>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative" }}>
              <Box sx={{ position: "absolute", width: 420, left: -100, top: -120, opacity: 0.25 }}>
                <Image src={grid} alt="grid" />
              </Box>
              <Typography component="p" fontSize={18} fontWeight={600} color="primary.main" sx={{ mb: 1 }}>
                We care about your health
              </Typography>
              <Typography variant="h3" component="h1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                Expert Medical Care for Your Family
              </Typography>
              <Typography component="p" color="text.secondary" sx={{ mt: 2 }}>
                Access experienced doctors, modern facilities, and compassionate service with quick scheduling.
              </Typography>

              <Paper sx={{ mt: 3, p: 2, borderRadius: 3 }} elevation={0}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search specialties"
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Location"
                    InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon /></InputAdornment> }}
                  />
                  <Button sx={{ minWidth: 160 }}>Book Appointment</Button>
                </Stack>
              </Paper>

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Chip icon={<LocalHospitalIcon />} label="Certified Doctors" color="primary" variant="outlined" />
                <Chip label="24/7 Support" color="primary" variant="outlined" />
                <Chip label="Modern Facilities" color="primary" variant="outlined" />
              </Stack>

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button>Get Started</Button>
                <Button variant="outlined">Find a Doctor</Button>
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
              <Box sx={{ position: "absolute", left: { md: 80 }, top: -30, opacity: 0.8 }}>
                <Image src={arrow} width={100} height={100} alt="arrow" />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box mt={4}>
                  <Image src={doctor1} width={220} height={360} alt="doctor1" />
                </Box>
                <Box>
                  <Image src={doctor2} width={220} height={330} alt="doctor2" />
                </Box>
              </Box>
              <Box sx={{ position: "absolute", top: 220, left: 90 }}>
                <Image src={doctor3} width={220} height={220} alt="doctor3" />
              </Box>
              <Box sx={{ position: "absolute", bottom: -40, right: 0, zIndex: -1 }}>
                <Image src={stethoscope} width={160} height={160} alt="stethoscope" />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
