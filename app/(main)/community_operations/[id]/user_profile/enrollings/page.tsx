import UserEnrollings from "@/components/CommunityOperationsElement/UserProfile/UserEnrollings"
import { TCommunityOperativeUserParams } from "@/lib/types"
import { auth } from "@/auth"
import { getUserDetails } from "@/lib/seed"
import { api_url } from "@/lib/urls"

const Enrollings = async ({ params }: TCommunityOperativeUserParams) => {
  const session = await auth()
  const token = session?.user.token
  const sai_id = Number(session?.user.id_sai)
  const rol_id = Number(session?.user.id_role)

  // shared in another components
  const data = await getUserDetails(sai_id, rol_id, params.id, token)

  const res = await fetch(
    api_url + `/api/get_user_community_operation_user_enrollings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: params.id }),
    }
  );
  const { data: enrollingssData } = await res.json();

  return <UserEnrollings
    params={params}
    data={data}
    communityOperationUserEnrollingsData={enrollingssData}
    session={session}
  />
}

export default Enrollings