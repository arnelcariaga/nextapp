import UserProfile from "@/components/CommunityOperationsElement/UserProfile"
import { TCommunityOperativeUserParams } from "@/lib/types"
import { auth } from "@/auth";
import { getUserDetails } from "@/lib/seed";

const CommunityOperationUserProfile = async ({ params }: TCommunityOperativeUserParams) => {
    const session = await auth()
    const token = session?.user.token
    const sai_id = Number(session?.user.id_sai)
    const rol_id = Number(session?.user.id_role)
    const data = await getUserDetails(sai_id, rol_id, params.id, token)

    return <UserProfile params={params} data={data} />
}

export default CommunityOperationUserProfile