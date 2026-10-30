import { useState } from "react";

type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  poster: string;
};

const playerParams = new URLSearchParams({
  autoplay: "1",
  controls: "0",
  rel: "0",
  modestbranding: "1",
  iv_load_policy: "3",
  fs: "0",
  disablekb: "1",
  playsinline: "1",
  cc_load_policy: "0",
});

export function YouTubeEmbed({ videoId, title, poster }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?${playerParams}`;

  return (
    <div className="aspect-video w-full overflow-hidden bg-placeholder">
      {playing ? (
        <iframe
          className="h-full w-full border-0"
          src={src}
          title={title}
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          className="group relative block h-full w-full"
          onClick={() => setPlaying(true)}
          aria-label={`${title} abspielen`}
        >
          <img src={poster} alt="" className="h-full w-full object-cover" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-button text-ink group-hover:bg-[#e8e8e8]">
              <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" aria-hidden="true">
                <path fill="currentColor" d="M8 5.5v13l11-6.5-11-6.5z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
