import React, {useEffect, useState} from "react";
import {Layout, Table, Button, Space, Tag, message, Typography} from "antd";
import {Link, useNavigate} from "react-router-dom";
import AdminSidebar from "./AdminSideBar";

const {Header, Content, Footer, Sider} = Layout;
const {Title} = Typography;

const AdminCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/courses/get_courses", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) throw new Error("Ошибка при загрузке курсов");

                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Ошибка при загрузке курсов:", error);
                message.error("Не удалось загрузить курсы");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleEdit = (courseId) => {
        navigate(`/admin/courses/edit_course/${courseId}`);
    };

    const handleDelete = async (courseId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/courses/delete/${courseId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Ошибка при удалении курса");

            setCourses(courses.filter((course) => course.id !== courseId));
            message.success("Курс успешно удалён");
        } catch (error) {
            console.error("Ошибка при удалении курса:", error);
            message.error("Не удалось удалить курс");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Название курса",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Преподаваемый язык",
            dataIndex: ["language", "rus_name"],
            key: "language",
            render: (language) => (language ? <Tag color="blue">{language}</Tag> : "Не указан"),
        },
        {
            title: "Интенсивность",
            dataIndex: "intensity",
            key: "intensity",
            render: (intensity) => (
                <Tag color={intensity === "high" ? "red" : intensity === "medium" ? "orange" : "green"}>
                    {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                </Tag>
            ),
        },
        {
            title: "Активен",
            dataIndex: "is_active",
            key: "is_active",
            render: (isActive) => (
                <Tag color={isActive ? "green" : "red"}>
                    {isActive ? "Да" : "Нет"}
                </Tag>
            ),
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => handleEdit(record.id)}>
                        <Link to={`/admin/courses/edit_course/${record.id}`}>Редактировать</Link>
                    </Button>
                    <Button type="danger" onClick={() => handleDelete(record.id)}>
                        Удалить
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sider
                style={{
                    backgroundColor: "#001529",
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                }}
            >
                <AdminSidebar/>
            </Sider>
            <Layout style={{marginLeft: 200}}>
                <Header className="shadow-md px-4" style={{backgroundColor: "white", color: "black"}}>
                    <Title level={3}>Все курсы</Title>
                </Header>
                <Content className="p-4 bg-gray-50">
                    <Button
                        type="primary"
                        style={{marginBottom: 16}}
                        onClick={() => navigate("/admin/courses/create")}
                    >
                        Добавить новый курс
                    </Button>
                    <Table
                        columns={columns}
                        dataSource={courses}
                        rowKey="id"
                        loading={loading}
                        pagination={{pageSize: 10}}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminCoursesPage;
