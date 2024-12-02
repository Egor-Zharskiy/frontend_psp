import React, {useState, useEffect} from 'react';
import './CoursesPage.css';
import {Card} from "antd";
import {Link} from "react-router-dom";

function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [languages, setLanguages] = useState([]);

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

    const handleFilterChange = (e) => {
        const filter = e.target.value;

        if (!filter) {
            setFilteredCourses(courses);
            return;
        }

        const filtered = courses.filter(course => course.language_id === parseInt(filter));
        setFilteredCourses(filtered);
    };

    return (
        <div className="flex">
            <aside className="w-1/6 p-4 bg-gray-100 h-screen">
                <h3 className="text-lg font-semibold mb-4">Фильтры</h3>
                <label className="block">
                    <span className="text-sm font-medium">Язык:</span>
                    <select
                        onChange={handleFilterChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded">
                        <option value="">Все</option>
                        {languages.map(language => (
                            <option key={language.id} value={language.id}>
                                {language.rus_name}
                            </option>
                        ))}
                    </select>
                </label>
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
