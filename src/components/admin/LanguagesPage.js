import React, {useState, useEffect} from "react";
import {Layout, Table, Button, message, Form, Input, Modal} from "antd";
import {useNavigate} from "react-router-dom";
import AdminSidebar from "./AdminSideBar";

const {Header, Content} = Layout;

const LanguagesPage = () => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchLanguages();
    }, []);

    const fetchLanguages = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/courses/get_languages");
            if (!response.ok) throw new Error("Ошибка загрузки языков");
            const data = await response.json();
            setLanguages(data);
        } catch (error) {
            message.error("Не удалось загрузить языки");
        } finally {
            setLoading(false);
        }
    };

    const handleAddLanguage = async (values) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/courses/create_language", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error("Ошибка добавления языка");
            message.success("Язык успешно добавлен");
            fetchLanguages();
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error("Не удалось добавить язык");
        }
    };

    const handleDeleteLanguage = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/courses/delete_language/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) throw new Error("Ошибка удаления языка");
            message.success("Язык успешно удален");
            fetchLanguages();
        } catch (error) {
            message.error("Не удалось удалить язык");
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Название на английском",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Название",
            dataIndex: "rus_name",
            key: "rus_name",
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <div style={{display: "flex", gap: "10px"}}>
                    <Button
                        type="primary"
                        onClick={() => navigate(`/admin/languages/${record.id}`)}>
                        Подробнее
                    </Button>
                    <Button
                        type="danger"
                        onClick={() => handleDeleteLanguage(record.id)}>
                        Удалить
                    </Button>
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
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <h1 className="text-xl">Доступные языки</h1>

                </Header>
                <Content className="p-4 bg-gray-50">
                    <Button type="primary" onClick={() => setIsModalVisible(true)}>
                        Добавить язык
                    </Button>
                    <Table
                        columns={columns}
                        dataSource={languages}
                        rowKey="id"
                        loading={loading}
                    />
                </Content>
                <Modal
                    title="Добавить язык"
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={handleAddLanguage}>
                        <Form.Item
                            label="Название на английском"
                            name="name"
                            rules={[{required: true, message: "Введите название на английском"}]}
                        >
                            <Input placeholder="Введите название на английском"/>
                        </Form.Item>
                        <Form.Item
                            label="Название на русском"
                            name="rus_name"
                            rules={[{required: true, message: "Введите название на русском"}]}
                        >
                            <Input placeholder="Введите название на русском"/>
                        </Form.Item>
                        <div style={{display: "flex", justifyContent: "flex-end", gap: "10px"}}>
                            <Button onClick={() => setIsModalVisible(false)}>Отмена</Button>
                            <Button type="primary" htmlType="submit">
                                Сохранить
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </Layout>
        </Layout>
    );
};

export default LanguagesPage;
