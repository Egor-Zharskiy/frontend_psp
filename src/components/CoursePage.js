// src/components/CourseDetailPage.js
import React, {useState, useEffect} from 'react';
import {Card, Button, message} from 'antd';
import {useParams} from 'react-router-dom';

function CourseDetailPage() {
    const {id} = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/courses/get_course_by_id/${id}`)
            .then(response => response.json())
            .then(data => {
                setCourse(data);
                console.log(data);
            })
            .catch(error => console.error('Ошибка при загрузке курса:', error));
    }, [id]);

    const handleEnroll = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            message.warning('Пожалуйста, авторизуйтесь перед отправкой заявки!');
            return;
        }

        const requestData = {
            course_id: course.id
        };

        fetch('http://127.0.0.1:8000/courses/create_course_request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
        })
            .then(response => {
                const statusCode = response.status;

                return response.json().then(data => {
                    return {statusCode, data};
                });
            })
            .then(({statusCode, data}) => {
                console.log('Status Code:', statusCode);
                console.log('Response Data:', data);

                if (statusCode === 200) {
                    message.success(`Заявка на курс ${course.name} отправлена!`);
                } else if (statusCode === 409) {
                    message.error('Вы уже отправляли заявку на данный курс!');
                } else if (statusCode === 404) {
                    message.error('Курс с данным ID не найден!');
                } else {
                    message.error('Ошибка при отправке заявки.');
                }
            })
            .catch(error => {
                console.error('Ошибка при отправке заявки:', error);
                message.error('Ошибка при отправке заявки.');
            });

    };

    if (!course) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen py-10">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">{course.name}</h1>

                <Card className="mb-12 shadow-md">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Описание курса</h2>
                    <p className="text-lg text-gray-600 mb-4">{course.description}</p>

                    <ul className="text-lg text-gray-700 mb-6">
                        <li><strong>Продолжительность:</strong> {course.duration}</li>
                        <li><strong>Интенсивность:</strong> {course.intensity}</li>
                        <li><strong>Размер группы:</strong> {course.group_size} человек</li>
                        <li><strong>Цена:</strong> {course.price} $ в месяц</li>
                    </ul>
                </Card>

                <section className="bg-white shadow-md p-6 rounded-lg flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Записаться на курс</h2>
                    <Button
                        type="primary"
                        onClick={handleEnroll}
                        size="large"
                        className="bg-blue-500 hover:bg-blue-600 text-white mt-4">
                        Записаться на курс
                    </Button>
                </section>
            </div>
        </div>
    );
}

export default CourseDetailPage;
