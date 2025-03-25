import React from 'react';
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-3xl font-bold mb-8">Welcome to Our Application</h1>
      <Link 
        to="/health-kiosk" 
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors"
      >
        Go to Health Kiosk
      </Link>
    </div>
  )
}