"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { baseUrl } from '@/utils/url';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Profile {
  status: string;
  company: string;
  website: string;
  location: string;
  skills: string;
  github: string;
  bio: string;
}
interface CreateProfileProps {
  onProfileCreated: () => void;
}

const CreateProfile: React.FC<CreateProfileProps> = ({ onProfileCreated }) => {
  const [formData, setFormData] = useState({
    status: '',
    company: '',
    website: '',
    location: '',
    skills: '',
    github: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = Cookies.get('Token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        `${baseUrl}api/profile`,
        {
          status: formData.status,
          company: formData.company || "",
          website: formData.website || "",
          location: formData.location || "",
          skills: formData.skills.split(',').map(skill => skill.trim()),
          githubusername: formData.github || "",
          bio: formData.bio || "",
          social: {
            youtube: "",
            twitter: "",
            instagram: "",
            linkedin: "",
            facebook: ""
          },
          education: [],
          experience: []
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );

      console.log('Profile created:', response.data);
      router.push('/developers');
      
    } catch (err: any) {
      console.error('Profile creation error:', err.message);
      setError(err.response?.data?.msg || 'Profil yaratishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <h1 className="text-2xl font-bold">&lt;/&gt; DevConnector</h1>
        <div className="space-x-4">
          <Link href="/developers" className="hover:underline">Developers</Link>
          <Link href="/posts" className="hover:underline">Posts</Link>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/login" className="hover:underline">Logout</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-teal-600">Create Your Profile</h2>
        <p className="text-gray-600 mb-4">Let&apos;s get some information to make your profile stand out</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <select 
            name="status" 
            value={formData.status} 
            onChange={handleChange} 
            required 
            className="w-full p-2 border rounded"
          >
            <option value="">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
            <option value="Other">Other</option>
          </select>

          <input 
            type="text" 
            name="company" 
            value={formData.company} 
            onChange={handleChange} 
            placeholder="Company" 
            className="w-full p-2 border rounded" 
          />

          <input 
            type="text" 
            name="website" 
            value={formData.website} 
            onChange={handleChange} 
            placeholder="Website" 
            className="w-full p-2 border rounded" 
          />

          <input 
            type="text" 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
            placeholder="Location" 
            className="w-full p-2 border rounded" 
          />

          <input 
            type="text" 
            name="skills" 
            value={formData.skills} 
            onChange={handleChange} 
            placeholder="* Skills (HTML,CSS,JavaScript,...)" 
            required 
            className="w-full p-2 border rounded" 
          />

          <input 
            type="text" 
            name="github" 
            value={formData.github} 
            onChange={handleChange} 
            placeholder="Github Username" 
            className="w-full p-2 border rounded" 
          />

          <textarea 
            name="bio" 
            value={formData.bio} 
            onChange={handleChange} 
            placeholder="A short bio of yourself" 
            className="w-full p-2 border rounded h-32"
          ></textarea>

          <button 
            type="submit" 
            className={`w-full p-2 text-white rounded ${loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Profile"}
          </button>

          <button 
            type="button" 
            className="w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600" 
            onClick={() => router.push('/dashboard')}
            disabled={loading}
          >
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
