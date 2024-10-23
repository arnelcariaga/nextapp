import Users from "@/components/CommunityOperationsElement/Users"
import { TCommunityOperativeUserParams } from "@/lib/types"

const CommunityOperationUsers = ({ params }: TCommunityOperativeUserParams) => {
  return <Users params={params} />
}

export default CommunityOperationUsers