/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";

export function Videos({ data }: any) {
  const videos = data;
  return (
    <section className="py-2">
      <div className="w-full grid gap-2 grid-cols-2  lg:grid-cols-4">
        {videos.map((item: any) => {
          return (
            <div key={item.uuid} className="pl-[20px] max-w-[352px]">
              <a
                href={`video-podcasts/${item.uuid}`}
                className="group flex flex-col justify-between"
              >
                <div>
                  <div className="flex aspect-[3/2] text-clip">
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
