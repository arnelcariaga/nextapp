import UserTrackings from "@/components/CommunityOperationsElement/UserProfile/UserTrackings"
import { TCommunityOperativeUserParams } from "@/lib/types"
import { auth } from "@/auth"
import { getUserDetails } from "@/lib/seed"
import { api_url } from "@/lib/urls"

const Trackings = async ({ params }: TCommunityOperativeUserParams) => {
  const session = await auth()
  const token = session?.user.token
  const sai_id = Number(session?.user.id_sai)
  const rol_id = Number(session?.user.id_role)

  // shared in another components
  const data = await getUserDetails(sai_id, rol_id, params.id, token)

  const res = await fetch(
    api_url + `/api/get_user_community_operation_user_trackings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: params.id }),
    }
  );
  const { data: trackingsData } = await res.json();

  return <UserTrackings params={params} data={data} communityOperationUserTrackingsData={trackingsData} />
}

export default Trackings