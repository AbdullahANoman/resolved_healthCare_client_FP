"use client"

import { Box, Container, Typography, Paper, Grid, Avatar, Divider } from "@mui/material"
import useUserInfo from "@/hooks/useUserInfo"
import PersonIcon from "@mui/icons-material/Person"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"

const ProfilePage = () => {
  const userInfo = useUserInfo()
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: "primary.main" }}>
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              {userInfo?.name || "User Profile"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Patient Profile
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <EmailIcon sx={{ mr: 2, color: "primary.main" }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{userInfo?.email || "Not provided"}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PhoneIcon sx={{ mr: 2, color: "primary.main" }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">{userInfo?.contactNumber || "Not provided"}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOnIcon sx={{ mr: 2, color: "primary.main" }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">{userInfo?.address || "Not provided"}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default ProfilePage
