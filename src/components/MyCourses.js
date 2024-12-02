import React, {useEffect, useState} from "react";
import {List, Typography} from "antd";

const {Title, Text} = Typography;

const MyCourses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://127.0.0.1:8000/courses/get_user_courses", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Ошибка загрузки курсов");
                }
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Ошибка загрузки курсов:", error);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <Title level={2} className="text-center mb-4">Мои курсы</Title>
            <div className="bg-white shadow-md rounded-md p-6">
                {courses.length > 0 ? (
                    <List
                        itemLayout="horizontal"
                        dataSource={courses}
                        renderItem={(course) => (
                            <List.Item className="p-4 border-b last:border-b-0">
                                <List.Item.Meta
                                    title={
                                        <a href={`/user_course/${course.id}`} className="text-blue-600 hover:underline">
                                            {course.name}
                                        </a>
                                    }
                                    description={
                                        <div className="text-gray-600">
                                            <Text>Группа: {course.group_name}</Text>
                                            <br/>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                ) : (
                    <div className="text-center text-gray-500">
                        <Text>Вы пока не вступили ни на один курс.</Text>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;
