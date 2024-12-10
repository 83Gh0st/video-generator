import { Outfit } from "next/font/google";
import "./globals.css"; // Ensure this file exists in your project
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";

// Metadata for the app
export const metadata = {
  title: "AutoCreate",
  description: "Generate videos powered by AI",
  authors: [
    { name: "Gh0st" }, // Correct usage of the author field
  ],
  openGraph: {
    title: "AutoCreate",
    description: "Generate videos powered by AI",
    images: [
      {
        url: "/login.jpg", // Path relative to the public folder
        alt: "Login Page Image",
      },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    themeColor: "#ffffff", // Add theme color here
  },
};

const outfit = Outfit({ subsets: ["latin"] });

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
