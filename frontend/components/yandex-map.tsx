import { Event } from '@/lib/definitions';
import { useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import { H5 } from './text';

interface MapSize {
  width: string;
  height: string;
}

interface YandexMapProps {
  places: Event[];
  size?: MapSize;
}

export function YandexMap({ places, size }: YandexMapProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY}`;
    script.async = true;

    document.body.appendChild(script);

    script.addEventListener('load', () => {
      // @ts-ignore
      window.ymaps.ready(init);
    });

    function init() {
      const avgX =
        places.reduce((acc, place) => acc + +place.geo.split(',')[0], 0) /
        places.length;
      const avgY =
        places.reduce((acc, place) => acc + +place.geo.split(',')[1], 0) /
        places.length;
      const zoom = places.length <= 1 ? 15 : 4;

      // @ts-ignore
      var myMap = new window.ymaps.Map('map', {
        center: [avgX, avgY],
        zoom: zoom,
      });
      // Add placemarks for each location
      places.forEach((place) => {
        // @ts-ignore
        const myPlacemark = new window.ymaps.Placemark(
          [+place.geo.split(',')[0], +place.geo.split(',')[1]],
          {
            hintContent: place.name || '',
            balloonContentHeader: place.name || '',
            balloonContentBody: place.location || '',
          },
          {
            preset: 'islands#icon',
            iconColor: '#0F6CBD',
          },
        );
        // Add the placemark to the map
        myMap.geoObjects.add(myPlacemark);
      });
    }

    return () => {
      document.body.removeChild(script);
    };
  }, [places]);

  return (
    <div
      className="relative flex overflow-hidden rounded-md"
      style={{ width: size?.width || '100%', height: size?.height || '400px' }}
    >
      <Skeleton
        className="absolute z-0"
        style={{
          width: size?.width || '100%',
          height: size?.height || '400px',
        }}
      />
      <div
        id="map"
        className="absolute z-10"
        style={{
          width: size?.width || '100%',
          height: size?.height || '400px',
        }}
      ></div>
      {places.length === 0 && (
        <div
          className="absolute z-10 flex items-center justify-center rounded-md bg-muted"
          style={{
            width: size?.width || '100%',
            height: size?.height || '400px',
          }}
        >
          <H5 className="text-muted-foreground">Ничего не найдено</H5>
        </div>
      )}
    </div>
  );
}
