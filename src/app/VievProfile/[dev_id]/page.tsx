"use client";
import useFetch from "@/hooks/useFetch";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

interface Experience {
  _id: string;
  company: string;
  title: string;
  location?: string;
  from: string;
  to?: string;
  description?: string; 
}

interface Education {
  _id: string;
  school: string;
  degree: string;
  fieldofstudy: string;
  from: string;
  to?: string;
  description?: string;
}

interface ApiUser {
  _id: string;
  name: string;
  avatar: string;
}

interface Profile {
  _id: string;
  user: ApiUser;
  bio: string;
  company: string;
  date: string;
  education: Education[];
  experience: Experience[];
  githubusername: string;
  location: string;
  skills: string[];
  social: {
    youtube: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    facebook: string;
  };
  status: string;
  website: string;
}

function Page() {
  const { dev_id } = useParams();
  const { data, error, loading } = useFetch<Profile>(`api/profile/user/${dev_id}`);
  const { data:github, error:githubError, loading:githubLoading } = useFetch<Profile>(`api/profile/github`);

  console.log(github);

  if (loading) return <p className="text-center text-gray-500">Yuklanmoqda...</p>;
  if (error) return <p className="text-center text-red-500">Xatolik yuz berdi!</p>;
  if (!data) return <p className="text-center text-gray-500">Ma'lumot topilmadi</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10">
        <h1 className="text-2xl">&lt;/&gt; DevConnector</h1>
        <div className="space-x-4">
          <Link href="/developers" className="hover:text-gray-300">Developers</Link>
          <Link href="/posts" className="hover:text-gray-300">Posts</Link>
          <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link href="/login" className="hover:text-gray-300">Logout</Link>
        </div>
      </nav>

      <div className="mt-20">
        <Link href="/developers">
          <button className="bg-gray-200 px-4 py-2 rounded-md mb-4">Back To Profiles</button>
        </Link>

        <div className="bg-teal-500 text-white p-6 rounded-lg shadow-lg text-center">
          <img
            src={data?.user?.avatar}
            alt="User Avatar"
            className="w-24 h-24 mx-auto rounded-full border-4 border-white"
          />
          <h1 className="text-2xl font-bold mt-2">{data?.user?.name}</h1>
          <p className="text-lg">{data?.status} at {data?.company}</p>
          <p className="text-sm">{data?.location}</p>
        </div>

        <div className="bg-gray-100 p-4 mt-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">User's Bio</h2>
          <p className="text-gray-600">{data?.bio}</p>
        </div>

        <div className="bg-gray-100 p-4 mt-4 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold">Skill Set</h2>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
              {data?.skills?.map((skill, index) => (
              <span key={index} className="bg-gray-200 px-3 py-1 rounded-md text-sm">✔️ {skill}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Experience</h2>
            {data?.experience?.length > 0 ? (
              data?.experience?.map((exp) => (
                <div key={exp?._id} className="border-b py-2">
                  <p className="text-gray-700 font-bold">{exp?.title} at {exp?.company}</p>
                  <p className="text-gray-600">{exp?.location}</p>
                  <p className="text-gray-500">{exp?.from} - {exp?.to || "Present"}</p>
                  {exp.description && <p className="text-gray-500">{exp.description}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No experience credentials</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Education</h2>
            {data?.education?.length > 0 ? (
              data?.education?.map((edu) => (
                <div key={edu?._id} className="border-b py-2">
                  <p className="text-gray-700 font-bold">{edu?.degree} in {edu?.fieldofstudy}</p>
                  <p className="text-gray-600">{edu?.school}</p>
                  <p className="text-gray-500">{edu?.from} - {edu?.to || "Present"}</p>
                  {edu.description && <p className="text-gray-500">{edu.description}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No education credentials</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;









