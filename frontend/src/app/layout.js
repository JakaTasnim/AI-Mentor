import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
    title: "AI Mentor",
    description: "AI Mentor Application"
};

export default function RootLayout({
    children
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}