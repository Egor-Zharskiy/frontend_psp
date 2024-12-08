import React, {useState, useEffect} from 'react';
import './CoursesPage.css';
import {Card} from "antd";
import {Link} from "react-router-dom";

function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });

    useEffect(() => {
        fetch('http://127.0.0.1:8000/courses/get_courses')
            .then(response => response.json())
            .then(data => {
                const activeCourses = data.filter(course => course.is_active);
                setCourses(activeCourses);
                setFilteredCourses(activeCourses);
            })
            .catch(error => console.error("Ошибка при загрузке курсов:", error));

        fetch('http://127.0.0.1:8000/courses/get_languages')
            .then(response => response.json())
            .then(data => {
                setLanguages(data);
            })
            .catch(error => console.error("Ошибка при загрузке языков:", error));
    }, []);

    const handleLanguageFilterChange = (e) => {
        const filter = e.target.value;

        let filtered = courses;
        if (filter) {
            filtered = filtered.filter(course => course.language_id === parseInt(filter));
        }

        // Применяем фильтр по цене
        if (priceRange.min || priceRange.max) {
            filtered = applyPriceFilter(filtered, priceRange.min, priceRange.max);
        }

        setFilteredCourses(filtered);
    };

    const handlePriceFilterChange = (e) => {
        const { name, value } = e.target;

        const updatedPriceRange = { ...priceRange, [name]: value };
        setPriceRange(updatedPriceRange);

        let filtered = courses;

        // Применяем фильтр по языку
        const languageFilter = document.querySelector('select').value;
        if (languageFilter) {
            filtered = filtered.filter(course => course.language_id === parseInt(languageFilter));
        }

        // Применяем фильтр по цене
        filtered = applyPriceFilter(filtered, updatedPriceRange.min, updatedPriceRange.max);
        setFilteredCourses(filtered);
    };

    const applyPriceFilter = (courses, minPrice, maxPrice) => {
        return courses.filter(course => {
            const price = course.price;
            return (
                (!minPrice || price >= parseFloat(minPrice)) &&
                (!maxPrice || price <= parseFloat(maxPrice))
            );
        });
    };

    return (
        <div className="flex">
            <aside className="w-1/6 p-4 bg-gray-100 h-screen">
                <h3 className="text-lg font-semibold mb-4">Фильтры</h3>
                {/* Фильтр по языку */}
                <label className="block mb-4">
                    <span className="text-sm font-medium">Язык:</span>
                    <select
                        onChange={handleLanguageFilterChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded">
                        <option value="">Все</option>
                        {languages.map(language => (
                            <option key={language.id} value={language.id}>
                                {language.rus_name}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Фильтр по цене */}
                <div>
                    <span className="text-sm font-medium">Цена (в $):</span>
                    <div className="flex space-x-2 mt-1">
                        <input
                            type="number"
                            name="min"
                            value={priceRange.min}
                            placeholder="Мин."
                            onChange={handlePriceFilterChange}
                            className="w-1/2 p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            name="max"
                            value={priceRange.max}
                            placeholder="Макс."
                            onChange={handlePriceFilterChange}
                            className="w-1/2 p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
            </aside>

            <main className="w-3/4 p-4">
                <h2 className="text-2xl font-bold mb-6">Актуальные курсы</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCourses.map(course => (
                        <Card
                            key={course.id}
                            title={course.name}
                            extra={<Link to={`/course/${course.id}`} className="text-blue-500">Подробнее</Link>}
                            className="w-full">
                            <p>{course.description}</p>
                            <p>Стоимость курса: <b>{course.price}$</b> в месяц</p>
                            <p>Преподаваемый язык: <b>{course.language.rus_name}</b></p>
                            <p>Интенсивность занятий: {course.intensity}</p>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default CoursesPage;
