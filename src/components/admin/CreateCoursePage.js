import React, {useState, useEffect} from "react";
import {Layout, Form, Input, Button, Select, InputNumber, Switch, message, Checkbox} from "antd";
import AdminSidebar from "./AdminSideBar";
import {useNavigate} from "react-router-dom";

const {Header, Content, Footer} = Layout;
const {Option} = Select;

const CreateCoursePage = () => {
    const [form] = Form.useForm();
    const [languages, setLanguages] = useState([]);
    const [formats, setFormats] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);
    const [levels, setLevels] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {

                const languageResponse = await fetch("http://127.0.0.1:8000/courses/get_languages", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const formatResponse = await fetch("http://127.0.0.1:8000/courses/get_course_formats", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const ageGroupResponse = await fetch("http://127.0.0.1:8000/courses/get_age_groups", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const levelResponse = await fetch("http://127.0.0.1:8000/courses/get_levels", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const [languagesData, formatsData, ageGroupsData, levelsData] = await Promise.all([
                    languageResponse.json(),
                    formatResponse.json(),
                    ageGroupResponse.json(),
                    levelResponse.json(),
                ]);

                setLanguages(languagesData);
                setFormats(formatsData);
                setAgeGroups(ageGroupsData);
                setLevels(levelsData);
            } catch (error) {
                message.error("Ошибка при загрузке данных");
            }
        };
        fetchData();
    }, []);

    const onFinish = async (values) => {
        const courseData = {
            name: values.name,
            description: values.description,
            group_size: values.group_size,
            intensity: values.intensity,
            price: values.price,
            language_id: values.language_id,
            format_id: values.format_id,
            is_active: values.is_active,
            age_group_id: values.age_group_id,
            levels: values.levels,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/courses/create_course", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(courseData),
            });

            if (response.ok) {
                message.success("Курс успешно создан");
                navigate("/admin/courses");
            } else {
                message.error("Ошибка при создании курса");
            }
        } catch (error) {
            message.error("Ошибка при отправке данных");
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
                    }}
                >
                    <h1 className="text-xl">Создание курса</h1>
                </Header>
                <Content className="p-4 bg-gray-50">
                    <Form
                        form={form}
                        name="create_course"
                        onFinish={onFinish}
                        initialValues={{
                            is_active: true,
                            levels: [],
                        }}
                        layout="vertical"
                        style={{maxWidth: "800px", margin: "0 auto"}}
                    >
                        <Form.Item
                            label="Название курса"
                            name="name"
                            rules={[{required: true, message: "Пожалуйста, введите название курса!"}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="Описание курса"
                            name="description"
                            rules={[{required: true, message: "Пожалуйста, введите описание курса!"}]}
                        >
                            <Input.TextArea rows={4}/>
                        </Form.Item>

                        <Form.Item
                            label="Размер группы"
                            name="group_size"
                            rules={[{required: true, message: "Пожалуйста, введите размер группы!"}]}
                        >
                            <InputNumber min={1}/>
                        </Form.Item>

                        <Form.Item
                            label="Интенсивность"
                            name="intensity"
                            rules={[{required: true, message: "Пожалуйста, укажите интенсивность курса!"}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="Цена"
                            name="price"
                            rules={[{required: true, message: "Пожалуйста, укажите цену курса!"}]}
                        >
                            <InputNumber min={0}/>
                        </Form.Item>

                        <Form.Item
                            label="Язык курса"
                            name="language_id"
                            rules={[{required: true, message: "Пожалуйста, выберите язык курса!"}]}
                        >
                            <Select>
                                {languages.map((language) => (
                                    <Option key={language.id} value={language.id}>
                                        {language.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Формат курса"
                            name="format_id"
                            rules={[{required: true, message: "Пожалуйста, выберите формат курса!"}]}>
                            <Select>
                                {formats.map((format) => (
                                    <Option key={format.id} value={format.id}>
                                        {format.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Возрастная группа"
                            name="age_group_id"
                            rules={[{required: true, message: "Пожалуйста, выберите возрастную группу!"}]}>
                            <Select>
                                {ageGroups.map((group) => (
                                    <Option key={group.id} value={group.id}>
                                        {group.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Уровни курса"
                            name="levels"
                            rules={[{required: true, message: "Пожалуйста, выберите хотя бы один уровень!"}]}>
                            <Checkbox.Group>
                                {levels.map((level) => (
                                    <Checkbox key={level.id} value={level.id}>
                                        {level.name}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Form.Item>

                        <Form.Item
                            label="Активен"
                            name="is_active"
                            valuePropName="checked">
                            <Switch/>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Создать курс
                            </Button>
                        </Form.Item>
                    </Form>
                </Content>
                <Footer style={{textAlign: "center"}}>© 2024 ZharSchool</Footer>
            </Layout>
        </Layout>
    );
};

export default CreateCoursePage;
