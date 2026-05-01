import { headers } from 'next/headers'
import { userAgent } from 'next/server'
import { redirect } from 'next/navigation'
import App from 'next/app'

export default async function Page() {
  const headersList = await headers()
  const { os } = userAgent({ headers: headersList })

  const osName = os.name?.toLowerCase() || ''
  const playStoreLink = "https://play.google.com/store/apps/details?id=com.tsakharliya.tsakharliya&hl=en"
  const appStoreLink = "https://apps.apple.com/us/app/tsakhar-liya/id6758496073"
  if (osName.includes('ios')) {
    redirect(appStoreLink)
  }

  if (osName.includes('android')) {
    redirect(playStoreLink)
  }

  if (osName.includes('windows')) {
    redirect(playStoreLink)
  }

  if (osName.includes('mac')) {
    redirect(appStoreLink)
  }

  // fallback
  redirect('https://play.google.com/store/apps/details?id=com.tsakharliya.tsakharliya&hl=en')
}