"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { useAppContext } from "@/context/AppContext";

export default function Home() {
  const { state } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!state.onboardingComplete) {
      router.push("/onboarding");
    }
  }, [state.onboardingComplete, router]);

  if (!state.onboardingComplete) {
    return null;
  }

  return <Dashboard />;
}