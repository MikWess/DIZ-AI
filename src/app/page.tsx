'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videos = [
    '/videos/flood.mp4',
    '/videos/wildfire.mp4',
    '/videos/hurricane.mp4',
    '/videos/storm.mp4',
    '/videos/tornado.mp4'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 5000); // Change video every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Video Background */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
        {videos.map((src, index) => (
          <video 
            key={src}
            autoPlay 
            loop 
            muted 
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              currentVideo === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
        
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
  <div className="max-w-3xl">
    <h1 className="text-5xl font-bold mb-6 text-white">
      Less than 30% of people are prepared for disaster. 
      <span className="block mt-2">Act.</span>
    </h1>
    <p className="text-xl mb-8 text-white/90">Get a personalized emergency preparedness plan powered by AI, tailored to your location, household, and specific risks.</p>
    <Link 
      href="/analyze"
      className="bg-white text-[#004D40] px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all inline-flex items-center space-x-2"
    >
      <span>Get Your AI Analysis</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </Link>
  </div>
</div>
        
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Our AI Helps You Prepare</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#004D40] w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-4">Risk Analysis</h3>
              <p className="text-gray-600">Our AI analyzes your location using Wolfram's computational intelligence to identify potential natural disasters.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#004D40] w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-4">Personalized Plan</h3>
              <p className="text-gray-600">Get a custom preparedness plan based on your household size, location, and specific circumstances.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#004D40] w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-4">Real-time Updates</h3>
              <p className="text-gray-600">Receive AI-powered updates and recommendations as conditions change in your area.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Significance of Preparedness Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">The Significance of Preparedness</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-semibold mb-4">Critical Response Time</h3>
              <p className="text-gray-600">
                The first 72 hours of a disaster are crucial. Being prepared can mean the difference between safety and crisis when emergency services are overwhelmed.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-4">Protecting Your Home</h3>
              <p className="text-gray-600">
                Proper preparation can significantly reduce property damage and protect your valuable assets during natural disasters.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-4">Community Resilience</h3>
              <p className="text-gray-600">
                When individuals are prepared, the entire community becomes more resilient. Your preparedness contributes to a stronger, safer neighborhood.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
