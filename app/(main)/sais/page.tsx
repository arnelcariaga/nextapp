import SAIsElement from '@/components/SAIsElement'
import { auth } from '@/auth'
import { getSais } from '@/lib/seed'

const Sais = async () => {
  const session = await auth()
  const data = await getSais(session?.user.token)

  return (
    <SAIsElement data={data} session={session} />
  )
}

export default Sais