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
  sizes,
  priority = false,
}: {
  media: MediaAsset;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <figure className={`media-placeholder ${className}`.trim()}>
      <Image
        alt={media.alt}
        className="h-full w-full object-cover"
        height={media.height}
        priority={priority}
        sizes={sizes}
        src={media.src}
        width={media.width}
      />
      {media.placeholder ? (
        <figcaption className="media-placeholder-label">
          Replaceable image
        </figcaption>
      ) : null}
    </figure>
  );
}
