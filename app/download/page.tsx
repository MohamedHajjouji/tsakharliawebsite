import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  const headersList = await headers()
  const userAgentHeader = headersList.get('user-agent') || ''

  const playStoreLink = "https://play.google.com/store/apps/details?id=com.tsakharliya.tsakharliya&hl=en"
  const appStoreLink = "https://apps.apple.com/app/tsakhar-lia/id6758496073"

  const ua = userAgentHeader.toLowerCase()

  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod') || ua.includes('mac os')) {
    redirect(appStoreLink)
  }

  if (ua.includes('android') || ua.includes('windows')) {
    redirect(playStoreLink)
  }

  // fallback
  redirect(playStoreLink)
}