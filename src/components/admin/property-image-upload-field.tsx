'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Loader2, Upload, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  PROPERTY_IMAGE_ACCEPT,
  PROPERTY_IMAGE_BUCKET,
  PROPERTY_IMAGE_MAX_BYTES,
  PROPERTY_IMAGE_MAX_COUNT,
  PROPERTY_IMAGE_MAX_MB,
  propertyImageStoragePath,
} from '@/lib/property-image-upload';
import { AGENT_FORM_LABEL_CLASS } from '@/lib/agent-dashboard-theme';
import { Label } from '@/components/ui/label';
import { cn } from '@/components/ui/utils';

type PropertyImageUploadFieldProps = {
  initialImages?: string[] | null;
  variant?: 'agent' | 'admin';
  onUploadingChange?: (uploading: boolean) => void;
};

export function PropertyImageUploadField({
  initialImages,
  variant = 'admin',
  onUploadingChange,
}: PropertyImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>(
    (initialImages ?? []).filter((url) => url && url.trim()),
  );
  const [uploadingCount, setUploadingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isAgent = variant === 'agent';
  const isUploading = uploadingCount > 0;
  const canAddMore = images.length < PROPERTY_IMAGE_MAX_COUNT;

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    setError(null);
    const files = Array.from(fileList);
    const remainingSlots = PROPERTY_IMAGE_MAX_COUNT - images.length;

    if (remainingSlots <= 0) {
      setError(`You can upload up to ${PROPERTY_IMAGE_MAX_COUNT} photos per listing.`);
      return;
    }

    const batch = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setError(`Only ${remainingSlots} more photo(s) can be added (max ${PROPERTY_IMAGE_MAX_COUNT}).`);
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be signed in to upload photos.');
      return;
    }

    const uploadedUrls: string[] = [];

    for (const file of batch) {
      if (!file.type.startsWith('image/')) {
        setError('Please choose image files only (JPG, PNG, or WebP).');
        continue;
      }

      if (file.size > PROPERTY_IMAGE_MAX_BYTES) {
        setError(`Each photo must be ${PROPERTY_IMAGE_MAX_MB}MB or smaller.`);
        continue;
      }

      setUploadingCount((count) => count + 1);

      try {
        const filePath = propertyImageStoragePath(user.id, file.name);
        const { error: uploadError } = await supabase.storage
          .from(PROPERTY_IMAGE_BUCKET)
          .upload(filePath, file, { contentType: file.type || 'image/jpeg', upsert: false });

        if (uploadError) {
          setError(
            uploadError.message.includes('Bucket not found')
              ? 'Photo storage is not set up yet. Run migration 019_property_images_storage.sql in Supabase.'
              : `Upload failed: ${uploadError.message}`,
          );
          continue;
        }

        const { data: publicData } = supabase.storage.from(PROPERTY_IMAGE_BUCKET).getPublicUrl(filePath);
        uploadedUrls.push(publicData.publicUrl);
      } finally {
        setUploadingCount((count) => Math.max(0, count - 1));
      }
    }

    if (uploadedUrls.length > 0) {
      setImages((current) => [...current, ...uploadedUrls]);
    }

    if (inputRef.current) inputRef.current.value = '';
  }

  function removeImage(index: number) {
    setImages((current) => current.filter((_, i) => i !== index));
    setError(null);
  }

  return (
    <div className="space-y-3 md:col-span-2">
      <Label htmlFor="property-images" className={isAgent ? AGENT_FORM_LABEL_CLASS : undefined}>
        Property photos
      </Label>
      <p className="text-sm text-[#6b7280]">
        Upload clear photos of the property. Add up to {PROPERTY_IMAGE_MAX_COUNT} images (max{' '}
        {PROPERTY_IMAGE_MAX_MB}MB each).
      </p>

      <input type="hidden" name="images" value={images.join('\n')} />

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#d1d5db] bg-white shadow-sm"
            >
              <Image src={url} alt="" fill className="object-cover" sizes="(max-width: 640px) 50vw, 200px" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/70"
                aria-label="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {canAddMore ? (
        <label
          htmlFor="property-images"
          className={cn(
            'flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center transition',
            isAgent
              ? 'border-[#d1d5db] bg-white hover:border-[#4b2e6f] hover:bg-[#faf8fc]'
              : 'border-input bg-input-background hover:border-ring',
            isUploading && 'pointer-events-none opacity-70',
          )}
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-[#4b2e6f]" />
          ) : (
            <Upload className="h-6 w-6 text-[#9ca3af]" strokeWidth={1.75} />
          )}
          <span className="font-sans text-sm font-semibold text-[#1F2A24]">
            {isUploading ? 'Uploading…' : images.length > 0 ? 'Add more photos' : 'Upload photos'}
          </span>
          <span className="font-sans text-xs text-[#9ca3af]">JPG, PNG, or WebP · tap to browse</span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#e5e7eb] px-3 py-1 text-xs text-[#6b7280]">
            <ImagePlus className="h-3.5 w-3.5" />
            {images.length}/{PROPERTY_IMAGE_MAX_COUNT}
          </span>
        </label>
      ) : null}

      <input
        ref={inputRef}
        id="property-images"
        type="file"
        accept={PROPERTY_IMAGE_ACCEPT}
        multiple
        className="sr-only"
        disabled={isUploading || !canAddMore}
        onChange={(event) => void uploadFiles(event.currentTarget.files)}
      />

      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
