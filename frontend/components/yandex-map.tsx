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
  mapId: string; // Unique ID for the map container
}

export function YandexMap({ places, size, mapId }: YandexMapProps) {
  useEffect(() => {
    const loadYandexMaps = () => {
      return new Promise((resolve, reject) => {
        if (window.ymaps) {
          resolve(window.ymaps);
          return;
        }

        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY}`;
        script.async = true;
        script.onload = () => resolve(window.ymaps);
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    loadYandexMaps().then(() => {
      window.ymaps.ready(init);
    });

    function init() {
      const validPlaces = places.filter((place) => {
        if (!place.geo) return false;
        const geoParts = place.geo.split(',');
        return (
          geoParts.length === 2 && !isNaN(+geoParts[0]) && !isNaN(+geoParts[1])
        );
      });

      const mapCenter =
        validPlaces.length > 0
          ? [
              validPlaces.reduce(
                (acc, place) => acc + +place.geo!.split(',')[0],
                0,
              ) / validPlaces.length,
              validPlaces.reduce(
                (acc, place) => acc + +place.geo!.split(',')[1],
                0,
              ) / validPlaces.length,
            ]
          : [55.751574, 37.573856];

      const zoomLevel = validPlaces.length <= 1 ? 15 : 10;

      const myMap = new window.ymaps.Map(mapId, {
        center: mapCenter,
        zoom: zoomLevel,
      });

      validPlaces.forEach((place) => {
        const geoParts = place.geo!.split(',');
        const myPlacemark = new window.ymaps.Placemark(
          [+geoParts[0], +geoParts[1]],
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
        myMap.geoObjects.add(myPlacemark);
      });
    }

    return () => {
      const mapContainer = document.getElementById(mapId);
      if (mapContainer) mapContainer.innerHTML = '';
    };
  }, [places, mapId]);

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
        id={mapId}
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
