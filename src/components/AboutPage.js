// src/components/AboutPage.js
import React from 'react';
import { Card, Button } from 'antd';

const teamMembers = [
    {
        name: 'Иван Иванов',
        role: 'Основатель и директор',
        description: 'Опытный лингвист с более чем 10-летним стажем преподавания.',
        image: 'https://via.placeholder.com/150'
    },
    {
        name: 'Анна Смирнова',
        role: 'Координатор курсов',
        description: 'Координирует образовательные программы и помогает студентам.',
        image: 'https://via.placeholder.com/150'
    },
    {
        name: 'Мария Иванова',
        role: 'Преподаватель английского языка',
        description: 'Специалист по преподаванию английского языка с международным опытом.',
        image: 'https://via.placeholder.com/150'
    }
];

function AboutPage() {
    return (
        <div className="bg-gray-100 min-h-screen py-10">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">О нас</h1>
                <p className="text-lg text-gray-600 mb-12">
                    Наша школа иностранных языков предлагает широкий выбор курсов и программ для людей всех возрастов и уровней.
                    Мы стремимся обеспечить качественное образование, помогая нашим студентам достигать своих языковых целей.
                </p>

                <section className="mb-16">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Наша миссия и ценности</h2>
                    <p className="text-lg text-gray-600 mb-4">
                        Мы верим, что изучение языков открывает двери к новым возможностям и расширяет горизонты.
                    </p>
                    <p className="text-lg text-gray-600">
                        С момента основания наша миссия — помогать людям находить путь к саморазвитию, культурному обмену и лучшему будущему через обучение языкам.
                    </p>
                </section>

                <section className="mb-16">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Наша команда</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <Card
                                key={index}
                                cover={<img alt={member.name} src={member.image} className="h-48 object-cover" />}
                                className="shadow-md"
                            >
                                <Card.Meta title={member.name} description={member.role} />
                                <p className="mt-4 text-gray-600">{member.description}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mb-16 text-center">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Наша локация</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        Наш офис находится в центре города, на улице Лингвистическая, 12. Мы всегда рады видеть наших студентов
                        и гостей, чтобы ответить на все ваши вопросы и помочь вам начать ваше языковое путешествие.
                    </p>
                    <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center text-gray-700">
                        <p>Google Maps API заглушка</p>
                    </div>
                </section>

                <section className="text-center">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Присоединяйтесь к нам!</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        Мы всегда рады новым студентам и преподавателям. Свяжитесь с нами, чтобы узнать больше о курсах и возможностях.
                    </p>
                    <Button type="primary" size="large" className="bg-blue-500 hover:bg-blue-600 text-white">
                        Связаться с нами
                    </Button>
                </section>
            </div>
        </div>
    );
}

export default AboutPage;
