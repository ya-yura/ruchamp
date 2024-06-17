import React, { useEffect, useRef } from 'react';

interface YandexMapProps {
  coordinates: [number, number];
  setCoordinates: (coordinates: [number, number]) => void;
  className?: string;
  mapId: string; // Unique ID for the map container
}

declare global {
  interface Window {
    ymaps: any;
    ymapsLoaded: boolean;
  }
}

export function YandexMapPicker({
  coordinates,
  setCoordinates,
  className,
  mapId,
}: YandexMapProps) {
  const myMap = useRef<any>(null);

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
      window.ymaps.ready(initMap);
    });

    return () => {
      if (myMap.current) {
        myMap.current.destroy();
      }
    };
  }, []);

  const initMap = () => {
    window.ymaps.ready(() => {
      myMap.current = new window.ymaps.Map(mapId, {
        center: coordinates,
        zoom: 13,
      });

      const placemark = new window.ymaps.Placemark(
        coordinates,
        {},
        { preset: 'islands#icon', iconColor: '#0F6CBD', draggable: true },
      );

      myMap.current.geoObjects.add(placemark);

      placemark.events.add('dragend', updateCoordinates(placemark));

      myMap.current.events.add('click', (e: any) => {
        const coords = e.get('coords');
        placemark.geometry.setCoordinates(coords);
        updateCoordinates(placemark)();
      });
    });
  };

  const updateCoordinates = (placemark: any) => () => {
    const coords = placemark.geometry.getCoordinates();
    const [x, y] = coords as [number, number];
    const fixedX = Number(x.toFixed(6));
    const fixedY = Number(y.toFixed(6));
    setCoordinates([fixedX, fixedY]);

    placemark.properties.set(
      'balloonContent',
      `Координаты: ${fixedX}, ${fixedY}`,
    );
    placemark.balloon.open();
  };

  return (
    <div
      className={className}
      id={mapId}
      style={{ width: '100%', height: '400px' }}
    />
  );
}
