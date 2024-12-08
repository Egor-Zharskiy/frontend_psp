import React, {useState} from 'react';
import {Form, Input, Button, message} from 'antd';
import {useNavigate} from 'react-router-dom';

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [emailValid, setEmailValid] = useState(true);
    const navigate = useNavigate();

    const handleRegister = (values) => {
        if (!emailValid) {
            message.error('Введите корректный email.');
            return;
        }

        setLoading(true);

        fetch('http://127.0.0.1:8000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: values.email,
                username: values.username,
                password: values.password,
                phone_number: values.phone_number,
                first_name: values.first_name,
                last_name: values.last_name,
                is_active: true,
                is_superuser: false,
                is_verified: false,
                role_id: 0,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    message.success('Регистрация прошла успешно!');
                    navigate('/login');
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.detail || 'Ошибка при регистрации. Проверьте введенные данные.');
                    });
                }
            })
            .catch((error) => {
                message.error(error.message);
            })
            .finally(() => setLoading(false));
    };

    const validateEmail = async (email) => {
        if (!email) {
            setEmailValid(false);
            message.error('Email не может быть пустым.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/auth/validate_email?email=${encodeURIComponent(email)}`);
            if (response.ok) {
                const isValid = await response.json();
                setEmailValid(isValid);
                if (!isValid) {
                    message.error('Некорректный email. Проверьте введенные данные.');
                }
            } else {
                setEmailValid(false);
                message.error('Ошибка валидации email.');
            }
        } catch (error) {
            setEmailValid(false);
            message.error('Ошибка соединения с сервером.');
        }
    };

    return (
        <div className="grid place-items-center min-h-[calc(100vh-80px)] bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Регистрация</h2>
                <Form
                    layout="vertical"
                    onFinish={handleRegister}
                    autoComplete="off">
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {required: true, message: 'Введите ваш email'},
                            {type: 'email', message: 'Некорректный email'},
                        ]}>
                        <Input
                            placeholder="example@mail.com"
                            onBlur={(e) => validateEmail(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Имя пользователя"
                        name="username"
                        rules={[
                            {required: true, message: 'Введите имя пользователя'},
                            {min: 3, message: 'Имя пользователя должно содержать не менее 3 символов'},
                        ]}>
                        <Input placeholder="Ваше имя пользователя"/>
                    </Form.Item>
                    <Form.Item
                        label="Имя"
                        name="first_name"
                        rules={[
                            {required: true, message: 'Введите ваше имя'},
                        ]}>
                        <Input placeholder="Ваше имя"/>
                    </Form.Item>
                    <Form.Item
                        label="Фамилия"
                        name="last_name"
                        rules={[
                            {required: true, message: 'Введите вашу фамилию'},
                        ]}>
                        <Input placeholder="Ваша фамилия"/>
                    </Form.Item>
                    <Form.Item
                        label="Номер телефона"
                        name="phone_number"
                        rules={[
                            {required: true, message: 'Введите номер телефона'},
                            {pattern: /^\+?\d{10,15}$/, message: 'Неверный формат номера телефона'},
                        ]}>
                        <Input placeholder="+375111111111"/>
                    </Form.Item>
                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[
                            {required: true, message: 'Введите ваш пароль'},
                            {min: 6, message: 'Пароль должен содержать не менее 6 символов'},
                        ]}
                        hasFeedback>
                        <Input.Password placeholder="Ваш пароль"/>
                    </Form.Item>
                    <Form.Item
                        label="Подтверждение пароля"
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {required: true, message: 'Подтвердите ваш пароль'},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Пароли не совпадают'));
                                },
                            }),
                        ]}>
                        <Input.Password placeholder="Подтвердите ваш пароль"/>
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        loading={loading}>
                        Зарегистрироваться
                    </Button>
                </Form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    Уже есть аккаунт? <a href="/login" className="text-blue-500 hover:underline">Войти</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
