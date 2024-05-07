import { useEffect } from 'react';

interface YandexMapProps {
  x: number;
  y: number;
  title: string;
}

export function YandexMap({ x, y, title }: YandexMapProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=145f92f6-1b7b-4180-affe-d92e0bf4fd09';
    script.async = true;

    document.body.appendChild(script);

    script.addEventListener('load', () => {
      // @ts-ignore
      window.ymaps.ready(init);
    });

    function init() {
      // @ts-ignore
      var myMap = new window.ymaps.Map(
        'map',
        {
          center: [x, y],
          zoom: 15,
        },
        {
          //   searchControlProvider: 'yandex#search',
        },
      );

      // Create a placemark with a balloon
      // @ts-ignore
      var myPlacemark = new window.ymaps.Placemark(
        [x, y],
        {
          balloonContent: title,
        },
        {
          preset: 'islands#icon',
          iconColor: '#0F6CBD',
        },
      );

      // Add the placemark to the map
      myMap.geoObjects.add(myPlacemark);
    }

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
}
