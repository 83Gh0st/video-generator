import { SignIn } from '@clerk/nextjs';
import Image from 'next/image'; // Don't forget to import Image

export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="relative h-screen"> 
      
        <Image src="/login4.jpg" alt="login" width={800} height={100} 
        className='w-full object-contain h-relative '
        />
      </div>
      <div className='flex justify-center items-center h-screen '>
        <SignIn routing="hash" />
      </div>
    </div>
  );
}
