import LeftSidebar from "@/components/LeftSidebar";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth()
    return (
        <div className="flex h-screen ">
            <LeftSidebar isSidebarOpen={false} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar session={session} />

                <ScrollArea className="flex-1 overflow-y-auto p-2">
                    {children}
                </ScrollArea>
            </div>
        </div>
    );
}
