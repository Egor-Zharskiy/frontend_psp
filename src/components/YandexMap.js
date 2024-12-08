import React, { useEffect, useRef } from 'react';

const YandexMap = () => {
    const mapContainer = useRef(null); // Контейнер для карты
    const mapInstance = useRef(null); // Ссылка на экземпляр карты

    const initMap = () => {
        if (mapInstance.current || !window.ymaps) return;

        window.ymaps.ready(() => {
            mapInstance.current = new window.ymaps.Map(mapContainer.current, {
                center: [53.9255892, 27.5941272],
                zoom: 16,
            });

            // Удаляем управляющие элементы
            mapInstance.current.controls.remove('geolocationControl');
            mapInstance.current.controls.remove('searchControl');
            mapInstance.current.controls.remove('trafficControl');
            mapInstance.current.controls.remove('typeSelector');
            mapInstance.current.controls.remove('fullscreenControl');
            mapInstance.current.controls.remove('zoomControl');
            mapInstance.current.controls.remove('rulerControl');

            // Добавляем метку
            const placemark = new window.ymaps.Placemark([53.9255892, 27.5941272], {
                balloonContent: 'Минск',
            });

            mapInstance.current.geoObjects.add(placemark);
        });
    };

    useEffect(() => {
        const scriptUrl =
            'https://api-maps.yandex.ru/2.1/?apikey=6c0c2fee-9454-4fba-9933-cbe9b185cc84&lang=ru_RU';

        // Проверяем, загружен ли скрипт
        if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.async = true;

            script.onload = () => {
                initMap(); // Вызываем initMap после загрузки скрипта
            };

            document.body.appendChild(script);
        } else if (window.ymaps) {
            initMap(); // Если скрипт уже загружен, сразу инициализируем карту
        }

        return () => {
            // Удаляем карту при размонтировании компонента
            if (mapInstance.current) {
                mapInstance.current.destroy();
                mapInstance.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={mapContainer}
            style={{
                width: '100%',
                height: '500px',
            }}
        />
    );
};

export default YandexMap;
