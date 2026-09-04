"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();

    const {
        user,
        loading: authLoading,
        login
    } = useAuth();

    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Agar user already logged in hai,
    // to login page dikhane ki zarurat nahi hai.
    useEffect(() => {
        if (!authLoading && user) {
            router.replace("/");
        }
    }, [user, authLoading, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // User dobara type kare to old error hata do
        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const identifier = formData.identifier.trim();
        const password = formData.password;

        // Frontend validation
        if (!identifier || !password) {
            setError("Email/username and password are required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Backend username OR email accept karta hai.
            const payload = identifier.includes("@")
                ? {
                    email: identifier,
                    password
                }
                : {
                    username: identifier,
                    password
                };

            await login(payload);

            // Login successful
            router.replace("/");
        } catch (error) {
            setError(
                error.message || "Unable to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // AuthProvider abhi check kar raha hai ki
    // existing session/cookie available hai ya nahi.
    if (authLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">
                    Loading...
                </p>
            </main>
        );
    }

    // Already logged-in user redirect ho raha hoga.
    if (user) {
        return null;
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Heading */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Login to continue to AI Mentor
                    </p>
                </div>

                {/* Login Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* Email / Username */}
                    <div>
                        <label
                            htmlFor="identifier"
                            className="mb-2 block font-medium"
                        >
                            Email or Username
                        </label>

                        <input
                            id="identifier"
                            name="identifier"
                            type="text"
                            placeholder="Enter email or username"
                            value={formData.identifier}
                            onChange={handleChange}
                            autoComplete="username"
                            disabled={loading}
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block font-medium"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            disabled={loading}
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-lg bg-red-50 p-3">
                            <p className="text-sm text-red-600">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>
                </form>

                {/* Register Navigation */}
                <p className="mt-6 text-center text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-black underline"
                    >
                        Create account
                    </Link>
                </p>

            </div>
        </main>
    );
}