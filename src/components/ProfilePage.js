import React, {useState, useEffect} from "react";
import {Card, Button, Form, Input, message} from "antd";
import {useNavigate} from "react-router-dom";


const ProfilePage = () => {
    const navigate = useNavigate();
    let isMounted = true;
    const [user, setUser] = useState(null);
    const [courseRequests, setCourseRequests] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const [isSessionExpired, setIsSessionExpired] = useState(false);

    const [grades, setGrades] = useState([]);


    const apiFetch = async (url, options = {}) => {
        console.log(isMounted + "isMounted")

        const token = localStorage.getItem("token");
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...options.headers,
                },
            });

            if (response.status === 401) {
                if (isMounted) {
                    handleSessionExpired();
                    isMounted = false;
                }

                return null;
            }

            return response;
        } catch (error) {
            console.error("Ошибка сети:", error);
            message.error("Ошибка сети. Попробуйте позже.");
            return null;
        }
    };

    const handleSessionExpired = () => {
        if (!isSessionExpired) {
            setIsSessionExpired(true);
            localStorage.removeItem("token");
            message.warning("Ваша сессия истекла. Пожалуйста, авторизуйтесь снова.");
            navigate("/login");
        }
    };


    useEffect(() => {
        const fetchUserData = async () => {
            const response = await apiFetch("http://127.0.0.1:8000/auth/me", {method: "GET"});
            if (response && response.ok) {
                const data = await response.json();
                setUser(data);
            } else if (response) {
                message.error("Не удалось загрузить данные профиля.");
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchCourseRequests = async () => {
            const response = await apiFetch("http://127.0.0.1:8000/courses/get_user_course_requests", {method: "GET"});
            if (response && response.ok) {
                const data = await response.json();
                setCourseRequests(data);
            } else if (response) {
                message.error("Не удалось загрузить заявки на курсы.");
            }
        };

        fetchCourseRequests();
    }, []);

    const handleEditSubmit = async (values) => {
        const response = await apiFetch("http://127.0.0.1:8000/auth/me", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(values),
        });

        if (response && response.ok) {
            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditing(false);
            message.success("Профиль успешно обновлён!");
        } else if (response) {
            message.error("Ошибка при обновлении профиля.");
        }
    };

    if (!user) {
        return <div className="text-center mt-20 text-lg">Загрузка профиля...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <Card className="w-full max-w-lg p-6 shadow-md bg-white rounded-lg">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    Профиль пользователя
                </h1>

                {!isEditing ? (
                    <div>
                        <p className="text-lg mb-4">
                            <strong>Имя пользователя:</strong> {user.username}
                        </p>
                        <p className="text-lg mb-4">
                            <strong>Имя:</strong> {user.first_name}
                        </p>
                        <p className="text-lg mb-4">
                            <strong>Фамилия:</strong> {user.last_name}
                        </p>
                        <p className="text-lg mb-4">
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p className="text-lg mb-4">
                            <strong>Телефон:</strong> {user.phone_number || "Не указан"}
                        </p>
                        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
                            Заявки на курсы
                        </h2>
                        {courseRequests.length > 0 ? (
                            <ul className="list-disc pl-5">
                                {courseRequests.map((request) => (
                                    <li key={request.id} className="text-lg">
                                        Курс: {request.course.name} — Статус: {request.status}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-lg text-gray-600">
                                На данный момент Вы не отправили ни одной заявки на курс.
                            </p>
                        )}
                        <div className="flex justify-center items-center mt-6">
                            <Button
                                type="primary"
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white">
                                Редактировать профиль
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Form
                        layout="vertical"
                        onFinish={handleEditSubmit}
                        initialValues={{
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            phone_number: user.phone_number,
                        }}
                    >
                        <Form.Item
                            label="Имя"
                            name="first_name"
                            rules={[{required: true, message: "Введите ваше имя"}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Фамилия"
                            name="last_name"
                            rules={[{required: true, message: "Введите вашу фамилию"}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {required: true, message: "Введите ваш email"},
                                {type: "email", message: "Введите корректный email"},
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Телефон"
                            name="phone_number"
                        >
                            <Input/>
                        </Form.Item>
                        <div className="flex justify-end space-x-4">
                            <Button
                                onClick={() => setIsEditing(false)}
                                className="text-gray-600 border-gray-400 hover:border-gray-600"
                            >
                                Отмена
                            </Button>
                            <Button type="primary" htmlType="submit" className="bg-blue-500 text-white">
                                Сохранить
                            </Button>
                        </div>
                    </Form>

                )}

            </Card>


        </div>


    );
};

export default ProfilePage;
