/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { CarouselApi } from '@/components/ui/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { useBlog } from '@/hooks/use-blog';

export function BlogCarousel() {
  const { blogs: data, isLoading } = useBlog(1);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    updateSelection();
    carouselApi.on('select', updateSelection);
    return () => {
      carouselApi.off('select', updateSelection);
    };
  }, [carouselApi]);

  if (isLoading) return <h1>loading</h1>;
  return (
    <section className='py-12'>
      <div>
        <div className='mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16'>
          <div>
            <h2 className='mb-3 text-xl font-semibold md:mb-4 md:text-4xl lg:mb-6'>
              Blogs
            </h2>
            <a
              href='#'
              className='group flex items-center text-xs font-medium md:text-base lg:text-lg'
            >
              See all{' '}
              <ArrowRight className='ml-2 size-4 transition-transform group-hover:translate-x-1' />
            </a>
          </div>
          <div className='mt-8 flex shrink-0 items-center justify-center gap-2'>
            <Button
              size='icon'
              variant='outline'
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className='disabled:pointer-events-auto'
            >
              <ArrowLeft className='size-5' />
            </Button>
            <Button
              size='icon'
              variant='outline'
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className='disabled:pointer-events-auto'
            >
              <ArrowRight className='size-5' />
            </Button>
          </div>
        </div>
      </div>
      <div className='w-full'>
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              '(max-width: 768px)': {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent>
            {data?.map((item: any) => (
              <CarouselItem
                key={item.uuid}
                className='pl-[20px] md:max-w-[452px]'
              >
                <a
                  href={`blogs/${item.slug}`}
                  className='group flex flex-col justify-between'
                >
                  <div>
                    <div className='flex aspect-[3/2] text-clip rounded-xl'>
                      <div className='flex-1'>
                        <div className='relative size-full origin-bottom transition duration-300 group-hover:scale-105'>
                          <Image
                            layout='fill'
                            objectFit='cover'
                            objectPosition='center'
                            src={item.thumbnail}
                            alt={item.title}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mb-2 line-clamp-3 break-words pt-4 text-lg font-medium md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl'>
                    {item.title}
                  </div>
                  <div className='flex items-center text-sm'>
                    Read more{' '}
                    <ArrowRight className='ml-2 size-5 transition-transform group-hover:translate-x-1' />
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
