import { cn } from '@/lib/utils';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface YandexMapProps {
  coordinates: [number, number];
  setCoordinates: Dispatch<SetStateAction<[number, number]>>;
  className?: string;
}

// Declare the `window.ymaps` type
declare global {
  interface Window {
    ymaps: any;
  }
}

export function YandexMapPicker({
  coordinates,
  setCoordinates,
  className,
}: YandexMapProps) {
  const [myMap, setMyMap] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY}`;
    script.async = true;

    document.body.appendChild(script);

    script.addEventListener('load', () => {
      window.ymaps.ready(init);
    });

    function init() {
      const mapInstance = new window.ymaps.Map('map', {
        center: coordinates,
        zoom: 10,
      });

      setMyMap(mapInstance);

      // Create a draggable placemark at the center of the map
      const initialCoords = coordinates;
      const placemark = new window.ymaps.Placemark(
        initialCoords,
        {},
        {
          preset: 'islands#icon',
          iconColor: '#0F6CBD',
          draggable: true,
        },
      );

      // Add the placemark to the map
      mapInstance.geoObjects.add(placemark);

      // Listen for drag end event to get the new coordinates
      placemark.events.add('dragend', function (e: any) {
        const coords = placemark.geometry.getCoordinates();
        const [x, y] = coords as [number, number];
        const fixedX = x.toFixed(6);
        const fixedY = y.toFixed(6);
        setCoordinates([+fixedX, +fixedY]);
        // Update the balloon content with the new coordinates and open it
        placemark.properties.set(
          'balloonContent',
          `Координаты: ${fixedX}, ${fixedY}`,
        );
        placemark.balloon.open();
      });

      // Listen for click event to set the placemark at the clicked location
      mapInstance.events.add('click', function (e: any) {
        const coords = e.get('coords') as [number, number];
        const [x, y] = coords as [number, number];
        const fixedX = x.toFixed(6);
        const fixedY = y.toFixed(6);
        placemark.geometry.setCoordinates(coords);
        setCoordinates([+fixedX, +fixedY]);

        // Update the balloon content with the new coordinates and open it
        placemark.properties.set(
          'balloonContent',
          `Координаты: ${fixedX}, ${fixedY}`,
        );
        placemark.balloon.open();
      });
    }

    return () => {
      if (myMap) {
        myMap.destroy(); // Properly destroy the map instance
      }
      document.body.removeChild(script);
    };
  }, [coordinates]);

  return (
    <div
      className={cn(className)}
      id="map"
      style={{
        width: '100%',
        height: '400px',
      }}
    ></div>
  );
}
