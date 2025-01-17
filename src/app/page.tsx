"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3001");

export default function Home() {
  const [userId, setUserId] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleLogin = () => {
    if (userId) {
      socket.emit("login", userId);
      router.push(`/chat?userId=${userId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Chat
          </h1>
          <p className="text-gray-400">Select your user profile to continue</p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select User
              </label>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-12 bg-gray-700 rounded-xl"></div>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="
                      w-full p-4 bg-gray-700 text-gray-100 rounded-xl
                      border border-gray-600
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      appearance-none cursor-pointer
                    "
                  >
                    <option value="" className="bg-gray-700">
                      Select a user
                    </option>
                    {users.map((user) => (
                      <option key={user} value={user} className="bg-gray-700">
                        {user}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={!userId || isLoading}
              className="
                w-full py-4 px-6 bg-blue-600 text-white rounded-xl
                font-medium transition-all duration-200
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:bg-gray-600 disabled:cursor-not-allowed
                flex items-center justify-center space-x-2
              "
            >
              <span>Enter Chat</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            Choose your profile to start chatting with other users
          </div>
        </div>
      </div>
    </div>
  );
}
