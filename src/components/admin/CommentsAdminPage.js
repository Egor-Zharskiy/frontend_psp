import React, {useState, useEffect} from "react";
import {Layout, Table, Button, message, Popconfirm, Tag} from "antd";
import AdminSidebar from "./AdminSideBar";

const {Header, Content} = Layout;

const CommentsAdminPage = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/comments/get_all_comments",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Ошибка загрузки комментариев");
                const data = await response.json();
                setComments(data);
            } catch (error) {
                message.error("Не удалось загрузить комментарии");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/comments/delete_comment/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Ошибка удаления комментария");
            message.success("Комментарий удален");
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
        } catch (error) {
            message.error("Не удалось удалить комментарий");
        }
    };

    const handleApprove = async (id) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/comments/verify_comment/${id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Ошибка подтверждения комментария");
            message.success("Комментарий подтвержден");
            setComments((prevComments) =>
                prevComments.map((comment) =>
                    comment.id === id ? {...comment, is_verified: true} : comment
                )
            );
        } catch (error) {
            message.error("Не удалось подтвердить комментарий");
        }
    };

    const columns = [
        {
            title: "Комментарий",
            dataIndex: "comment",
            key: "comment",
        },
        {
            title: "Автор",
            dataIndex: "user",
            key: "user",
            render: (user) => `${user.first_name} ${user.last_name}`,
        },
        {
            title: "Дата добавления",
            dataIndex: "date_added",
            key: "date_added",
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: "Статус",
            dataIndex: "is_verified",
            key: "is_verified",
            render: (is_verified) => (
                <Tag color={is_verified ? "green" : "red"}>
                    {is_verified ? "Подтвержден" : "Ожидает"}
                </Tag>
            ),
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <div style={{display: "flex", gap: "10px"}}>
                    {!record.is_verified && (
                        <Button
                            type="primary"
                            onClick={() => handleApprove(record.id)}>
                            Подтвердить
                        </Button>
                    )}
                    <Popconfirm
                        title="Вы уверены, что хотите удалить этот комментарий?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Да"
                        cancelText="Нет">
                        <Button type="danger">Удалить</Button>
                    </Popconfirm>
                </div>
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
                    <h1 className="text-xl">Комментарии к школе</h1>
                </Header>
                <Content className="p-4 bg-gray-50">
                    <Table
                        columns={columns}
                        dataSource={comments}
                        rowKey="id"
                        loading={loading}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default CommentsAdminPage;
