"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:5110/api/users/login',{
        email : formData.email,
        password : formData.password
    });

    console.log(response.data);

  };

  return (
    <div className="flex flex-col gap-10 min-h-screen items-center justify-center bg-gray-800">
      <div className="flex flex-col w-1/4 items-center ">
        <div className="mb-6 text-center w-max ">
          <h1 className="text-5xl font-bold text-white mb-5">ERP</h1>
          <h3 className="text-2xl text-white bottom border-b-4 border-white">
            Streamlining Your Business Operations
          </h3>
        </div>
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          {/* Logo ve Başlık */}

          {/* Giriş Formu */}
          <h2 className="mb-4 text-center text-xl font-semibold text-gray-700">
            Log In
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:ring-gray-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, email: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:ring-gray-500"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, password: e.target.value }))
                }
              />
            </div>

            {/* Şifre Sıfırlama ve Giriş Butonu */}
            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-gray-700 p-2 text-white hover:bg-gray-900"
              onClick={(e)=> handleLogin(e)}
            >
              LOGIN
            </button>
          </form>

          {/* Hesap Oluşturma */}
          <div className="mt-4 text-center text-sm">
            <a href="#" className="text-blue-600 hover:underline">
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
