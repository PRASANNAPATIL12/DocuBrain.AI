
import {NextResponse} from 'next/server';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

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
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        text = result.value;
    } else if (file.type === 'text/plain') {
      text = fileBuffer.toString('utf8');
    } else {
        return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 });
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
