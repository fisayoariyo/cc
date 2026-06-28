'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { AGENT_FIELD_ERROR } from '@/components/auth/agent-auth-styles';
import { cn } from '@/components/ui/utils';

const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ACCEPT = 'image/png,image/jpeg,image/jpg,image/webp';

type AgentProfilePhotoFieldProps = {
  existingPhotoUrl?: string | null;
  onFileChange?: (file: File | null) => void;
};

export function AgentProfilePhotoField({ existingPhotoUrl, onFileChange }: AgentProfilePhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingPhotoUrl ?? null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const helperText = fileName || `JPG, JPEG, PNG less than ${MAX_MB}MB`;

  function clearSelection() {
    setSelectedFile(null);
    setFileName('');
    setPreviewUrl(existingPhotoUrl ?? null);
    setFileError(null);
    onFileChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  function handleFile(file: File | null) {
    if (!file) {
      clearSelection();
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFileError('Please choose an image file (JPG, JPEG, or PNG).');
      return;
    }

    if (file.size > MAX_BYTES) {
      setFileError(`Photo must be ${MAX_MB}MB or smaller.`);
      return;
    }

    setFileError(null);
    setSelectedFile(file);
    setFileName(file.name);
    onFileChange?.(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return objectUrl;
    });
  }

  return (
    <div>
      <p className="font-sans text-sm font-medium text-[#111827]">Upload your image</p>
      <p className="mt-1 font-sans text-sm text-[#111827]">
        Please upload a recent passport photograph with a plain white background.
      </p>

      <label
        htmlFor="photo"
        className={cn(
          'relative mt-4 flex h-[188px] w-full max-w-[360px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[20px] border border-dashed border-[#e5e7eb] bg-white text-center',
        )}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Selected profile preview"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 px-5 text-center">
          {previewUrl ? (
            <>
              <span className="font-sans text-sm font-semibold text-[#111827]">Change photo</span>
              <span className="font-sans text-xs text-[#6b7280]">{helperText}</span>
            </>
          ) : (
            <>
              <Upload size={24} className="mb-3 text-[#9ca3af]" strokeWidth={1.75} />
              <span className="rounded-full border border-[#e5e7eb] px-4 py-1 font-sans text-xs text-[#6b7280]">
                Click to upload
              </span>
              <span className="mt-2 font-sans text-xs text-[#9ca3af]">{helperText}</span>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          id="photo"
          name="photo"
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => handleFile(e.currentTarget.files?.[0] ?? null)}
        />
      </label>

      {fileError ? (
        <p className={cn(AGENT_FIELD_ERROR, 'mt-2')} role="alert">
          {fileError}
        </p>
      ) : null}

      {!selectedFile && existingPhotoUrl ? (
        <input type="hidden" name="has_existing_photo" value="1" />
      ) : null}
    </div>
  );
}

export function validateAgentProfilePhotoSelection(
  selectedFile: File | null,
  hasExistingPhoto: boolean,
): string | null {
  if (selectedFile) return null;
  if (hasExistingPhoto) return null;
  return 'Please upload a profile photo.';
}
