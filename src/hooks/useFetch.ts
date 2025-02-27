"use client"
import { baseUrl } from '@/utils/url';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function useFetch<T>(url: string) {
  const [data,setData] = useState <T|null>(null);
  const [loading,setLoading] = useState<boolean>(false)
  const [error,setError] = useState<string>("");
  async function fetchData() {
    try {
     setError("");
     setLoading(true);
     let res = await axios.get(baseUrl+url);
     setData(res.data);
     console.log(res);
    } catch (error:any) {
     setError(error.massage)
    } finally {
     setLoading(false);
    }
     
   }
 
  useEffect(() =>{
    fetchData();
  },[url])
  return {loading,error,data,refetch:fetchData,}
}

export default useFetch