import { Skeleton } from "@/components/ui/skeleton"

export default function Component() {
    return (
        <aside className={`bg-green-600 dark:bg-green-900 text-white w-72 space-y-2 py-[2.5%] px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
            <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-5 p-2">
                    {Array(13).fill(13).map((_, index) => (
                        <div key={index}>
                            <Skeleton className="h-[1px] w-full" />
                            <Skeleton className="h-8 w-full ml-5" />
                        </div>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}