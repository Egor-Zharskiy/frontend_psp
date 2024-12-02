import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (values) => {
        setLoading(true);

        const formData = new URLSearchParams();
        formData.append('grant_type', 'password');
        formData.append('username', values.email);
        formData.append('password', values.password);


        fetch('http://127.0.0.1:8000/auth/jwt/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Неверный email или пароль');
                }
            })
            .then((data) => {
                message.success('Успешный вход!');
                localStorage.setItem('token', data.access_token);
                navigate('/');
                window.location.reload();
            })
            .catch((error) => {
                message.error(error.message);
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="grid place-items-center min-h-[calc(100vh-80px)] bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Вход в аккаунт</h2>
                <Form
                    layout="vertical"
                    onFinish={handleLogin}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Введите ваш email' },
                            { type: 'email', message: 'Некорректный email' },
                        ]}
                    >
                        <Input placeholder="example@mail.com" />
                    </Form.Item>
                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[{ required: true, message: 'Введите ваш пароль' }]}
                    >
                        <Input.Password placeholder="Ваш пароль" />
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        loading={loading}
                    >
                        Войти
                    </Button>
                </Form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    Нет аккаунта? <a href="/register" className="text-blue-500 hover:underline">Зарегистрироваться</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
