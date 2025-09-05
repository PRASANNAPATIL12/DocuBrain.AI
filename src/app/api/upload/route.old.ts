// src/app/api/upload/route.ts
import {NextResponse} from 'next/server';
import {parse} from 'pdf-parse';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({error: 'No file uploaded.'}, {status: 400});
    }

    const fileBuffer = await file.arrayBuffer();
    const data = await parse(fileBuffer);

    return NextResponse.json({text: data.text});
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json(
      {error: 'Failed to parse PDF.'},
      {status: 500}
    );
  }
}
