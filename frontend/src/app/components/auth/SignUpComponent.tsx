"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DebouncedInput } from "@/components/ui/debouncedInput";
import { Eye, EyeOff, ArrowLeft, UserPlus } from "lucide-react";
import { useState } from "react";

export default function SignupForm() {
  function NavigateToLogin() {
    window.location.href = "/auth/login";
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isPasswordsMatch = password === confirmPassword;

  return (

    <Card className="w-[80%] max-w-[500px]">

      {/*Header */}
      <CardHeader className="mt-5">
        <CardTitle className="text-center text-4xl font-bold">
          Register an account
        </CardTitle>
      </CardHeader>

      <CardContent className="px-15 pt-10">
        <form>
          <div className="flex flex-col gap-4">

            {/* Username input */}
            <div>
              <Label className="m-2">Username</Label>
              <Input 
                name="username" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Email input */}
            <div>
              <Label className="m-2">Email</Label>
              <Input 
                name="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password input with visibility toggle */}
            <div>
              <Label className="m-2">Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                    {password && (showPassword ? (
                    <EyeOff className="h-4 w-4" />
                    ) : (
                    <Eye className="h-4 w-4" />
                    ))}
                </Button>
              </div>
            </div>

            {/* Confirm Password input with visibility toggle */}
            <div>
              <Label className="m-2">Confirm Password</Label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {confirmPassword && (showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                      ) : (
                      <Eye className="h-4 w-4" />
                    ))}
                </Button>
              </div>
            </div>

            {/* Register Button and already have an account*/}
            <div className="flex justify-center mt-4">
              <Button className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Button>
            </div>

            {/* Navigate to login page */}
            <div className="flex justify-center mt-4">
              <div className="text-sm text-muted-foreground">Already have an account?</div>
              <Button 
                variant="link" 
                className="ml-3 p-0 h-auto text-sm text-blue-500 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  NavigateToLogin();
                }}
              >
                Sign in here
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
