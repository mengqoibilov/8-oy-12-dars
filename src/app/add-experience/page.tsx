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
    const value =
      e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
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

      await axios.put(`${baseUrl}api/profile/experience`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Experience add error:', err.message);
      setError(err.response?.data?.msg || 'Tajriba qo\'shishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-3xl mx-auto mt-16 p-8 bg-white/90 rounded-xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-blue-700">Add Experience</h2>
        <p className="text-blue-600 mb-6">
          Add any developer/programming positions that you have had in the past
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="* Job Title"
            required
            className="w-full p-3 border-2 border-blue-300 rounded focus:outline-none focus:border-blue-500"
          />

          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="* Company"
            required
            className="w-full p-3 border-2 border-blue-300 rounded focus:outline-none focus:border-blue-500"
          />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-3 border-2 border-blue-300 rounded focus:outline-none focus:border-blue-500"
          />

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm text-blue-700 mb-2">From Date</label>
              <input
                type="date"
                name="from"
                value={formData.from}
                onChange={handleChange}
                required
                className="w-full p-3 border-2 border-blue-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm text-blue-700 mb-2">To Date</label>
              <input
                type="date"
                name="to"
                value={formData.to}
                onChange={handleChange}
                disabled={formData.current}
                className="w-full p-3 border-2 border-blue-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="current"
              checked={formData.current}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600"
            />
            <label className="text-blue-700">Current Job</label>
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="w-full p-3 border-2 border-blue-300 rounded h-32 focus:outline-none focus:border-blue-500"
          ></textarea>

          <div className="flex gap-4">
            <button
              type="submit"
              className={`flex-1 p-3 text-white font-semibold rounded transition-colors ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Experience"}
            </button>

            <Link href="/dashboard" className="flex-1">
              <button
                type="button"
                className="w-full p-3 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 transition-colors"
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
