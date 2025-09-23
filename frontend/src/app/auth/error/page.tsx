/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-23
 * Purpose: To create an email verification error page with search params parsing for email and username, maintaining visual consistency with auth page layouts.
 * Author Review: I validated correctness, security, and performance of the code.
 */

"use client";

import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { resendEmailVerification } from "@/services/userServiceApi";
import { handleApiError, handleApiSuccess } from "@/services/errorHandler";
import { toast } from "sonner";

export default function ErrorPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isResending, setIsResending] = useState(false);

  // Extract query parameters on mount using useSearchParams
  const searchParams = useSearchParams();
  useEffect(() => {
    const emailParam = searchParams.get("email") || "";
    const usernameParam = searchParams.get("username") || "";
    setEmail(emailParam);
    setUsername(usernameParam);
  }, [searchParams]);

  const handleResendVerification = async () => {
    if (!email || !username) {
      toast.error("Email and username are required to resend verification");
      return;
    }

    setIsResending(true);
    try {
      await resendEmailVerification(username, email);
      handleApiSuccess(
        "Verification email sent!",
        "Please check your email for the verification link.",
        {}
      );
    } catch (error) {
      handleApiError(error, "Failed to resend verification email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Image
        src="/PeerPrepLogo.png"
        alt="PeerprepLogo"
        width={200}
        height={200}
      />

      <Card className="min-h-[40%] min-w-[40%] mt-8">
        <CardHeader className="mt-5">
          <CardTitle className="text-center text-3xl font-bold text-red-600">
            Verification Failed
          </CardTitle>
        </CardHeader>

        <CardContent className="px-15 pt-10 text-center">
          <div className="flex flex-col gap-6">
            <p className="text-lg text-gray-600">
              {email
                ? `The verification link for ${email} is invalid or has expired.`
                : "The verification link is invalid or has expired."}
            </p>

            {username && (
              <p className="text-sm text-gray-500">Username: {username}</p>
            )}

            <p className="text-sm text-gray-500">
              Please request a new verification email or contact support if the
              problem persists.
            </p>

            <div className="flex flex-col gap-4">
              {email ? (
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full bg-black text-white font-medium py-2 px-4 rounded-md transition-colors hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {isResending ? "Sending..." : "Resend Verification Email"}
                </Button>
              ) : (
                <Link
                  href="/auth/signup"
                  className="w-full bg-black text-white font-medium py-2 px-4 rounded-md transition-colors block text-center"
                >
                  Back to Sign Up
                </Link>
              )}

              <Link
                href="/auth/login"
                className="text-blue-500 hover:underline text-sm"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
