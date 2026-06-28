import { getVideoEmbedUrl, isDirectVideoFile } from '@/lib/success-stories';

export function SuccessStoryVideo({
  url,
  poster,
  title,
}: {
  url: string;
  poster?: string | null;
  title: string;
}) {
  const embedUrl = getVideoEmbedUrl(url);

  if (embedUrl) {
    return (
      <div className="overflow-hidden rounded-[28px] border border-border/70 bg-black shadow-sm">
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    );
  }

  if (isDirectVideoFile(url)) {
    return (
      <div className="overflow-hidden rounded-[28px] border border-border/70 bg-black shadow-sm">
        <video
          controls
          preload="metadata"
          playsInline
          poster={poster ?? undefined}
          className="aspect-video h-full w-full object-cover"
        >
          <source src={url} />
        </video>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex rounded-full border border-[#d7c8eb] bg-[#f7f3fb] px-4 py-2 text-sm font-medium text-[#4b2e6f] hover:bg-[#efe8f7]"
    >
      Open video
    </a>
  );
}
