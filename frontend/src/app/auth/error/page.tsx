/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-23
 * Purpose: To create an email verification error page with search params parsing for email and username, maintaining visual consistency with auth page layouts.
 * Author Review: I validated correctness, security, and performance of the code.
 */

"use client";

import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  // Extract query parameters on mount using useSearchParams
  const searchParams = useSearchParams();
  useEffect(() => {
    const emailParam = searchParams.get("email") || "";
    const usernameParam = searchParams.get("username") || "";
    setEmail(emailParam);
    setUsername(usernameParam);
  }, [searchParams]);

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
              <Link
                href={
                  email
                    ? `/auth/check-email?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`
                    : "/auth/signup"
                }
                className="w-full bg-black text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {email ? "Resend Verification Email" : "Back to Sign Up"}
              </Link>

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
