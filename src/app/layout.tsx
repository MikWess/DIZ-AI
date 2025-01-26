import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DIZ-AI | AI-Powered Disaster Preparedness',
  description: 'Get personalized disaster preparedness plans based on your location and needs using advanced AI analysis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation Header */}
        <header className="bg-white border-b">
    <nav className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section with Home and Resources */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold text-[#004D40]">
            Diz-AI
          </Link>
          <Link href="/resources" className="text-gray-60 hover:text-[#004D40]">
            Resources
          </Link>
        </div>

        {/* Right Section with Analyze Button */}
        <div>
          <Link 
            href="/analyze"
            className="bg-[#004D40] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all"
          >
            Start Prep Plan
          </Link>
        </div>
      </div>
    </nav>
  </header>
        {children}

        {/* Footer */}
      
      </body>
    </html>
  );
}
