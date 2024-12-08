import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/auth/verify_token", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                    checkIfTeacher();
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Ошибка проверки токена:", error);
                setIsAuthenticated(false);
            }
        };

        const checkIfTeacher = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/auth/is_teacher", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.status === 200) {
                    const data = await response.json();
                    console.log(data);
                    setIsTeacher(data);
                } else {
                    setIsTeacher(false);
                }
            } catch (error) {
                console.error("Ошибка проверки роли преподавателя:", error);
                setIsTeacher(false);
            }
        };

        verifyToken();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setIsTeacher(false);
        navigate("/");
    };

    return (
        <header className="flex justify-between items-center p-5 bg-[rgb(66,163,142)] text-white">
            <Link to="/" className="text-2xl font-bold text-white no-underline">
                Language School
            </Link>
            <nav>
                <ul className="flex space-x-5 list-none">
                    <li>
                        <Link to="/courses" className="text-white no-underline hover:underline">
                            Курсы
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="text-white no-underline hover:underline">
                            О нас
                        </Link>
                    </li>
                    <li>
                        <a href="/comments" className="text-white no-underline hover:underline">
                            Отзывы
                        </a>
                    </li>
                    <li>
                        <a href="#contacts" className="text-white no-underline hover:underline">
                            Контакты
                        </a>
                    </li>

                    {isAuthenticated ? (
                        <>
                            {!isTeacher && (
                                <li>
                                    <Link
                                        to="/my_courses"
                                        className="text-white no-underline hover:underline focus:outline-none focus:ring-0">
                                        Мои курсы
                                    </Link>
                                </li>
                            )}

                            {isTeacher && (
                                <li>
                                    <Link
                                        to="/teacher/groups/"
                                        className="text-white no-underline hover:underline focus:outline-none focus:ring-0">
                                        Мои группы
                                    </Link>
                                </li>
                            )}

                            <li>
                                <Link
                                    to="/profile"
                                    className="text-white no-underline hover:underline focus:outline-none focus:ring-0">
                                    Профиль
                                </Link>
                            </li>
                            <li>
                                <a
                                    onClick={handleLogout}
                                    className="cursor-pointer text-white no-underline hover:underline focus:outline-none focus:ring-0">
                                    Выйти
                                </a>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to="/login"
                                    className="text-white no-underline hover:underline focus:outline-none focus:ring-0">
                                    Вход
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    className="text-white no-underline hover:underline focus:outline-none focus:ring-0">
                                    Регистрация
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
