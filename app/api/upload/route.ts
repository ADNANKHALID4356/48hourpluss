// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in request' }, { status: 400 });
    }

    // Convert file data to node stream
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    /* ==========================================================================
       PHASE 1: Local Development Storage System
       Saves files to public/uploads directory.
       ========================================================================== */
    const uploadDirectory = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure nested folder structure exists
    await mkdir(uploadDirectory, { recursive: true });

    // Generate randomized web-safe file path name
    const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const destinationPath = path.join(uploadDirectory, cleanFileName);

    // Save image to filesystem
    await writeFile(destinationPath, buffer);

    // Provide relative browser-accessible endpoint URL
    const fileUrl = `/uploads/${cleanFileName}`;

    /* ==========================================================================
       PHASE 2: Cloud Storage Integration (Optional Production Swap-out)
       For serverless hosting (Vercel), uncomment and configure your cloud bucket:
       
       // Example - Vercel Blob:
       // import { put } from '@vercel/blob';
       // const blob = await put(file.name, file, { access: 'public' });
       // const fileUrl = blob.url;

       // Example - Cloudinary:
       // const uploadResult = await uploadToCloudinary(buffer);
       // const fileUrl = uploadResult.secure_url;
       ========================================================================== */

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      provider: process.env.NODE_ENV === 'production' ? 'Production cloud warning' : 'Local system'
    }, { status: 201 });

  } catch (error) {
    console.error("Image upload processing failure:", error);
    return NextResponse.json({ error: 'System failed to upload asset' }, { status: 500 });
  }
}