import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import TableSkeleton from "./TableSkeleton"

const CommunityOperationUserTrackingsSkeleton = () => {
    return (
        <div className="w-full p-2">
            <Card className="mb-5">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <TableSkeleton />
        </div>
    )
}

export default CommunityOperationUserTrackingsSkeleton