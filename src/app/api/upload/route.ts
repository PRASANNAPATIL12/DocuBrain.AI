// src/app/api/upload/route.ts
import {NextResponse} from 'next/server';
import pdf from 'pdf-parse';

export const runtime = 'nodejs';

async function parsePdf(file: File) {
  const fileBuffer = await file.arrayBuffer();
  const data = await pdf(Buffer.from(fileBuffer));
  return data.text;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({error: 'No file uploaded.'}, {status: 400});
    }

    let text = '';
    if (file.type === 'application/pdf') {
      text = await parsePdf(file);
    } else {
      text = await file.text();
    }

    return NextResponse.json({text});
  } catch (error) {
    console.error('Error parsing file:', error);
    return NextResponse.json(
      {error: 'Failed to parse file.'},
      {status: 500}
    );
  }
}
