import RolesElement from "@/components/RolesElement"
import { auth } from "@/auth"
import { getRoles } from "@/lib/seed"

const Roles = async () => {
  const session = await auth()
  const data = await getRoles(session?.user.token)
  return <RolesElement data={data} />
}

export default Roles