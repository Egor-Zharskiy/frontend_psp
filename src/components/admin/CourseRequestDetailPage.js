import React, {useState, useEffect} from "react";
import {Layout, Card, Descriptions, Button, Select, message, Popconfirm} from "antd";
import {useParams, useNavigate, Link} from "react-router-dom";
import AdminSidebar from "./AdminSideBar";

const {Header, Content} = Layout;
const {Option} = Select;

const CourseRequestDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchRequestDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/courses/get_course_request/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Ошибка при загрузке данных заявки");
                const data = await response.json();
                setRequest(data);
                setStatus(data.status);
            } catch (error) {
                message.error("Не удалось загрузить данные заявки");
            } finally {
                setLoading(false);
            }
        };

        fetchRequestDetails();
    }, [id]);

    const handleStatusChange = async (value) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/courses/edit_course_request/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({status: value}),
                }
            );

            if (!response.ok) throw new Error("Ошибка при изменении статуса");
            message.success("Статус успешно обновлен");
            setStatus(value);
        } catch (error) {
            message.error("Не удалось обновить статус");
        }
    };

    const handleArchive = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/courses/edit_course_request/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({is_archived: true}),
                }
            );

            if (!response.ok) throw new Error("Ошибка при архивировании заявки");
            message.success("Заявка успешно архивирована");
            setRequest({...request, is_archived: true});
        } catch (error) {
            message.error("Не удалось архивировать заявку");
        }
    };

    const handleUnarchive = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/courses/edit_course_request/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({is_archived: false}),
                }
            );

            if (!response.ok) throw new Error("Ошибка при разархивировании заявки");
            message.success("Заявка успешно разархивирована");
            setRequest({...request, is_archived: false});
        } catch (error) {
            message.error("Не удалось разархивировать заявку");
        }
    };

    const handleMarkAsProcessed = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/courses/edit_course_request/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({is_processed: true}),
                }
            );

            if (!response.ok) throw new Error("Ошибка при изменении статуса обработки");
            message.success("Заявка успешно отмечена как обработанная");
            setRequest({...request, is_processed: true});
        } catch (error) {
            message.error("Не удалось отметить заявку как обработанную");
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/courses/delete_course_request/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Ошибка при удалении заявки");
            message.success("Заявка успешно удалена");
            navigate("/admin/requests/");
        } catch (error) {
            message.error("Не удалось удалить заявку");
        }
    };

    if (loading || !request) return <p>Загрузка...</p>;

    return (
        <Layout>
            <AdminSidebar/>
            <Layout>
                <Header
                    className="shadow-md px-4"
                    style={{
                        backgroundColor: "white",
                        color: "black"
                    }}>
                    <h1 className="text-xl">Детали заявки #{id}</h1>
                </Header>
                <Content className="p-4 bg-gray-50">
                    <Card>
                        <Descriptions title="Информация о заявке" bordered>
                            <Descriptions.Item label="ID заявки">{request.id}</Descriptions.Item>
                            <Descriptions.Item label="Статус">
                                <Select
                                    value={status}
                                    onChange={handleStatusChange}
                                    style={{width: 200}}
                                    disabled={request.is_archived}>
                                    <Option value="pending">В ожидании</Option>
                                    <Option value="approved">Одобрено</Option>
                                    <Option value="rejected">Отклонено</Option>
                                </Select>
                            </Descriptions.Item>
                            <Descriptions.Item label="Архивировано">
                                {request.is_archived ? "Да" : "Нет"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Обработано">
                                {request.is_processed ? "Да" : "Нет"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Курс">
                                {request.course.name} ({request.course.language.rus_name})
                            </Descriptions.Item>
                            <Descriptions.Item label="Пользователь">
                                <Link to={`/admin/users/${request.user.id}`}>
                                    {`${request.user.last_name} ${request.user.first_name}`}
                                </Link>
                            </Descriptions.Item>
                        </Descriptions>
                        <div style={{marginTop: 16}}>
                            {!request.is_archived ? (
                                <Button
                                    type="primary"
                                    onClick={handleArchive}
                                    disabled={request.is_processed}
                                >
                                    Архивировать
                                </Button>
                            ) : (
                                <Button type="default" onClick={handleUnarchive}>
                                    Разархивировать
                                </Button>)}
                            <Button
                                type="primary"
                                onClick={handleMarkAsProcessed}
                                style={{marginLeft: 8}}
                                disabled={request.is_processed}>
                                Отметить как обработанную
                            </Button>
                            <Popconfirm
                                title="Вы уверены, что хотите удалить эту заявку?"
                                onConfirm={handleDelete}
                                okText="Да"
                                cancelText="Нет">
                                <Button type="danger" style={{marginLeft: 8}}>
                                    Удалить
                                </Button>
                            </Popconfirm>
                        </div>
                    </Card>
                </Content>
            </Layout>
        </Layout>
    );
};

export default CourseRequestDetailsPage;
