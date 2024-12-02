// src/components/HomePage.js
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function HomePage() {
    const [languages, setLanguages] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/courses/get_languages')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ошибка сети");
                }
                return response.json();
            })
            .then(data => {
                setLanguages(data);
                console.log(data);
            })
            .catch(error => {
                console.error("Ошибка при загрузке языков:", error);
            });
    }, []);

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-800">
            <section className="bg-gray-100 py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">Изучайте иностранные языки с нами!</h1>
                <p className="text-lg mb-6">Запишитесь на курсы и начните учить язык уже сегодня.</p>
                <button className="px-6 py-3 text-lg p-5 bg-[rgb(66,163,142)] text-white rounded border-none">
                    <Link to="/about" className="text-2xl font-bold text-white no-underline ">Узнать больше</Link>
                </button>
            </section>

            <section id="languages" className="py-10 text-center">
                <h2 className="text-3xl font-semibold mb-6">Языки преподавания</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    {languages.map(language => (
                        <div key={language.id} className="w-40 p-4 bg-teal-100 rounded-lg shadow-md">
                            {language.rus_name}
                        </div>
                    ))}
                </div>
            </section>

            <section id="teachers" className="py-10 text-center">
                <h2 className="text-3xl font-semibold mb-6">Наши преподаватели</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    <div className="w-40 p-4 bg-teal-100 rounded-lg shadow-md">Иван Иванов</div>
                    <div className="w-40 p-4 bg-teal-100 rounded-lg shadow-md">Анна Смирнова</div>
                    <div className="w-40 p-4 bg-teal-100 rounded-lg shadow-md">Мария Иванова</div>
                    <div className="w-40 p-4 bg-teal-100 rounded-lg shadow-md">Алексей Петров</div>
                </div>
            </section>

            <section id="reviews" className="py-10 text-center">
                <h2 className="text-3xl font-semibold mb-6">Отзывы наших студентов</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    <div className="w-80 p-4 bg-teal-100 rounded-lg shadow-md">Отличные курсы! Очень рекомендую.</div>
                    <div className="w-80 p-4 bg-teal-100 rounded-lg shadow-md">Преподаватели просто супер!</div>
                    <div className="w-80 p-4 bg-teal-100 rounded-lg shadow-md">Выучила язык за несколько месяцев.</div>
                </div>
            </section>

            <section id="contacts" className="py-10 text-center">
                <h2 className="text-3xl font-semibold mb-4">Контакты</h2>
                <p className="text-lg mb-2">Адрес: ул. Лингвистическая, 12</p>
                <p className="text-lg mb-2">Телефон: +7 (123) 456-78-90</p>
                <p className="text-lg">Email: info@languageschool.ru</p>
            </section>

            <footer className="bg-[rgb(66,163,142)] text-white text-center py-6">
                <p>&copy; 2024 ZharSchool. Все права защищены.</p>
            </footer>
        </div>
    );
}

export default HomePage;
