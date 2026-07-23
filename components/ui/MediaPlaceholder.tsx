import Image from "next/image";

export type MediaAsset = {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly placeholder: boolean;
};

export function MediaPlaceholder({
  media,
  className = "",
  loading,
  sizes,
  priority = false,
}: {
  media: MediaAsset;
  className?: string;
  loading?: "eager" | "lazy";
  sizes: string;
  priority?: boolean;
}) {
  return (
    <figure className={`media-placeholder ${className}`.trim()}>
      <Image
        alt={media.alt}
        className="h-full w-full object-cover"
        height={media.height}
        loading={loading}
        priority={priority}
        sizes={sizes}
        src={media.src}
        width={media.width}
      />
    </figure>
  );
}
