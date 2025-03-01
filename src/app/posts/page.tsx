"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { baseUrl } from '@/utils/url';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Post {
  _id: string;
  text: string;
  name: string;
  avatar: string;
  user: string;
  likes: string[];
  comments: any[];
  date: string;
}

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [postText, setPostText] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = Cookies.get('Token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${baseUrl}api/posts`, {
        headers: {
          'x-auth-token': token
        }
      });

      setPosts(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error fetching posts');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get('Token');
      if (!token) {
        throw new Error('No token found');
      }

     
      const response = await axios.post(
        `${baseUrl}api/posts`,
        { text: postText },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );

  
      const userPosts = JSON.parse(Cookies.get('userPosts') || '[]');
      
   
      userPosts.push(response.data._id);
      
     
      Cookies.set('userPosts', JSON.stringify(userPosts));

      setPostText('');
      fetchPosts();
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error creating post');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const token = Cookies.get('Token');
      if (!token) throw new Error('No token found');

      await axios.put(`${baseUrl}api/posts/like/${postId}`, undefined, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      fetchPosts();
    } catch (err: any) {
      console.error('Like Error:', err);
      setError(err.response?.data?.msg || 'Error liking post');
    }
  };

  const handleUnlike = async (postId: string) => {
    try {
      const token = Cookies.get('Token');
      if (!token) throw new Error('No token found');

      await axios.put(`${baseUrl}api/posts/unlike/${postId}`, undefined, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "application/json",
        },
      });
      fetchPosts();
    } catch (err: any) {
      console.error('Unlike Error:', err);
      setError(err.response?.data?.msg || 'Error unliking post');
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const token = Cookies.get('Token');
      const userPosts = JSON.parse(Cookies.get('userPosts') || '[]');
      
      if (!token) {
        throw new Error('Token topilmadi');
      }

     
      if (!userPosts.includes(postId)) {
        setError("Bu postni o'chirish huquqi sizda yo'q!");
        return;
      }

     
      await axios.delete(`${baseUrl}api/posts/${postId}`, {
        headers: {
          "x-auth-token": token
        }
      });

     
      const updatedPosts = userPosts.filter((id: string) => id !== postId);
      Cookies.set('userPosts', JSON.stringify(updatedPosts));

    
      fetchPosts();
    } catch (err: any) {
      console.error('Delete Error:', err);
      setError(err.response?.data?.msg || "Postni o'chirishda xatolik yuz berdi");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
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
        <h1 className="text-4xl text-cyan-500 mb-4">Posts</h1>
        <p className="text-gray-600 mb-8">👋 Welcome to the community</p>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl text-cyan-600 mb-4">Say Something...</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Create a post..."
              className="w-full p-4 border rounded mb-4"
              rows={4}
            ></textarea>
            <button
              type="submit"
              className="bg-cyan-500 text-white px-6 py-2 rounded hover:bg-cyan-600"
            >
              Submit
            </button>
          </form>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src={post.avatar}
                  alt={post.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <Link href={`/profile/${post.user}`} className="font-bold text-cyan-500 hover:underline">
                  {post.name}
                </Link>
              </div>
              <p className="text-gray-700 mb-4">{post.text}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">
                  Posted on {new Date(post.date).toLocaleDateString()}
                </span>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleLike(post._id)}
                    className="flex items-center gap-1 text-cyan-500 hover:text-cyan-600"
                  >
                    <span>👍</span> {post.likes.length}
                  </button>
                  <button 
                    onClick={() => handleUnlike(post._id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600"
                  >
                    <span>👎</span>
                  </button>
                  <Link 
                    href={`/discussion/${post._id}`}
                    className="bg-cyan-500 text-white px-4 py-1 rounded hover:bg-cyan-600"
                  >
                    Discussion {post.comments.length > 0 && `(${post.comments.length})`}
                  </Link>
                  {JSON.parse(Cookies.get('userPosts') || '[]').includes(post._id) && (
                    <button 
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Posts;










