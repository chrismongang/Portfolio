import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useRef, useState } from "react";

type LoopVideoProps = {
  playbackId: string;
  title: string;
};

export function LoopVideo({ playbackId, title }: LoopVideoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const poster = `https://image.mux.com/${playbackId}/thumbnail.webp?time=1`;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(motion.matches);
    updateMotion();
    motion.addEventListener("change", updateMotion);

    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);

    return () => {
      motion.removeEventListener("change", updateMotion);
      observer.disconnect();
    };
  }, []);

  const shouldPlay = inView && !reduceMotion;

  return (
    <div
      ref={rootRef}
      className="aspect-video w-full overflow-hidden bg-placeholder"
    >
      {shouldPlay ? (
        <MuxPlayer
          playbackId={playbackId}
          autoPlay="muted"
          muted
          loop
          playsInline
          nohotkeys
          preload="metadata"
          thumbnailTime={1}
          poster={poster}
          metadata={{ video_title: title }}
          className="h-full w-full"
        />
      ) : (
        <img
          src={poster}
          alt=""
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
