/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-23
 * Purpose: To create an email verification page with token parsing and automatic verification, maintaining visual consistency with auth page layouts.
 * Author Review: I validated correctness, security, and performance of the code.
 */

"use client";

import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email") || "";
      const username = searchParams.get("username") || "";

      if (!token) {
        toast.error("Invalid verification link", {
          description: "No verification token found."
        });
        router.push(`/auth/error?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`);
        return;
      }

      try {
        // TODO: Implement actual email verification API call
        // const response = await verifyEmailToken(token);
        
        // Simulate API call for now
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/failure for demo
        const isSuccess = Math.random() > 0.5; // 70% success rate for demo
        
        if (isSuccess) {
          toast.success("Email verified successfully!", {
            description: "You can now sign in to your account."
          });
          
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
        } else {
          throw new Error("Verification failed");
        }
      } catch (error: unknown) {
        console.error("Email verification error:", error);
        toast.error("Verification failed", {
          description: "The verification link is invalid or has expired."
        });
        
        setTimeout(() => {
          router.push(`/auth/error?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`);
        }, 1500);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

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
          <CardTitle className="text-center text-3xl font-bold">
            Verifying Email
          </CardTitle>
        </CardHeader>

        <CardContent className="px-15 pt-10 text-center">
          <div className="flex flex-col gap-6 items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            
            <p className="text-lg text-gray-600">
              Please wait while we verify your email address...
            </p>
            
            <p className="text-sm text-gray-500">
              This may take a few moments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}