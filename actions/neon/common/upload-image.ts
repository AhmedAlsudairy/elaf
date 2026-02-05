'use server'

import { put } from '@vercel/blob';
import { auth } from '@clerk/nextjs/server';

export async function uploadImage(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return { url: blob.url };
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(url: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const { del } = await import('@vercel/blob');
    await del(url);
    return { success: true };
  } catch (error) {
    console.error('Error deleting from Vercel Blob:', error);
    throw new Error('Failed to delete image');
  }
}