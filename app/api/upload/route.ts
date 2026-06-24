// app/api/upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in request' }, { status: 400 });
    }

    // Convert file data to an array buffer for writing
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    /* ==========================================================================
       OPTION 1: VERCEL BLOB CLOUD UPLOAD (PRODUCTION ACTIVE STATE)
       Automatically runs if the secure read/write token is configured.
       ========================================================================== */
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Upload directly to Vercel's edge network
      const blob = await put(file.name, file, { 
        access: 'public',
        contentType: file.type 
      });

      return NextResponse.json({ 
        success: true, 
        url: blob.url,
        provider: 'Vercel Blob' 
      }, { status: 201 });
    }

    /* ==========================================================================
       OPTION 2: LOCAL DISK UPLOAD (DEVELOPMENT FALLBACK STATE)
       Gracefully falls back to public/uploads directory if offline or unconfigured.
       ========================================================================== */
    const uploadDirectory = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure nested folder structure exists locally
    await mkdir(uploadDirectory, { recursive: true });

    // Generate randomized web-safe file path name
    const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const destinationPath = path.join(uploadDirectory, cleanFileName);

    // Save image to local disk
    await writeFile(destinationPath, buffer);

    // Provide relative browser-accessible endpoint URL
    const fileUrl = `/uploads/${cleanFileName}`;

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      provider: 'Local Storage Fallback'
    }, { status: 201 });

  } catch (error) {
    console.error("Image upload processing failure:", error);
    return NextResponse.json({ error: 'System failed to upload asset' }, { status: 500 });
  }
}