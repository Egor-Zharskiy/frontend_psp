import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Проверка токена при загрузке страницы
    useEffect(() => {
        const verifyToken = async () => {
            console.log(localStorage.getItem("token"));
            try {
                const response = await fetch("http://127.0.0.1:8000/auth/verify_token", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Используем токен из localStorage или Cookies
                    },
                });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Ошибка проверки токена:", error);
                setIsAuthenticated(false);
            }
        };

        verifyToken();
    }, []);

    // Выход из аккаунта
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/"); // Перенаправление на главную страницу
    };

    return (
        <header className="flex justify-between items-center p-5 bg-[rgb(66,163,142)] text-white">
            <Link to="/" className="text-2xl font-bold text-white no-underline">
                Language School
            </Link>
            <nav>
                <ul className="flex space-x-5">
                    {isAuthenticated ? (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="text-white no-underline hover:underline focus:outline-none focus:ring-0">
                                Выйти
                            </button>
                        </li>
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
