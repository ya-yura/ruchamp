import { Button } from '@/components/ui/button';
import { TypeEvent } from '@/lib/definitions';
import { getRandomInt, transformDate } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export function CardEvent({ event }: { event: TypeEvent }) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const router = useRouter();

  return (
    <li className="flex h-[450px] w-full cursor-default flex-col overflow-hidden rounded-xl bg-[#292929] transition-shadow hover:shadow-[0px_5px_30px_0px_rgba(0,0,0,0.5)]">
      <div className="relative h-[60%] w-full px-9 py-8">
        <Image
          className="opacity-30"
          src={`/ru/images/mock-event-bg/${getRandomInt(9)}.avif`}
          alt={event.name}
          fill={true}
          style={{ objectFit: 'cover' }}
        />
        <h3 className="relative mx-auto mb-3 line-clamp-3 text-4xl font-bold">
          {event.name}
        </h3>
        <p className="relative line-clamp-2 text-sm">{event.event_system}</p>
      </div>
      <div className="flex flex-col justify-between px-4 py-3">
        <div className="mb-3 flex items-center justify-start gap-5">
          <Image
            className=""
            src="/ru/images/icon-loop.png"
            alt={'Иконка'}
            width={25}
            height={25}
          />
          <div className="flex flex-col">
            <p className="text-sm font-semibold">
              {/* {formatDate(event.start_datetime)} */}
              {transformDate(event.start_datetime)}
            </p>
            <p className="line-clamp-1 text-[#ADADAD]">{event.location}</p>
          </div>
        </div>
        <p className="line-clamp-2">{event.event_order}</p>
      </div>
      <div className="flex justify-end gap-5 px-4">
        <Button
          className="border-none bg-transparent p-0 hover:border-none hover:bg-transparent"
          variant="outline"
          onClick={() => setIsLiked(!isLiked)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isLiked ? 'white' : 'none'}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.62 20.8096C12.28 20.9296 11.72 20.9296 11.38 20.8096C8.48 19.8196 2 15.6896 2 8.68961C2 5.59961 4.49 3.09961 7.56 3.09961C9.38 3.09961 10.99 3.97961 12 5.33961C13.01 3.97961 14.63 3.09961 16.44 3.09961C19.51 3.09961 22 5.59961 22 8.68961C22 15.6896 15.52 19.8196 12.62 20.8096Z"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <Button
          variant="ruchampDefault"
          onClick={() => router.push('/ru/event')}
        >
          Подробнее
        </Button>
      </div>
    </li>
  );
}
