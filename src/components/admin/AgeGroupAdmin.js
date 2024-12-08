import React, {useState, useEffect} from "react";
import {Layout, Table, Button, Modal, Form, InputNumber, Input, Space, message} from "antd";
import AdminSidebar from "./AdminSideBar";

const {Header, Content} = Layout;

const AgeGroupAdmin = () => {
    const [ageGroups, setAgeGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchAgeGroups();
    }, []);

    const fetchAgeGroups = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/courses/get_age_groups", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            setAgeGroups(data);
        } catch (error) {
            console.error("Error fetching age groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://127.0.0.1:8000/courses/delete_age_group/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            message.success("Группа удалена!");
            fetchAgeGroups();
        } catch (error) {
            console.error("Error deleting age group:", error);
            message.error("Не удалось удалить группу.");
        }
    };

    const handleEdit = (record) => {
        setEditingGroup(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingGroup(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            const values = form.getFieldsValue();
            let response;

            if (editingGroup) {
                response = await fetch(`http://127.0.0.1:8000/courses/edit_age_group/${editingGroup.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(values),
                });
            } else {
                response = await fetch("http://127.0.0.1:8000/courses/create_age_group", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(values),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || "Не удалось выполнить запрос.");
            }

            message.success(editingGroup ? "Группа обновлена!" : "Группа создана!");
            fetchAgeGroups();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving age group:", error);
            message.error(error.message || "Произошла ошибка при сохранении группы.");
        }
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const columns = [
        {
            title: "Название группы",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Минимальный возраст",
            dataIndex: "min_age",
            key: "min_age",
        },
        {
            title: "Максимальный возраст",
            dataIndex: "max_age",
            key: "max_age",
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => handleEdit(record)}>
                        Редактировать
                    </Button>
                    <Button type="danger" onClick={() => handleDelete(record.id)}>
                        Удалить
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout>
            <AdminSidebar/>
            <Layout>
                <Header style={{color: "black", fontSize: "20px", backgroundColor: "white"}}>
                    Управление возрастными группами
                </Header>
                <Content style={{margin: "20px", padding: "20px", backgroundColor: "white"}}>
                    <Button type="primary" onClick={handleCreate} style={{marginBottom: "20px"}}>
                        Создать новую группу
                    </Button>
                    <Table
                        columns={columns}
                        dataSource={ageGroups}
                        loading={loading}
                        rowKey="id"
                        bordered
                        pagination={{pageSize: 5}}
                        title={() => "Возрастные группы"}/>
                </Content>
                <Modal
                    title={editingGroup ? "Редактировать группу" : "Создать новую группу"}
                    open={isModalOpen}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}>
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Название группы"
                            name="name"
                            rules={[{required: true, message: "Введите название группы!"}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Минимальный возраст"
                            name="min_age"
                            rules={[{required: true, message: "Введите минимальный возраст!"}]}>
                            <InputNumber min={0}/>
                        </Form.Item>
                        <Form.Item
                            label="Максимальный возраст"
                            name="max_age"
                            rules={[{required: true, message: "Введите максимальный возраст!"}]}>
                            <InputNumber min={0}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </Layout>
        </Layout>
    );
};

export default AgeGroupAdmin;
