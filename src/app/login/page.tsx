"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userLogin } from "@/services/actions/userLogin";
import { storeUserInfo } from "@/services/auth.services";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { decodedToken } from "@/utils/jwt";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

// Demo credentials
const DEMO_CREDENTIALS = {
  patient: { email: "saifulislam@example.com", password: "123456" },
  doctor: { email: "sid@gmail.com", password: "123456" },
  admin: { email: "abdullahnoman4537@gmail.com", password: "123456" },
};

// Role-based routes
const DASHBOARD_ROUTES = {
  SUPER_ADMIN: "/dashboard/super_admin",
  ADMIN: "/dashboard/admin",
  DOCTOR: "/dashboard/doctor",
  PATIENT: "/dashboard/patient",
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "saifulislam@example.com",
      password: "123456",
    },
  });

  const getDashboardRoute = (role: string) => {
    const upperCaseRole = role.toUpperCase();
    return DASHBOARD_ROUTES[upperCaseRole as keyof typeof DASHBOARD_ROUTES] || "/dashboard";
  };

  const handleQuickLogin = (role: keyof typeof DEMO_CREDENTIALS) => {
    const credentials = DEMO_CREDENTIALS[role];
    setValue("email", credentials.email);
    setValue("password", credentials.password);
  };

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);

    try {
      const res = await userLogin(data);

      if (res?.success) {
        let role = "";
        const needsChange = Boolean(res?.data?.needsPasswordChange);
        
        if (res?.data?.accessToken) {
          const token = res.data.accessToken;
          storeUserInfo({ accessToken: token });
          
          try {
            document.cookie = `accessToken=${token}; path=/; samesite=lax`;
          } catch (error) {
            console.warn("Cookie setting failed:", error);
          }
          
          const decoded: any = decodedToken(token);
          role = decoded?.role || "";
        }

        const dashboardRoute = getDashboardRoute(role);
        // const targetRoute = needsChange ? "/change-password" : dashboardRoute;

        toast({
          title: "Login Successful!",
          description: `Welcome back to healthBridge${role ? ` (${role})` : ""}`,
          variant: "default",
        });

        router.push(dashboardRoute);
        router.refresh();
      } else {
        toast({
          title: "Login Failed",
          description: res?.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            healthBridge
          </h1>
          <p className="text-gray-600 text-sm">Your trusted healthcare platform</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to access your healthcare dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Demo Login Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Object.keys(DEMO_CREDENTIALS).map((role) => (
                <Button
                  key={role}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin(role as keyof typeof DEMO_CREDENTIALS)}
                  className="text-xs capitalize h-8"
                  disabled={isLoading}
                >
                  {role}
                </Button>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={cn(
                      "pl-10 h-11",
                      errors.email && "border-red-500 focus-visible:ring-red-500"
                    )}
                    {...register("email")}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={cn(
                      "pl-10 pr-10 h-11",
                      errors.password && "border-red-500 focus-visible:ring-red-500"
                    )}
                    {...register("password")}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-11 w-10 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-gray-600">
              Do not have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Create account
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Secure healthcare platform powered by healthBridge
          </p>
        </div>
      </div>
    </div>
  );
}