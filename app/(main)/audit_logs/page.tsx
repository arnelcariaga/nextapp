import AuditLogsElement from '@/components/AuditLogsElement'
import { auth } from '@/auth'
import { api_url } from '@/lib/urls'

const AuditLogs = async () => {
  const session = await auth()

  const res = await fetch(api_url + '/api/activity_logs', {
    headers: {
      Authorization: `Bearer ${session?.user.token}`,
    }
  })

  const { data, message, error } = await res.json()

  if (error) {
    throw Error(message)
  }

  return (
    <AuditLogsElement data={data} />
  )
}

export default AuditLogs