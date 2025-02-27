"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { baseUrl } from '@/utils/url';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface Profile {
  status: string;
  company: string;
  website: string;
  location: string;
  skills: string[];
  githubusername: string;
  bio: string;
  social: {
    youtube: string;
    twitter: string;
    facebook: string;
    linkedin: string;
    instagram: string;
  };
}

const EditProfile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    status: '',
    company: '',
    website: '',
    location: '',
    skills: '',
    githubusername: '',
    bio: '',
    youtube: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    instagram: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('Token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get<Profile>(`${baseUrl}api/profile/me`, {
          headers: {
            'x-auth-token': token
          }
        });

        const profile = response.data;
        
       
        setFormData({
          status: profile.status || '',
          company: profile.company || '',
          website: profile.website || '',
          location: profile.location || '',
          skills: profile.skills.join(',') || '',
          githubusername: profile.githubusername || '',
          bio: profile.bio || '',
          youtube: profile.social?.youtube || '',
          twitter: profile.social?.twitter || '',
          facebook: profile.social?.facebook || '',
          linkedin: profile.social?.linkedin || '',
          instagram: profile.social?.instagram || ''
        });

        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        setError(error.response?.data?.msg || 'Profilni yuklashda xatolik');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

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

      await axios.post(
        `${baseUrl}api/profile`,
        {
          status: formData.status,
          company: formData.company,
          website: formData.website,
          location: formData.location,
          skills: formData.skills.split(',').map(skill => skill.trim()),
          githubusername: formData.githubusername,
          bio: formData.bio,
          social: {
            youtube: formData.youtube,
            twitter: formData.twitter,
            facebook: formData.facebook,
            linkedin: formData.linkedin,
            instagram: formData.instagram
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Profile update error:', err.message);
      setError(err.response?.data?.msg || 'Profilni yangilashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-teal-600">Edit Your Profile</h2>
        <p className="text-gray-600 mb-4">Update your profile information</p>

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
            name="githubusername" 
            value={formData.githubusername} 
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

          <div className="border-t pt-4">
            <h3 className="text-xl mb-4">Social Network Links</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                name="youtube" 
                value={formData.youtube} 
                onChange={handleChange} 
                placeholder="YouTube URL" 
                className="w-full p-2 border rounded" 
              />
              <input 
                type="text" 
                name="twitter" 
                value={formData.twitter} 
                onChange={handleChange} 
                placeholder="Twitter URL" 
                className="w-full p-2 border rounded" 
              />
              <input 
                type="text" 
                name="facebook" 
                value={formData.facebook} 
                onChange={handleChange} 
                placeholder="Facebook URL" 
                className="w-full p-2 border rounded" 
              />
              <input 
                type="text" 
                name="linkedin" 
                value={formData.linkedin} 
                onChange={handleChange} 
                placeholder="LinkedIn URL" 
                className="w-full p-2 border rounded" 
              />
              <input 
                type="text" 
                name="instagram" 
                value={formData.instagram} 
                onChange={handleChange} 
                placeholder="Instagram URL" 
                className="w-full p-2 border rounded" 
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit" 
              className={`flex-1 p-2 text-white rounded ${loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>

            <Link href="/dashboard">
              <button 
                type="button" 
                className="flex-1 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Go Back
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
