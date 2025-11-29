"use client"

import { Box, Card, CardContent, Typography, Grid, Avatar, Button, Stack, IconButton } from "@mui/material"
import {
  CalendarToday,
  People,
  TrendingUp,
  Schedule,
  VideoCall,
  Assignment,
  Notifications,
  Star,
} from "@mui/icons-material"

const DoctorPage = () => {
  const todayStats = {
    appointments: 8,
    completed: 5,
    upcoming: 3,
    patients: 12,
  }

  const upcomingAppointments = [
    {
      id: 1,
      patient: "Sarah Johnson",
      time: "10:00 AM",
      type: "Follow-up",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      patient: "Michael Chen",
      time: "11:30 AM",
      type: "Consultation",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      patient: "Emma Wilson",
      time: "2:00 PM",
      type: "Check-up",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a1a", mb: 1 }}>
          Good morning, Dr. Smith
        </Typography>
        <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
          You have {todayStats.upcoming} appointments scheduled for today
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {todayStats.appointments}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Today Appointments
                  </Typography>
                </Box>
                <CalendarToday sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {todayStats.patients}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Patients
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", color: "white" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {todayStats.completed}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Completed Today
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", color: "white" }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    4.9
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Patient Rating
                  </Typography>
                </Box>
                <Star sx={{ fontSize: 40, opacity: 0.8 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Appointments */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Today is Schedule
              </Typography>
              <Stack spacing={2}>
                {upcomingAppointments.map((appointment) => (
                  <Box
                    key={appointment.id}
                    sx={{
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar src={appointment.avatar} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {appointment.patient}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.time} • {appointment.type}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" sx={{ color: "#667eea" }}>
                        <VideoCall />
                      </IconButton>
                      <IconButton size="small" sx={{ color: "#667eea" }}>
                        <Assignment />
                      </IconButton>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Quick Actions
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Schedule />}
                  fullWidth
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    py: 1.5,
                  }}
                >
                  View Schedule
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<People />}
                  fullWidth
                  sx={{ py: 1.5, borderColor: "#667eea", color: "#667eea" }}
                >
                  Patient Records
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Assignment />}
                  fullWidth
                  sx={{ py: 1.5, borderColor: "#667eea", color: "#667eea" }}
                >
                  Write Prescription
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Notifications />}
                  fullWidth
                  sx={{ py: 1.5, borderColor: "#667eea", color: "#667eea" }}
                >
                  Send Reminder
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}


export default DoctorPage