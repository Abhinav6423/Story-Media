import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Authcontext.js";
const Login = () => {
    const { reloadUser } = useAuth();
    return (
        <div className="min-h-screen bg-[#1f2a2e] flex items-center justify-center px-4">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

                {/* LEFT — IMAGE */}
                <div className="md:w-1/2 bg-[#f6f7f9] flex items-center justify-center px-10 py-14">
                    <img
                        src="https://i.pinimg.com/736x/67/93/ea/6793ea96872c575d935b25a360213f48.jpg"
                        alt="Reading illustration"
                        className="w-full max-w-xl object-contain"
                    />
                </div>

                {/* RIGHT — FORM */}
                <div className="md:w-1/2 flex flex-col justify-center px-8 sm:px-12 py-14">

                    {/* Logo */}
                    <h1 className="text-3xl font-semibold text-center tracking-tight mb-10">
                        <span className="text-gray-900">BO</span>
                        <span className="text-orange-500">OK</span>
                        <span className="text-gray-900">I</span>
                    </h1>

                    {/* Tabs */}
                    <div className="flex justify-center gap-10 text-sm font-medium mb-14">
                        <span className="text-gray-900 relative after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-orange-500">
                            Login
                        </span>
                        <Link to={"/register"}>
                            <span className="text-gray-400 cursor-pointer hover:text-gray-500 transition">
                                Signup
                            </span>
                        </Link>
                    </div>

                    {/* Form Wrapper */}
                    <div className="mx-auto w-full max-w-sm space-y-8">

                        {/* Email */}
                        <div>
                            <label className="block text-xs tracking-wide text-gray-500 mb-2">
                                EMAIL
                            </label>
                            <input
                                type="email"
                                placeholder="you@email.com"
                                className="w-full border-b border-gray-300 bg-transparent py-2 text-sm focus:outline-none focus:border-gray-900 transition"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs tracking-wide text-gray-500 mb-2">
                                PASSWORD
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full border-b border-gray-300 bg-transparent py-2 text-sm focus:outline-none focus:border-gray-900 transition"
                            />
                        </div>

                        {/* Button */}
                        <button className="w-full mt-12 bg-[#263238] text-white text-sm tracking-wide py-3.5 rounded-xl hover:bg-black transition">
                            Login
                        </button>

                        {/* Helpers */}
                        <p className="text-center text-xs text-gray-400 mt-6 cursor-pointer hover:text-gray-600 transition">
                            Forgot password?
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
