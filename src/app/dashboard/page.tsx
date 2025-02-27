"use client"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/utils/url';
import Cookies from 'js-cookie';
import CreateProfile from '../CreateProfile/page';


interface Profile {
  status: string;
  company: string;
  website: string;
  location: string;
  skills: string[];
  bio: string;
  githubusername: string;
  experience: any[];
  education: any[];
  user: {
    name: string;
  };
}

const Dashboard = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      const token = Cookies.get('Token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get(`${baseUrl}api/profile/me`, {
        headers: {
          'x-auth-token': token
        }
      });

      setProfile(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setProfile(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!profile) {
    return <CreateProfile onProfileCreated={fetchProfile} />;
  }

  return (
    <div className="container mx-auto p-4">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0">
        <h1 className="text-2xl">&lt;/&gt; DevConnector</h1>
        <div className="space-x-4">
          <Link href="/developers" className="hover:text-gray-300">Developers</Link>
          <Link href="/posts" className="hover:text-gray-300">Posts</Link>
          <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link href="/login" className="hover:text-gray-300">Logout</Link>
        </div>
      </nav>

      <div className="mt-20">
        <h1 className="text-4xl text-cyan-500 mb-4">Dashboard</h1>
        <h2 className="text-2xl mb-4">👤 Welcome {profile.user.name}</h2>
        
        <div className="flex gap-4 mb-8">
          <Link href="/edit-profile" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded">
            👤 Edit Profile
          </Link>
          <Link href="/add-experience" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded">
            ➕ Add Experience
          </Link>
          <Link href="/Add-education" className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded">
            🎓 Add Education
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
