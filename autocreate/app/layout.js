import {Outfit} from "next/font/google";
import "./globals.css"; // Ensure this file exists in your project
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import Image from "next/image";


// Metadata for the app
export const metadata = {
  title: "AutoCreate",
  description: "Generate videos powered by AI",
  image: "/login.jpg", // Correct path relative to the public folder
  author: "Gh0st", // Author or brand name
  themeColor: "#123456", // Matches your app's primary color for mobile browsers
};


const outfit=Outfit({subsets:['latin']})
// Root Layout
export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className={outfit.className}>
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
