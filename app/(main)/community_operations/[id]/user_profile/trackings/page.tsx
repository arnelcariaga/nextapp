import UserTrackings from "@/components/CommunityOperationsElement/UserProfile/UserTrackings"
import { TCommunityOperativeUserParams } from "@/lib/types"

const Trackings = ({params}: TCommunityOperativeUserParams) => {
  return <UserTrackings params={params} />
}

export default Trackings