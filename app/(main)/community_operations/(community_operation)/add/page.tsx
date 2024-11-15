import AddCommunityOperationForm from "@/components/CommunityOperationsElement/AddCommunityOperationForm"
import { auth } from "@/auth"
import { api_url } from "@/lib/urls"

const AddCommunityOperation = async () => {
  const session = await auth()

  const provincesRes = await fetch(api_url + '/api/provinces', {
    headers: {
      Authorization: `Bearer ${session?.user.token}`,
    }
  })

  const { data: provincesData, message, error } = await provincesRes.json()

  if (error) {
    throw Error(message)
  }

  return <AddCommunityOperationForm provinces={provincesData} session={session} />
}

export default AddCommunityOperation