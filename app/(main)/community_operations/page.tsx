import { Suspense } from 'react'
import CommunityOperationsElement from '@/components/CommunityOperationsElement'
import { auth } from "@/auth"
import { api_url } from "@/lib/urls"
import TableSkeleton from '@/components/TableSkeleton'

const CommunityOperations = async () => {
  const session = await auth()
  const role = String(session?.user.id_role)
  const token = session?.user.token
  const sai_id = session?.user.id_sai
  let data = [] as any;

  if (role === '1') {
    const res = await fetch(api_url + '/api/get_community_operations', {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })

    const { data: resData, message, error } = await res.json()
    if (error) {
      throw Error(message)
    }
    data = resData
  } else {
    const res = await fetch(api_url + "/api/get_community_operations_by_sai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sai_id,
      }),
    });
    const { data: resData, message, error } = await res.json()

    if (error) {
      throw Error(message)
    }
    data = resData[0]['community_operations']
  }

  return <Suspense fallback={<TableSkeleton />}>
    <CommunityOperationsElement data={data} session={session} />
  </Suspense>
}

export default CommunityOperations