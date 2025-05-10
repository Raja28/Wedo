'use client';
import Image from "next/image";

// import styles from "./page.module.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSelector } from "react-redux";
import Login from "./login/page";
import OpenRoute from "@/components/OpenRoute";

export default function Home() {
  const { user } = useSelector(state => state.userSlice)

  return (
    <>
   
        <Login />
    
    </>
   
  );
}
