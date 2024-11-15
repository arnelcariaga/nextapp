import UsersElement from '@/components/UsersElement'
import { auth } from '@/auth'
import { api_url } from '@/lib/urls'

const Users = async () => {
  const session = await auth()

  const res = await fetch(api_url + '/api/users', {
    headers: {
      Authorization: `Bearer ${session?.user.token}`,
    }
  })

  const { data, message, error } = await res.json()

  if (error) {
    throw Error(message)
  }

  return (
    <UsersElement data={data} session={session} />
  )
}

export default Users