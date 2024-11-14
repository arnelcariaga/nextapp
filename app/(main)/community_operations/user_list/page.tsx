import { Suspense } from "react";
import { auth } from "@/auth"
import { api_url } from "@/lib/urls"
import Loading from "../loading";

import UserList from '@/components/CommunityOperationsElement/UserList'

const CommunityOperationsUserList = async () => {
    const session = await auth()

    const res = await fetch(api_url + '/api/get_all_community_operation_users', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user.token}`,
        },
        body: JSON.stringify({
            sai_id: Number(session?.user.id_sai),
            rol_id: Number(session?.user.id_role),
        }),
    })

    const { data, message, error } = await res.json()

    if (error) {
        throw Error(message)
    }

    return <Suspense fallback={<Loading />}>
        <UserList data={data} session={session} />
    </Suspense>
}

export default CommunityOperationsUserList