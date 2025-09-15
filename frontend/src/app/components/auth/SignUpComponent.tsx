"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, UserPlus } from "lucide-react";
import { useState } from "react";

export default function SignupForm() {
  function NavigateToLogin() {
    window.location.href = "/auth/login";
  }

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (

    <Card className="w-[80%] max-w-[500px]">
      <CardHeader className="mt-5">
        <CardTitle className="text-center text-4xl font-bold">
          Register an account
        </CardTitle>
      </CardHeader>

      <CardContent className="px-15 pt-10">
        <form>
          <div className="flex flex-col gap-4">

            <div>
              <Label className="m-2">Username</Label>
              <Input name="username" type="text" required></Input>
            </div>

            <div>
              <Label className="m-2">Email</Label>
              <Input name="email" type="email" required></Input>
            </div>
            <div>
              <Label className="m-2">Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label className="m-2">Confirm Password</Label>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-center ">
              <Button className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Button>
            </div>

            <div>
              <Button variant="outline" onClick={() => NavigateToLogin()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
