import React, {useState, useEffect} from "react";
import {Layout, Spin, message, Input, Button, Form} from "antd";
import {useParams} from "react-router-dom";
import AdminSidebar from "./AdminSideBar";

const {Header, Content} = Layout;

const LanguageDetailsPage = () => {
    const {id} = useParams();
    const [language, setLanguage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchLanguageDetails = async () => {
            setLoading(true);

            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/courses/get_language_by_id/${id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                if (!response.ok) throw new Error("Ошибка загрузки информации о языке");
                const data = await response.json();
                setLanguage(data);
                form.setFieldsValue(data);
            } catch (error) {
                message.error("Не удалось загрузить информацию о языке");
            } finally {
                setLoading(false);
            }
        };

        fetchLanguageDetails();
    }, [id, form]);

    const handleSave = async () => {
        try {
            const values = form.getFieldsValue();
            const response = await fetch(
                `http://127.0.0.1:8000/courses/edit_language/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(values),
                }
            );

            if (!response.ok) throw new Error("Ошибка сохранения изменений");
            const updatedLanguage = await response.json();
            setLanguage(updatedLanguage);
            setEditMode(false);
            message.success("Информация о языке успешно обновлена");
        } catch (error) {
            message.error("Не удалось сохранить изменения");
        }
    };

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
                    <h1 className="text-xl">Информация о языке</h1>
                </Header>
                <Content className="p-4 bg-gray-50">
                    {loading ? (
                        <Spin/>
                    ) : language ? (
                        <div>
                            {editMode ? (
                                <Form
                                    form={form}
                                    layout="vertical"
                                    initialValues={{
                                        name: language.name,
                                        rus_name: language.rus_name,
                                    }}>
                                    <Form.Item
                                        label="Название на английском"
                                        name="name"
                                        rules={[{required: true, message: "Введите название"}]}>
                                        <Input placeholder="Введите название на английском"/>
                                    </Form.Item>
                                    <Form.Item
                                        label="Название на русском"
                                        name="rus_name"
                                        rules={[{required: true, message: "Введите русское название"}]}>
                                        <Input placeholder="Введите русское название"/>
                                    </Form.Item>
                                    <Button type="primary" onClick={handleSave}>
                                        Сохранить
                                    </Button>
                                    <Button
                                        style={{marginLeft: "10px"}}
                                        onClick={() => setEditMode(false)}>
                                        Отмена
                                    </Button>
                                </Form>
                            ) : (
                                <div>
                                    <h2>{language.rus_name}</h2>
                                    <p>Идентификатор: {language.id}</p>
                                    <p>Название на английском: {language.name}</p>
                                    <Button type="primary" onClick={() => setEditMode(true)}>
                                        Редактировать
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Данные о языке не найдены</p>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default LanguageDetailsPage;
