import { Button } from "@/components/ui/button";
import { UserButton, UserProfile } from "@clerk/nextjs"; // Correctly import the required components
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2>Hello</h2>

      <Button >Hello</Button>

      <div>
        

        <UserButton>
          
        </UserButton>
      </div>
    </div>
  );
}
