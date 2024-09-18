import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

export default function FormSkeleton() {
    return (
        <>
            <div className='grid grid-cols-3 grid-rows-3 gap-4'>
                {[...Array(10)].map((_, index) => (
                    <div key={index}>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <div className="relative">
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                ))}
            </div>
            <Skeleton className="h-10 w-full mt-5" />
        </>
    )
}