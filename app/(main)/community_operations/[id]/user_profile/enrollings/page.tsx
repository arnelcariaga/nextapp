import UserEnrollings from "@/components/CommunityOperationsElement/UserProfile/UserEnrollings"
import { TCommunityOperativeUserParams } from "@/lib/types"

const Enrollings = ({ params }: TCommunityOperativeUserParams) => {
  return <UserEnrollings params={params} />
}

export default Enrollings