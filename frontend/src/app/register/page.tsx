"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    company: "",
    genderName: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
    company: "",
    genderName: "",
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

    if (!formData.lastName.length) {
      setErrorMessages((eM) => ({
        ...eM,
        lastName: "Please enter your last name.",
      }));
      c = true;
    } else setErrorMessages((eM) => ({ ...eM, lastName: "" }));

    if (!formData.email.length) {
      setErrorMessages((eM) => ({ ...eM, email: "Please enter an email." }));
      c = true;
    } else setErrorMessages((eM) => ({ ...eM, email: "" }));

    if (!formData.password.length) {
      setErrorMessages((eM) => ({
        ...eM,
        password: "Please enter a password.",
      }));
      c = true;
    } else setErrorMessages((eM) => ({ ...eM, password: "" }));

    if (!formData.confirm_password.length) {
      setErrorMessages((eM) => ({
        ...eM,
        confirm_password: "Please confirm your password.",
      }));
      c = true;
    } else setErrorMessages((eM) => ({ ...eM, confirm_password: "" }));

    if (formData.password !== formData.confirm_password) {
      setErrorMessages((eM) => ({
        ...eM,
        confirm_password: "Passwords do not match.",
      }));
      c = true;
    }

    if(!formData.company) {
      setErrorMessages((eM) => ({
        ...eM,
        company: "Please enter a company.",
      }));
      c = true;
    }

    if(!formData.phone) {
      setErrorMessages((eM) => ({
        ...eM,
        phone: "Please enter a phone number.",
      }));
      c = true;
    }

    if(!formData.genderName) {
      setErrorMessages((eM) => ({
        ...eM,
        genderName: "Please select a gender.",
      }));
      c = true;
    }

    if (c) return;

    const response = await axios.post(
      "http://localhost:5110/api/users/register",
      {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        company: formData.company,
        genderName: formData.genderName,
      }
    );

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
                className="mt-1 text-black w-full rounded-md border border-gray-300 p-2"
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
                className="mt-1 text-black w-full rounded-md border border-gray-300 p-2"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, lastName: e.target.value }))
                }
              />
              {errorMessages.lastName && (
                <p className="text-red-500">{errorMessages.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                className="mt-1 text-black w-full rounded-md border border-gray-300 p-2"
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
                Phone
              </label>
              <input
                type="text"
                className="mt-1 text-black w-full rounded-md border border-gray-300 p-2"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, phone: e.target.value }))
                }
              />
              {errorMessages.phone && (
                <p className="text-red-500">{errorMessages.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Company
              </label>
              <input
                type="text"
                className="mt-1 text-black w-full rounded-md border border-gray-300 p-2"
                placeholder="Enter your company"
                value={formData.company}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, company: e.target.value }))
                }
              />
              {errorMessages.company && (
                <p className="text-red-500">{errorMessages.company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Gender
              </label>
              <select
                className="mt-1 text-black w-full rounded-md border border-gray-300 p-2"
                value={formData.genderName}
                onChange={(e) =>
                  setFormData((d) => ({ ...d, genderName: e.target.value }))
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errorMessages.genderName && (
                <p className="text-red-500">{errorMessages.genderName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
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
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                placeholder="Confirm your password"
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
              onClick={handleRegister}
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
