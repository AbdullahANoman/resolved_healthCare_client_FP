"use client"

import PHForm from "@/components/Forms/PHForm"
import PHInput from "@/components/Forms/PHInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Grid, Stack, Typography, Container } from "@mui/material"
import type { FieldValues } from "react-hook-form"
import { z } from "zod"
import KeyIcon from "@mui/icons-material/Key"
import { useChangePasswordMutation } from "@/redux/api/authApi"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { logoutUser } from "@/services/actions/logoutUser"
import { useEffect } from "react"

const validationSchema = z.object({
  oldPassword: z.string().min(6, "Must be at least 6 characters long"),
  newPassword: z.string().min(6, "Must be at least 6 characters long"),
})

const ChangePassword = () => {
  const [changePassword] = useChangePasswordMutation()
  const router = useRouter()

  useEffect(() => {
    // Example: if not logged in, redirect
    const isAuthenticated = false
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [router])

  const onSubmit = async (values: FieldValues) => {
    try {
      const res = await changePassword(values)

      if ("data" in res && res.data.status === 200) {
        logoutUser(router)
        toast.success("Password Changed Successfully")
      } else {
        throw new Error("Incorrect Old Password")
      }
    } catch (error) {
      toast.error("Incorrect Old Password")
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box
        sx={{
          px: 4,
          py: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack alignItems="center" justifyContent="center" mb={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: "50%",
              bgcolor: "primary.light",
              mb: 2,
            }}
          >
            <KeyIcon sx={{ color: "primary.main", fontSize: 40 }} />
          </Box>
          <Typography variant="h4" fontWeight={600} textAlign="center">
            Change Password
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
            Update your password to keep your account secure
          </Typography>
        </Stack>

        <PHForm
          onSubmit={onSubmit}
          defaultValues={{ oldPassword: "", newPassword: "" }}
          resolver={zodResolver(validationSchema)}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PHInput name="oldPassword" type="password" label="Current Password" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <PHInput name="newPassword" type="password" label="New Password" fullWidth />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Update Password
          </Button>
        </PHForm>
      </Box>
    </Container>
  )
}

export default ChangePassword
