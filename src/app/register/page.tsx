"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
  Divider,
  Grid,
} from "@mui/material"
import { Visibility, VisibilityOff, LocalHospital, Person, Email, Lock, Phone, LocationOn } from "@mui/icons-material"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { FieldValues } from "react-hook-form"
import { modifyPayload } from "@/utils/modifyPayload"
import { registerPatient } from "@/services/actions/registerPatient"
import { userLogin } from "@/services/actions/userLogin"
import { storeUserInfo } from "@/services/auth.services"
import { toast } from "sonner"

const patientValidationSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  contactNumber: z.string().regex(/^\d{11}$/, "Please provide a valid 11-digit phone number"),
  address: z.string().min(1, "Please enter your address"),
})

const validationSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  patient: patientValidationSchema,
})

type FormData = z.infer<typeof validationSchema>

const defaultValues = {
  password: "",
  patient: {
    name: "",
    email: "",
    contactNumber: "",
    address: "",
  },
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  })

  const onSubmit = async (values: FieldValues) => {
    setIsLoading(true)
    const data = modifyPayload(values)

    try {
      const res = await registerPatient(data)
      if (res?.data?.id) {
        toast.success(res?.message || "Registration successful!")

        // Auto-login after successful registration
        const result = await userLogin({
          password: values.password,
          email: values.patient.email,
        })

        if (result?.data?.accessToken) {
          storeUserInfo({ accessToken: result.data.accessToken })
          router.push("/dashboard")
        }
      }
    } catch (err: any) {
      toast.error("Registration failed. Please try again.")
      console.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 800 }}>
        <Card
          sx={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "none",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
          }}
        >
          <CardHeader
            sx={{
              textAlign: "center",
              pb: 4,
              pt: 4,
            }}
          >
            <Box
              sx={{
                mx: "auto",
                width: 64,
                height: 64,
                backgroundColor: "#6366f1",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <LocalHospital sx={{ fontSize: 32, color: "white" }} />
            </Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1, fontFamily: "serif" }}>
              Join healthBridge
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your patient account to access healthcare services
            </Typography>
          </CardHeader>

          <CardContent sx={{ px: 4, pb: 4 }}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: "flex", flexDirection: "column", gap: 4 }}
            >
              {/* Personal Information Section */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                  <Person sx={{ color: "#6366f1", fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: "serif" }}>
                    Personal Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      placeholder="Enter your full name"
                      error={!!errors.patient?.name}
                      helperText={errors.patient?.name?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                        sx: { height: 56 },
                      }}
                      {...register("patient.name")}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      error={!!errors.patient?.email}
                      helperText={errors.patient?.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                        sx: { height: 56 },
                      }}
                      {...register("patient.email")}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      type="tel"
                      placeholder="01234567890"
                      error={!!errors.patient?.contactNumber}
                      helperText={errors.patient?.contactNumber?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" />
                          </InputAdornment>
                        ),
                        sx: { height: 56 },
                      }}
                      {...register("patient.contactNumber")}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      placeholder="Enter your address"
                      error={!!errors.patient?.address}
                      helperText={errors.patient?.address?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn color="action" />
                          </InputAdornment>
                        ),
                        sx: { height: 56 },
                      }}
                      {...register("patient.address")}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Security Section */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                  <Lock sx={{ color: "#6366f1", fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: "serif" }}>
                    Account Security
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { height: 56 },
                  }}
                  {...register("password")}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  height: 48,
                  backgroundColor: "#6366f1",
                  "&:hover": { backgroundColor: "#4f46e5" },
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  // "&:hover": {
                  //   backgroundColor: "#4f46e5",
                  //   transform: "scale(1.02)",
                  // },
                }}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </Box>
          </CardContent>

          <Box sx={{ p: 3, pt: 0 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Already have an account?{" "}
              <Link href="/login" style={{ textDecoration: "none" }}>
                <Typography
                  component="span"
                  sx={{ color: "#6366f1", "&:hover": { color: "#4f46e5" }, fontWeight: 500 }}
                >
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Card>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Secure healthcare platform powered by healthBridge
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
