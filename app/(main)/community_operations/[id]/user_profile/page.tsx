import UserProfile from "@/components/CommunityOperationsElement/UserProfile"
import { TCommunityOperativeUserParams } from "@/lib/types"

const CommunityOperationUserProfile = ({ params }: TCommunityOperativeUserParams) => {
    return <UserProfile params={params} />
}

export default CommunityOperationUserProfile