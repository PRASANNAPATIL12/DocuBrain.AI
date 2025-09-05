
import {NextResponse} from 'next/server';
import {LlamaParse} from 'llamaparse';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({error: 'No file uploaded.'}, {status: 400});
    }

    let text = '';
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'text/plain') {
        const llamaParse = new LlamaParse({
            apiKey: process.env.LLAMA_CLOUD_API_KEY, // You need to set this environment variable
            resultType: "text"
        });

        const documents = await llamaParse.loadData(file);
        if (documents && documents.length > 0) {
            text = documents.map(doc => doc.text).join('\n\n');
        } else {
            throw new Error("LlamaParse failed to extract text from the document.");
        }
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
