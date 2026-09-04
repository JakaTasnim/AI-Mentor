"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await apiRequest("/users/register", {
                method: "POST",
                body: JSON.stringify(formData)
            });

            router.push("/login");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-4"
            >
                <h1 className="text-2xl font-bold">
                    Create Account
                </h1>

                <input
                    name="fullName"
                    placeholder="Full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border p-3"
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-3"
                />

                <input
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full border p-3"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border p-3"
                />

                {error && (
                    <p className="text-red-500">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white p-3"
                >
                    {loading ? "Creating..." : "Register"}
                </button>
            </form>
        </main>
    );
}