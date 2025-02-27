"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { baseUrl } from "@/utils/url";

interface Developer {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  company: string;
  status: string;
  location: string;
  skills: string[];
}

const Developers = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await axios.get(`${baseUrl}api/profile`);
        setDevelopers(response.data);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching developers:', error);
        setError(error.response?.data?.msg || 'Developers yuklashda xatolik');
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl">&lt;/&gt; DevConnector</h1>
        <div className="space-x-4">
          <Link href="/developers" className="hover:text-gray-300">Developers</Link>
          <Link href="/posts" className="hover:text-gray-300">Posts</Link>
          <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link href="/login" className="hover:text-gray-300">Logout</Link>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl text-cyan-500 mb-4">Developers</h1>
        <p className="text-gray-600 mb-8">👥 Browse and connect with developers</p>

        <div className="max-w-4xl mx-auto space-y-6">
          {Array.isArray(developers) && developers.length > 0 ? (
            developers.map((dev) => (
              <div key={dev._id} className="bg-white p-6 rounded-lg shadow flex items-center gap-6">
                <img 
                  src={dev.user.avatar} 
                  alt={dev.user.name}
                  className="w-24 h-24 rounded-full"
                />
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{dev.user.name}</h2>
                  <p className="text-gray-600">
                    {dev.status} {dev.company && `at ${dev.company}`}
                  </p>
                  <p className="text-gray-600">{dev.location}</p>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {dev.skills.slice(0, 4).map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Link 
                  href={`/VievProfile/${dev.user._id}`}
                  className="bg-cyan-500 text-white px-6 py-2 rounded hover:bg-cyan-600"
                >
                  View Profile
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No developers found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Developers;



