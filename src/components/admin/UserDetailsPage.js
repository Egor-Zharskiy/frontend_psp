import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Layout, Typography, Descriptions, Table, Tag, Form, Input, Button, message, Select} from "antd";
import AdminSidebar from "./AdminSideBar";

const {Header, Content, Footer, Sider} = Layout;
const {Title} = Typography;
const {Option} = Select;

const UserDetailsPage = () => {
    const {id} = useParams();
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [requests, setRequests] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/auth/get_user/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) throw new Error("Ошибка при загрузке данных пользователя");

                const data = await response.json();
                setUser(data);
                form.setFieldsValue(data);
            } catch (error) {
                console.error("Ошибка при загрузке пользователя:", error);
            }
        };

        const fetchUserCourses = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/courses/get_user_courses/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) throw new Error("Ошибка при загрузке курсов пользователя");

                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error("Ошибка при загрузке курсов:", error);
            }
        };

        const fetchUserRequests = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/courses/get_user_course_requests/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) throw new Error("Ошибка при загрузке заявок пользователя");

                const data = await response.json();
                setRequests(data);
            } catch (error) {
                console.error("Ошибка при загрузке заявок:", error);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/auth/get_roles", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) throw new Error("Ошибка при загрузке ролей");

                const data = await response.json();
                setRoles(data);
            } catch (error) {
                console.error("Ошибка при загрузке ролей:", error);
            }
        };

        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchUserDetails(), fetchUserCourses(), fetchUserRequests(), fetchRoles()]);
            setLoading(false);
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!user) {
        return <div>Пользователь не найден</div>;
    }

    const handleEdit = () => {
        setEditing(true);
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const role_id = values.role_id;

            const userResponse = await fetch(`http://127.0.0.1:8000/auth/update_user/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!userResponse.ok) throw new Error("Ошибка при обновлении профиля");

            const roleResponse = await fetch(`http://127.0.0.1:8000/auth/edit_user_role/${id}/${role_id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({user_id: id, role_id}),
            });

            if (!roleResponse.ok) throw new Error("Ошибка при обновлении роли");

            const updatedUser = await userResponse.json();
            setUser(updatedUser);
            setEditing(false);
            message.success("Профиль и роль успешно обновлены!");
            window.location.reload();
        } catch (error) {
            console.error("Ошибка при сохранении профиля и роли:", error);
            message.error("Не удалось сохранить изменения");
        }
    };

    const coursesColumns = [
        {
            title: "Название курса",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Группа",
            dataIndex: "group_name",
            key: "group_name",
        },
    ];

    const requestsColumns = [
        {
            title: "Курс",
            dataIndex: ["course", "name"],
            key: "course_name",
        },
        {
            title: "Интенсивность",
            dataIndex: ["course", "intensity"],
            key: "intensity",
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (status) =>
                status === "approved" ? <Tag color="green">Одобрено</Tag> : <Tag color="red">В ожидании</Tag>,
        },
        {
            title: "Дата заявки",
            dataIndex: "created_at",
            key: "created_at",
            render: (date) => new Date(date).toLocaleString(),
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
                    <Title level={3}>Детали пользователя: {user.username}</Title>
                </Header>
                <Content className="p-4 bg-gray-50">
                    <Descriptions title="Основная информация" bordered>
                        <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
                        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                        <Descriptions.Item label="Имя">{user.first_name}</Descriptions.Item>
                        <Descriptions.Item label="Фамилия">{user.last_name}</Descriptions.Item>
                        <Descriptions.Item label="Телефон">{user.phone_number}</Descriptions.Item>
                        <Descriptions.Item label="Роль">{user.role.name}</Descriptions.Item>
                        <Descriptions.Item label="Дата регистрации">
                            {new Date(user.registered_at).toLocaleString()}
                        </Descriptions.Item>
                    </Descriptions>

                    {editing ? (
                        <Form form={form} layout="vertical" initialValues={user} style={{marginTop: 20}}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{required: true, message: "Пожалуйста, введите email!"}]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Имя"
                                name="first_name"
                                rules={[{required: true, message: "Пожалуйста, введите имя!"}]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Фамилия"
                                name="last_name"
                                rules={[{required: true, message: "Пожалуйста, введите фамилию!"}]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Телефон"
                                name="phone_number"
                                rules={[{required: true, message: "Пожалуйста, введите номер телефона!"}]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Роль"
                                name="role_id"
                                rules={[{required: true, message: "Пожалуйста, выберите роль!"}]}
                            >
                                <Select placeholder="Выберите роль">
                                    {roles.map((role) => (
                                        <Option key={role.id} value={role.id}>
                                            {role.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" onClick={handleSave}>
                                    Сохранить изменения
                                </Button>
                                <Button style={{marginLeft: 8}} onClick={handleCancel}>
                                    Отменить
                                </Button>
                            </Form.Item>
                        </Form>
                    ) : (
                        <Button type="primary" onClick={handleEdit} style={{marginTop: 20}}>
                            Редактировать
                        </Button>
                    )}

                    <Title level={4} style={{marginTop: 20}}>
                        Курсы
                    </Title>
                    <Table dataSource={courses} columns={coursesColumns} rowKey="id" pagination={false}/>

                    <Title level={4} style={{marginTop: 20}}>
                        Заявки на курсы
                    </Title>
                    <Table dataSource={requests} columns={requestsColumns} rowKey="id" pagination={false}/>
                </Content>
                <Footer style={{textAlign: "center"}}>© Школа иностранных языков</Footer>
            </Layout>
        </Layout>
    );
};

export default UserDetailsPage;
