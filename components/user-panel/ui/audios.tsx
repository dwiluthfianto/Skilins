/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { useAudio } from "@/hooks/use-audio";
import Image from "next/image";
import { LoadingContent3 } from "./skeletons/skeleton-card";

export function Audios() {
  const { audios, isLoading } = useAudio(1);
  if (isLoading) return <LoadingContent3 />;
  return (
    <section className="py-2">
      <div className="flex flex-col gap-10 mb-8">
        <div className="flex gap-4 flex-col items-start">
          <div>
            <Badge>Contents</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
              Audio Podcasts
            </h2>
            <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground  text-left">
              Voices that Inspire, Stories that Connect.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {audios.map((item: any) => {
          return (
            <div key={item.uuid} className="pl-[20px] max-w-[250px]">
              <a
                href={`audio-podcasts/${item.uuid}`}
                className="group flex flex-col justify-between"
              >
                <div>
                  <div className="flex aspect-[1/1] text-clip">
                    <div className="flex-1">
                      <div className="relative size-full origin-bottom transition duration-300 group-hover:scale-105">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          layout="fill"
                          objectFit="cover"
                          objectPosition="center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-2 line-clamp-3 break-words pt-4 text-base font-semibold md:mb-3 md:pt-4 lg:pt-4 lg:text-md">
                  {item.title}
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
