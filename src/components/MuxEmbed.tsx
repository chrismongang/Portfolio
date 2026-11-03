import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";

type MuxEmbedProps = {
  playbackId: string;
  title: string;
  poster: string;
};

export function MuxEmbed({ playbackId, title, poster }: MuxEmbedProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="aspect-video w-full overflow-hidden bg-placeholder">
      {playing ? (
        <MuxPlayer
          playbackId={playbackId}
          autoPlay
          playsInline
          poster={poster}
          thumbnailTime={1}
          metadata={{ video_title: title }}
          className="film h-full w-full"
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
