"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("id")) router.push("/home");
  }, []);

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let c = false;

    if (!formData.name.length) {
      setErrorMessages((eM) => ({ ...eM, name: "Please enter your name." }));
      c = true;
    } else setErrorMessages((eM) => ({ ...eM, name: "" }));
    if (!formData.last_name.length) {
      setErrorMessages((eM) => ({
        ...eM,
        last_name: "Please enter your last name.",
      }));
      c = true;
    } else setErrorMessages((eM) => ({ ...eM, last_name: "" }));
    if (!formData.email.length) {
      setErrorMessages((eM) => ({ ...eM, email: "Please enter an email." }));
      c = true;
    } else setErrorMessages((eM) => ({ ...eM, email: "" }));
    if (!formData.password.length) {
      setErrorMessages((eM) => ({
        ...eM,
        password: "Please enter an password.",
      }));
      c = true;
    } else setErrorMessages((eM) => ({ ...eM, password: "" }));
    if (!formData.confirm_password.length) {
      setErrorMessages((eM) => ({
        ...eM,
        confirm_password: "Please confirm your password again.",
      }));
      c = true;
    } else setErrorMessages((eM) => ({ ...eM, confirm_password: "" }));

    if (formData.password != formData.confirm_password)
      setErrorMessages((eM) => ({
        ...eM,
        confirm_password: "Password and confirm password are different.",
      }));

    const response = await axios.post("http://localhost:5110/api/users/register", {
      name: formData.name,
      lastName: formData.last_name,
      email: formData.email,
      password: formData.password,
    });

    if (response.status) {
      if (response.data.result) {
        localStorage.setItem("id", response.data.userData.id);
        window.location.reload();
        router.push("/dashboard");
      } else {
        setErrorMessages((eM) => ({
          ...eM,
          [response.data.title]: response.data.message,
        }));
      }
    }
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
          <h2 className="mb-4 text-center text-xl font-semibold text-gray-700">
            Register
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:ring-gray-500"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, name: e.target.value }))
                }
              />
              {errorMessages.name && (
                <p className="text-red-500">{errorMessages.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Last Name
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:ring-gray-500"
                placeholder="Enter your last name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, last_name: e.target.value }))
                }
              />
              {errorMessages.last_name && (
                <p className="text-red-500">{errorMessages.last_name}</p>
              )}
            </div>

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
              {errorMessages.email && (
                <p className="text-red-500">{errorMessages.email}</p>
              )}
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
              {errorMessages.password && (
                <p className="text-red-500">{errorMessages.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-gray-500 focus:ring-gray-500"
                placeholder="Enter your password again"
                value={formData.confirm_password}
                onChange={(e) =>
                  setFormData((d) => ({
                    ...d,
                    confirm_password: e.target.value,
                  }))
                }
              />
              {errorMessages.confirm_password && (
                <p className="text-red-500">{errorMessages.confirm_password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-gray-700 p-2 text-white hover:bg-gray-900"
              onClick={(e) => handleRegister(e)}
            >
              Register
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            <a href="/login" className="text-blue-600 hover:underline">
              Already Have an Account ?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
