"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const user = await JSON.parse(localStorage.getItem("user"));
      console.log('...',user)
      if (user.role === "CONTROL") {
        router.push("/admin/dashboard");
      } else {
        router.push("points/dashboard");
      }
    }

    getUser;
  }, [router]);
  return <div>auth</div>;
}
