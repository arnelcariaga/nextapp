import Users from "@/components/CommunityOperationsElement/Users"
import { TCommunityOperativeUserParams } from "@/lib/types"
import { api_url } from "@/lib/urls"
import { auth } from "@/auth"

const CommunityOperationUsers = async ({ params }: TCommunityOperativeUserParams) => {
  const session = await auth()
  const role = String(session?.user.id_role)
  let data = [] as any;
  const token = session?.user.token
  const sai_id = session?.user.id_sai

  if (role === '1') {
    const res = await fetch(
      api_url + "/api/get_community_operation_users_by_operation_id",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          operation_id: params.id,
        }),
      }
    );
    const { data: resData, message, error } = await res.json()
    if (error) {
      throw Error(message)
    }
    data = resData
  } else {
    const res = await fetch(
      api_url + "/api/get_community_operation_users_by_sai_and_operation_id",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sai_id,
          operation_id: params.id,
        }),
      }
    );
    const { data: resData, message, error } = await res.json()
    if (error) {
      throw Error(message)
    }
    data = resData
  }

  return <Users data={data['community_operation_users']}  params={params}/>
}

export default CommunityOperationUsers