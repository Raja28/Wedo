import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
import Providers from "@/redux/providers";
import { Header } from "@/components/Header";
import BootstrapClientLoader from "@/components/BootstrapClientLoader";
import toast, { Toaster } from 'react-hot-toast';

import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
        <Toaster position="top-center"/>
          <Header />
          <BootstrapClientLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
