"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { baseUrl } from '@/utils/url';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddExperience = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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

      await axios.put(
        `${baseUrl}api/profile/experience`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Experience add error:', err.message);
      setError(err.response?.data?.msg || 'Tajriba qo\'shishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-teal-600">Add Experience</h2>
        <p className="text-gray-600 mb-4">Add any developer/programming positions that you have had in the past</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="* Job Title"
            required
            className="w-full p-2 border rounded"
          />

          <input 
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="* Company"
            required
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

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">From Date</label>
              <input 
                type="date"
                name="from"
                value={formData.from}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">To Date</label>
              <input 
                type="date"
                name="to"
                value={formData.to}
                onChange={handleChange}
                disabled={formData.current}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox"
              name="current"
              checked={formData.current}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Current Job</label>
          </div>

          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="w-full p-2 border rounded h-32"
          ></textarea>

          <div className="flex gap-4">
            <button 
              type="submit"
              className={`flex-1 p-2 text-white rounded ${loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'}`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Experience"}
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

export default AddExperience;
