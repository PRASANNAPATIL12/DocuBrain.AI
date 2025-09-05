// src/app/api/upload/route.ts
import {NextResponse} from 'next/server';
import pdf from 'pdf-parse';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({error: 'No file uploaded.'}, {status: 400});
    }

    let text = '';
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    if (file.type === 'application/pdf') {
      const data = await pdf(fileBuffer);
      text = data.text;
    } else {
      text = fileBuffer.toString('utf8');
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
