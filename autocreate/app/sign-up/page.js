import { SignUp } from '@clerk/nextjs'
import Image from 'next/image';

export default function Page() {
  return  (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="relative h-full"> 
      
        <Image src="/login7.gif" alt="login" width={1000} height={800} 
        className='w-full object-contain h-100  '
        />
      </div>
      <div className='flex justify-center items-center h-screen '>
        <SignUp routing="hash" />
      </div>
    </div>
  );
}