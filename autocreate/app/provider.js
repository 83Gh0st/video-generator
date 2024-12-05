"use client";  // Marks this file as a client component

import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import React, { useEffect } from "react";
import { db } from "@/config/db";  // Assuming the db connection is correct
import { Users } from "@/config/schema";  // Adjust to your actual Users model path

function Provider({ children }) {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      isNewUser();  // Ensuring this is only called once `user` is available
    }
  }, [user]);

  const isNewUser = async () => {
    try {
      if (!user || !user.primaryEmailAddress) {
        console.log("No user information found");
        return;
      }

      const userEmail = user.primaryEmailAddress.emailAddress;
      console.log("Checking if user exists with email:", userEmail);

      const result = await db
        .select()
        .from(Users)
        .where(eq(Users.email, userEmail));

      // Check if the user already exists
      if (result.length === 0) {
        console.log("User not found, proceeding with insert...");

        const insertResult = await db.insert(Users).values({
          name: user.fullName,
          email: userEmail,
          imageUrl: user.imageUrl,
        });

        console.log("User inserted:", insertResult);
      } else {
        console.log("User already exists:", result);
      }
    } catch (error) {
      console.error("Error checking or inserting new user:", error);
    }
  };

  return <div>{children}</div>;
}

export default Provider;
