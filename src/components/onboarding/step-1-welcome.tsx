'use client';

import React, { useRef, useEffect } from 'react';
import { VideoPlayer } from '@fluencypassdevs/cycle';
import { useOnboardingStore } from '@/store/use-onboarding-store';

export function Step1Welcome() {
  const { userName, setVideoWatched } = useOnboardingStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onEnded = () => setVideoWatched(true);

    // Wait for the video element to mount inside VideoPlayer
    const observer = new MutationObserver(() => {
      const video = container.querySelector('video');
      if (video) {
        video.addEventListener('ended', onEnded);
        observer.disconnect();
      }
    });

    const video = container.querySelector('video');
    if (video) {
      video.addEventListener('ended', onEnded);
    } else {
      observer.observe(container, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      container.querySelector('video')?.removeEventListener('ended', onEnded);
    };
  }, [setVideoWatched]);

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-6 lg:gap-8 animate-fade-in-up py-4 lg:py-8">
      {/* Header */}
      <div className="space-y-3 text-center lg:text-left">
        <p className="text-primary font-semibold text-xl lg:text-2xl">
          Olá, {userName},
        </p>
        <h2 className="text-2xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
          Sua jornada rumo à fluência começa agora.
        </h2>
        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-2xl">
          No vídeo abaixo a gente explica a lógica do curso e como tirar o melhor proveito dele.
        </p>
      </div>

      {/* Video */}
      <div ref={containerRef} className="w-full aspect-video rounded-2xl overflow-hidden ring-1 ring-border hover:ring-2 hover:ring-primary/30 transition-all">
        <VideoPlayer
          src="https://pub-457a0052e8424c87924878ef99fd9914.r2.dev/onboarding/video.mp4"
          poster="/images/thumb_05s.jpg"
          captions={[
            {
              src: '/subtitles.vtt',
              language: 'pt-BR',
              label: 'Português',
              default: true,
            },
          ]}
        />
      </div>
    </div>
  );
}
