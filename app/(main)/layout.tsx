import LeftSidebar from "@/components/LeftSidebar";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth()
    return (
        <SessionProvider>
            <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
                <LeftSidebar />

                <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar session={session} />

                    <div className="relative h-full overflow-hidden">
                        <div className="absolute inset-0 overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </SessionProvider>
    );
}
