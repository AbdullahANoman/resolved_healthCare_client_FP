"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  Stethoscope,
  BadgeCheck,
  Heart,
} from "lucide-react";
import { modifyPayload } from "@/utils/modifyPayload";
import { registerPatient } from "@/services/actions/registerPatient";
import { userLogin } from "@/services/actions/userLogin";
import { storeUserInfo } from "@/services/auth.services";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const patientValidationSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  contactNumber: z
    .string()
    .regex(/^\d{11}$/, "Please provide a valid 11-digit phone number"),
  address: z.string().min(1, "Please enter your address"),
});

const validationSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  patient: patientValidationSchema,
});

type FormData = z.infer<typeof validationSchema>;

const defaultValues = {
  password: "",
  patient: {
    name: "",
    email: "",
    contactNumber: "",
    address: "",
  },
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    const data = modifyPayload(values);

    try {
      const res = await registerPatient(data);
      console.log(res);
      if (res?.success == true) {
        toast.success(res?.message || "Registration successful!");

        // Auto-login after successful registration
        // const result = await userLogin({
        //   password: values.password,
        //   email: values.patient.email,
        // });

        // if (result?.data?.accessToken) {
        //   console.log(result);
        //   storeUserInfo({ accessToken: result.data.accessToken });
        //   toast.success("Login successful! Redirecting to dashboard...");
        //   router.push("/dashboard/patient");
        // }

        router.push("/login");
      }
    } catch (err: any) {
      toast.error("Registration failed. Please try again.");
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl border-none bg-white/95 backdrop-blur-sm">
          {/* Header */}
          <CardHeader className="text-center pb-8 pt-10">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              healthBridge
            </h1>
            <CardDescription className="text-gray-600">
              Create your patient account to access healthcare services
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 font-serif">
                      Personal Information
                    </h3>
                  </div>
                  <Separator className="mb-6" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="patient.name"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            Full Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="patient.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            Email Address *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone Number */}
                    <FormField
                      control={form.control}
                      name="patient.contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            Phone Number *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="01234567890"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address */}
                    <FormField
                      control={form.control}
                      name="patient.address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            Address *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your address"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Account Security Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Shield className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 font-serif">
                      Account Security
                    </h3>
                  </div>
                  <Separator className="mb-6" />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-gray-500" />
                          Password *
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a secure password"
                              className="h-12 pr-12"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base transition-all duration-200 hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="pt-0 pb-8">
            <div className="w-full text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Secure healthcare platform powered by{" "}
            <span className="font-medium text-gray-700">HealthBridge</span>
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="h-3 w-3" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Lock className="h-3 w-3" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <BadgeCheck className="h-3 w-3" />
              <span>Verified & Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
