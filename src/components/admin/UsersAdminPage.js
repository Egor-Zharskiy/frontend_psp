import React, {useState, useEffect} from "react";
import {Layout, Table, Space, Button, Input, Typography, Tag, Select, message} from "antd";
import AdminSidebar from "./AdminSideBar";
import {Link} from "react-router-dom";
import {Popconfirm} from "antd";


const {Header, Content, Footer} = Layout;
const {Search} = Input;
const {Title} = Typography;
const {Option} = Select;

const UsersAdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/auth/users", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                throw new Error("Ошибка при загрузке данных");
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Ошибка:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const handleRoleFilterChange = (value) => {
        setRoleFilter(value || "");
    };

    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/auth/delete_user/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                message.success("Пользователь удален");
                fetchUsers(); // Обновляем список пользователей после удаления
            } else {
                message.error("Ошибка при удалении пользователя");
            }
        } catch (error) {
            message.error("Ошибка при удалении пользователя");
            console.error("Ошибка:", error);
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.email.toLowerCase().includes(searchText) ||
            user.username.toLowerCase().includes(searchText) ||
            user.first_name.toLowerCase().includes(searchText) ||
            user.last_name.toLowerCase().includes(searchText);

        const matchesRole =
            roleFilter === "" ||
            (roleFilter === "admin" && user.is_superuser) ||
            (roleFilter === "teacher" && user.role_id === 3) ||
            (roleFilter === "user" && !user.is_superuser && user.role_id !== 3);

        return matchesSearch && matchesRole;
    });

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Имя",
            dataIndex: "first_name",
            key: "first_name",
        },
        {
            title: "Фамилия",
            dataIndex: "last_name",
            key: "last_name",
        },
        {
            title: "Телефон",
            dataIndex: "phone_number",
            key: "phone_number",
        },
        {
            title: "Дата регистрации",
            dataIndex: "registered_at",
            key: "registered_at",
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: "Роль",
            dataIndex: "role_id",
            key: "role_id",
            render: (_, record) => {
                if (record.is_superuser) {
                    return <Tag color="red">Администратор</Tag>;
                }
                switch (record.role_id) {
                    case 3:
                        return <Tag color="green">Преподаватель</Tag>;
                    default:
                        return <Tag color="blue">Пользователь</Tag>;
                }
            },
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link">
                        <Link to={`/admin/users/${record.id}`} style={{color: "blue"}}>
                            Редактировать
                        </Link>
                    </Button>
                    <Popconfirm
                        title="Вы уверены, что хотите удалить этого пользователя?"
                        onConfirm={() => deleteUser(record.id)}
                        okText="Да"
                        cancelText="Нет">
                        <Button type="link" danger>
                            Удалить
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Layout>
            <AdminSidebar/>
            <Layout>
                <Header
                    className="shadow-md px-4"
                    style={{
                        backgroundColor: "white",
                        color: "black",
                    }}>
                    <h1 className="text-xl">Управление пользователями</h1>
                </Header>
                <Content className="p-4 bg-gray-50">
                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
                        <Search
                            placeholder="Поиск по имени, email, username..."
                            enterButton="Поиск"
                            size="large"
                            onSearch={handleSearch}
                            style={{width: "60%"}}/>
                        <Select
                            placeholder="Фильтр по роли"
                            onChange={handleRoleFilterChange}
                            style={{width: "30%"}}
                            allowClear>
                            <Option value="admin">Администратор</Option>
                            <Option value="teacher">Преподаватель</Option>
                            <Option value="user">Пользователь</Option>
                        </Select>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredUsers}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                        }}
                    />
                </Content>
                <Footer style={{textAlign: "center"}}>© 2024 ZharSchool</Footer>
            </Layout>
        </Layout>
    );
};

export default UsersAdminPage;
