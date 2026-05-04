import { NextResponse } from 'next/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { createClient } from '@/lib/supabase/server';

function getDownloadFileName(filePath: string, documentType: string | null) {
  const lastSegment = decodeURIComponent(filePath.split('/').pop() ?? 'document');
  const cleanedFileName = lastSegment.replace(/^\d+_/, '');

  if (cleanedFileName.includes('.')) {
    return cleanedFileName;
  }

  const normalizedType =
    documentType?.trim().replace(/[^\w.-]+/g, '_').toLowerCase() || 'document';

  return `${normalizedType}.bin`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const viewer = await getViewerContext();
  if (!viewer) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { documentId } = await params;
  const supabase = await createClient();
  const { data: document, error: documentError } = await supabase
    .from('application_documents')
    .select('id, client_id, file_path, document_type')
    .eq('id', documentId)
    .maybeSingle();

  if (documentError || !document) {
    return NextResponse.json(
      { error: documentError?.message || 'Document not found.' },
      { status: 404 },
    );
  }

  if (viewer.role !== 'admin' && document.client_id !== viewer.userId) {
    return NextResponse.json({ error: 'Not allowed.' }, { status: 403 });
  }

  const { data: file, error: downloadError } = await supabase.storage
    .from('application-documents')
    .download(document.file_path);

  if (downloadError || !file) {
    return NextResponse.json(
      { error: downloadError?.message || 'Could not download document.' },
      { status: 404 },
    );
  }

  return new NextResponse(file, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Disposition': `attachment; filename="${getDownloadFileName(
        document.file_path,
        document.document_type,
      )}"`,
      'Content-Type': file.type || 'application/octet-stream',
    },
  });
}
