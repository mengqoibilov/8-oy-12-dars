import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import rasm1 from "@/img/rasm1.jpg";
import Navbar from '@/components/Navbar/page';
import CreateProfile from './CreateProfile/page';

export default function Home() {
  return (
    <div className="relative h-screen w-full">
      
      <div className="absolute inset-0 -z-10">
        <Image 
          src={rasm1} 
          alt="Background" 
          fill 
          style={{ objectFit: 'cover' }}
          quality={100}
          priority
        />
      </div>
      
      <nav className="absolute top-0 w-full flex justify-between items-center px-6 py-4 bg-gray-800 bg-opacity-90">
        <h1 className="text-white text-2xl font-bold">&lt;/&gt; DevConnector</h1>
        <div className="space-x-4">
          <Link href="/developers" className="text-white hover:underline">Developers</Link>
          <Link href="/register" className="text-white hover:underline">Register</Link>
          <Link href="/login" className="text-white hover:underline">Login</Link>
        </div>
      </nav>
     
      <div className="flex flex-col items-center justify-center h-full text-center text-white bg-black bg-opacity-50">
        <h2 className="text-5xl font-bold mb-4">Developer Connector</h2>
        <p className="text-lg mb-6">Create a developer profile/portfolio, share posts and get help from other developers</p>
        <div className="flex space-x-4">
          <Link href="/register" className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600">Sign Up</Link>
          <Link href="/login" className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400">Login</Link>
        </div>
      </div>
    </div>
  );
}
