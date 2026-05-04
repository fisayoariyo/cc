export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDocumentDisplayName(
  documentType: string | null | undefined,
  filePath: string | null | undefined,
): string {
  const normalizedType = (documentType ?? '').trim();
  if (normalizedType && normalizedType.toLowerCase() !== 'general') {
    return normalizedType;
  }

  const fileName = decodeURIComponent(filePath?.split('/').pop() ?? '')
    .replace(/^\d+_/, '')
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .trim();

  return fileName || 'Document';
}
