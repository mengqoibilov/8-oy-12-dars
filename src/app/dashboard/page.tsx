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

  const deleteProfile = async () => {
    if (!confirm("Haqiqatan ham profilingizni ochirmoqchimisiz?")) return;

    try {
      const token = Cookies.get('Token');
      await axios.delete(`${baseUrl}api/profile`, {
        headers: {
          'x-auth-token': token
        }
      });

      setProfile(null);
      router.push('/login');
    } catch (error: any) {
      console.error('Error deleting profile:', error);
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
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 ">
        <h1 className="text-2xl">&lt;/&gt; DevConnector</h1>
        <div className="space-x-4">
          <Link href="/developers" className="hover:text-gray-300">Developers</Link>
          <Link href="/posts" className="hover:text-gray-300">Posts</Link>
          <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link href="/login" className="hover:text-gray-300">Logout</Link>
        </div>
      </nav>

      <div className="mt-20">
        <h1 className=" text-blue-900 text-4xl text-cyan-500 mb-4">Dashboard</h1>
        <h2 className=" text-blue-900 text-2xl mb-4">👤 Welcome {profile?.user?.name}</h2>
        
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


        <h2 className="text-xl font-bold mb-2">Experience Credentials</h2>
        {profile.experience.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Company</th>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Years</th>
              </tr>
            </thead>
            <tbody>
              {profile.experience.map((exp, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{exp.company}</td>
                  <td className="border border-gray-300 px-4 py-2">{exp.title}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(exp.from).getFullYear()} - {exp.to ? new Date(exp.to).getFullYear() : 'Present'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No experience added.</p>
        )}

        <h2 className="text-xl font-bold mb-2">Education Credentials</h2>
        {profile.education.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">School</th>
                <th className="border border-gray-300 px-4 py-2">Degree</th>
                <th className="border border-gray-300 px-4 py-2">Years</th>
              </tr>
            </thead>
            <tbody>
              {profile.education.map((edu, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{edu.school}</td>
                  <td className="border border-gray-300 px-4 py-2">{edu.degree}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(edu.from).getFullYear()} - {edu.to ? new Date(edu.to).getFullYear() : 'Present'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No education added.</p>
        )}

        <button 
          onClick={deleteProfile} 
          className="bg-red-400 text-white px-4 py-2 rounded mt-4 flex items-center"
        >
          ❌ Delete My Account
        </button>
      </div>
    </div>
  );
};

export default Dashboard;










