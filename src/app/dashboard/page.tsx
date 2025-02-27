"use client"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '@/utils/url';
import Cookies from 'js-cookie';

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
      setError(error.response?.data?.msg || 'Profilni yuklashda xatolik');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleDeleteExperience = async (expId: string) => {
    try {
      const token = Cookies.get('Token');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.delete(`${baseUrl}api/profile/experience/${expId}`, {
        headers: {
          'x-auth-token': token
        }
      });
      await fetchProfile();
    } catch (error: any) {
      console.error('Delete experience error:', error);
      setError(error.response?.data?.msg || 'Tajribani o\'chirishda xatolik');
    }
  };

  const handleDeleteEducation = async (eduId: string) => {
    try {
      const token = Cookies.get('Token');
      if (!token) {
        router.push('/login');
        return;
      }

      await axios.delete(`${baseUrl}api/profile/education/${eduId}`, {
        headers: {
          'x-auth-token': token
        }
      });
      await fetchProfile();
    } catch (error: any) {
      console.error('Delete education error:', error);
      setError(error.response?.data?.msg || 'Ta\'limni o\'chirishda xatolik');
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0">
        <h1 className="text-2xl">&lt;/&gt; DevConnector</h1>
        <div className="space-x-4">
          <Link href="/developers" className="hover:text-gray-300">Developers</Link>
          <Link href="/posts" className="hover:text-gray-300">Posts</Link>
          <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link href="/login" className="hover:text-gray-300">Logout</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mt-20">
        <h1 className="text-4xl text-cyan-500 mb-4">Dashboard</h1>
        
        <div className="mb-6">
          <h2 className="text-2xl mb-4">👤 Welcome {profile?.user?.name}</h2>
        </div>

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

        <h2 className="text-2xl font-bold mb-4">Experience Credentials</h2>
        <table className="w-full mb-8 bg-gray-50">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3">Company</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {profile?.experience?.map((exp, index) => (
              <tr key={index}>
                <td className="p-3">{exp.company}</td>
                <td className="p-3">{exp.title}</td>
                <td className="p-3">{exp.from} - {exp.to || 'Current'}</td>
                <td className="p-3">
                  <button 
                    onClick={() => handleDeleteExperience(exp._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="text-2xl font-bold mb-4">Education Credentials</h2>
        <table className="w-full mb-8 bg-gray-50">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3">School</th>
              <th className="text-left p-3">Degree</th>
              <th className="text-left p-3">Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {profile?.education?.map((edu, index) => (
              <tr key={index}>
                <td className="p-3">{edu.school}</td>
                <td className="p-3">{edu.degree}</td>
                <td className="p-3">{edu.from} - {edu.to || 'Current'}</td>
                <td className="p-3">
                  <button 
                    onClick={() => handleDeleteEducation(edu._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          👤 Delete My Account
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
