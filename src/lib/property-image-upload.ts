export const PROPERTY_IMAGE_BUCKET = 'property-images';
export const PROPERTY_IMAGE_MAX_MB = 5;
export const PROPERTY_IMAGE_MAX_BYTES = PROPERTY_IMAGE_MAX_MB * 1024 * 1024;
export const PROPERTY_IMAGE_MAX_COUNT = 12;
export const PROPERTY_IMAGE_ACCEPT = 'image/png,image/jpeg,image/jpg,image/webp';

export function cleanPropertyImageFileName(name: string) {
  return name.replace(/[^\w.-]+/g, '_');
}

export function propertyImageStoragePath(userId: string, fileName: string) {
  const ext = fileName.includes('.') ? fileName.split('.').pop() : 'jpg';
  const safeName = cleanPropertyImageFileName(fileName || `photo.${ext}`);
  return `${userId}/${Date.now()}_${safeName}`;
}
