import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env')
  }

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return new Response('Error: Verification failed', { status: 400 })
  }

  // Handle the webhook
  const eventType = evt.type
  console.log(`Webhook received: ${eventType}`)

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    try {
      await prisma.userProfile.upsert({
        where: { clerkUserId: id },
        update: {
          name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
          email: email_addresses[0]?.email_address || '',
          profileImage: image_url,
        },
        create: {
          clerkUserId: id,
          name: `${first_name || ''} ${last_name || ''}`.trim() || 'User',
          email: email_addresses[0]?.email_address || '',
          profileImage: image_url,
        },
      })

      console.log(`✅ User ${id} synced successfully`)
      return new Response('User synced', { status: 200 })
    } catch (error) {
      console.error('Database error:', error)
      return new Response('Error: Database sync failed', { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      await prisma.userProfile.delete({
        where: { clerkUserId: id },
      })

      console.log(`✅ User ${id} deleted successfully`)
      return new Response('User deleted', { status: 200 })
    } catch (error) {
      console.error('Error deleting user:', error)
      return new Response('Error: Failed to delete user', { status: 500 })
    }
  }

  return new Response('Webhook received', { status: 200 })
}