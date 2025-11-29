import { Box, Container, Stack, Typography } from "@mui/material"
import Link from "next/link"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import LinkedInIcon from "@mui/icons-material/LinkedIn"
import InstagramIcon from "@mui/icons-material/Instagram"

const Footer = () => {
  return (
    <Box bgcolor="rgb(17, 26, 34)" py={5}>
      <Container>
        <Stack direction="row" gap={4} justifyContent="center" flexWrap="wrap">
          <Typography
            color="#fff"
            component={Link}
            href="/consultation"
            sx={{
              textDecoration: "none",
              "&:hover": { color: "#e3f2fd" },
              transition: "color 0.2s",
            }}
          >
            Consultation
          </Typography>
          <Typography
            color="#fff"
            sx={{
              cursor: "pointer",
              "&:hover": { color: "#e3f2fd" },
              transition: "color 0.2s",
            }}
          >
            Health Plans
          </Typography>
          <Typography
            color="#fff"
            sx={{
              cursor: "pointer",
              "&:hover": { color: "#e3f2fd" },
              transition: "color 0.2s",
            }}
          >
            Medicine
          </Typography>
          <Typography
            color="#fff"
            sx={{
              cursor: "pointer",
              "&:hover": { color: "#e3f2fd" },
              transition: "color 0.2s",
            }}
          >
            Diagnostics
          </Typography>
        </Stack>

        <Stack direction="row" gap={2} justifyContent="center" py={3}>
          <FacebookIcon sx={{ color: "#fff", fontSize: 30, cursor: "pointer", "&:hover": { color: "#1976d2" } }} />
          <InstagramIcon sx={{ color: "#fff", fontSize: 30, cursor: "pointer", "&:hover": { color: "#e91e63" } }} />
          <TwitterIcon sx={{ color: "#fff", fontSize: 30, cursor: "pointer", "&:hover": { color: "#1da1f2" } }} />
          <LinkedInIcon sx={{ color: "#fff", fontSize: 30, cursor: "pointer", "&:hover": { color: "#0077b5" } }} />
        </Stack>

        <Box
          sx={{
            border: "1px dashed lightgray",
          }}
        ></Box>

        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={2}
          justifyContent="space-between"
          alignItems="center"
          py={3}
          textAlign={{ xs: "center", md: "left" }}
        >
          <Typography component="p" color="white">
            &copy;2024 healthBridge. All Rights Reserved.
          </Typography>
          <Typography
            variant="h5"
            component={Link}
            href="/"
            fontWeight={600}
            color="white"
            sx={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LocalHospitalIcon />
            health
            <Box component="span" color="primary.main">
              Bridge
            </Box>
          </Typography>
          <Typography component="p" color="white">
            Privacy Policy | Terms & Conditions
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer
