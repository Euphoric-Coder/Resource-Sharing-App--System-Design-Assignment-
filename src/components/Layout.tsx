import React from 'react';
import { useStore } from '../store';
import { Bell, LogOut, User } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-indigo-600">ShareHub</h1>
            </div>
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Bell className="w-6 h-6 text-gray-600" />
                </button>
                <div className="flex items-center space-x-2">
                  <User className="w-6 h-6 text-gray-600" />
                  <span className="text-gray-700">{currentUser.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <LogOut className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-900">
                  Login
                </button>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © 2024 ShareHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}