import React, {useState, useEffect} from "react";
import {Layout, Table, Button, Modal, Form, Input, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import AdminSidebar from "./AdminSideBar";

const {Sider, Content, Header} = Layout;

const LanguageLevelsPage = () => {
    const [levels, setLevels] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingLevel, setEditingLevel] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchLevels();
    }, []);

    const fetchLevels = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/courses/get_levels", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) throw new Error("Ошибка загрузки данных");
            const data = await response.json();
            setLevels(data);
        } catch (error) {
            message.error("Ошибка при загрузке уровней языков");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/courses/delete_level/${id}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) throw new Error("Ошибка удаления уровня");
            setLevels((prevLevels) => prevLevels.filter((level) => level.id !== id));
            message.success("Уровень успешно удален");
        } catch (error) {
            message.error("Ошибка при удалении уровня");
        }
    };

    const handleAddOrEdit = async (values) => {
        const url = editingLevel
            ? `http://127.0.0.1:8000/courses/edit_level/${editingLevel.id}/`
            : `http://127.0.0.1:8000/courses/create_level/`;
        const method = editingLevel ? "PATCH" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Ошибка сохранения уровня");
            }
            const updatedLevel = await response.json();
            if (editingLevel) {
                setLevels((prevLevels) =>
                    prevLevels.map((level) =>
                        level.id === editingLevel.id ? updatedLevel : level
                    )
                );
                message.success("Уровень успешно обновлен");
            } else {
                setLevels((prevLevels) => [...prevLevels, updatedLevel]);
                message.success("Уровень успешно создан");
            }
            form.resetFields();
            setEditingLevel(null);
            setIsModalVisible(false);
        } catch (error) {
            message.error(error.message || "Ошибка при сохранении уровня");
        }
    };

    const handleEditClick = (level) => {
        setEditingLevel(level);
        form.setFieldsValue(level);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setEditingLevel(null);
        form.resetFields();
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Уровень",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Описание",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEditClick(record)}>
                        Редактировать
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>
                        Удалить
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Layout style={{minHeight: "100vh"}}>
            <AdminSidebar/>
            <Layout>
                <Header
                    style={{
                        padding: "0 16px",
                        backgroundColor: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    <h1>Уровни языков</h1>
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={() => setIsModalVisible(true)}>
                        Добавить уровень
                    </Button>
                </Header>
                <Content style={{margin: "16px"}}>
                    <Table
                        dataSource={levels}
                        columns={columns}
                        rowKey="id"
                        style={{marginTop: "20px"}}
                    />
                    <Modal
                        title={editingLevel ? "Редактировать уровень" : "Добавить уровень"}
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        onOk={() => form.submit()}>
                        <Form form={form} onFinish={handleAddOrEdit} layout="vertical">
                            <Form.Item
                                label="Название уровня"
                                name="name"
                                rules={[{required: true, message: "Введите название уровня"}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Описание"
                                name="description"
                                rules={[{required: true, message: "Введите описание уровня"}]}>
                                <Input.TextArea/>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Content>
            </Layout>
        </Layout>
    );
};

export default LanguageLevelsPage;
