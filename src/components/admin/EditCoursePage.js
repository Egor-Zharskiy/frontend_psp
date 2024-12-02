import React, {useState, useEffect} from "react";
import {Layout, Form, Input, Button, Select, Switch, InputNumber, message} from "antd";
import AdminSidebar from "./AdminSideBar";
import {useParams, useNavigate} from "react-router-dom";

const {Header, Content, Footer} = Layout;
const {TextArea} = Input;
const {Option} = Select;

const EditCoursePage = () => {
    const [form] = Form.useForm();
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [courseData, setCourseData] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [formats, setFormats] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);
    const [levels, setLevels] = useState([]);

    useEffect(() => {
        const fetchCourseData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:8000/courses/get_course_by_id/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!response.ok) throw new Error("Ошибка при загрузке курса");
                const data = await response.json();
                setCourseData(data);
                form.setFieldsValue(data);
            } catch (error) {
                message.error("Не удалось загрузить данные курса");
            } finally {
                setLoading(false);
            }
        };

        const fetchReferenceData = async () => {
            try {
                const [langsRes, formatsRes, ageGroupsRes, levelsRes] = await Promise.all([
                    fetch("http://127.0.0.1:8000/courses/get_languages", {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }),
                    fetch("http://127.0.0.1:8000/courses/get_course_formats", {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }),
                    fetch("http://127.0.0.1:8000/courses/get_age_groups", {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }),
                    fetch("http://127.0.0.1:8000/courses/get_levels", {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }),
                ]);


                setLanguages(await langsRes.json());
                setFormats(await formatsRes.json());
                setAgeGroups(await ageGroupsRes.json());
                setLevels(await levelsRes.json());
            } catch (error) {
                message.error("Не удалось загрузить справочные данные");
            }
        };

        fetchCourseData();
        fetchReferenceData();
    }, [id]);

    const handleSubmit = async (values) => {
        if (Array.isArray(values.levels) && typeof values.levels[0] === "object") {
            values.levels = values.levels.map((level) => level.level_id);
        }
        console.log(values);
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/courses/edit_course/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) throw new Error("Ошибка при обновлении курса");
            message.success("Курс успешно обновлен");
            navigate("/admin/courses");
        } catch (error) {
            message.error("Не удалось обновить курс");
        } finally {
            setLoading(false);
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
                    <h1 className="text-xl">Редактирование курса</h1>
                </Header>
                <Content className="p-4 bg-gray-50">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={courseData}>
                        <Form.Item label="Название" name="name"
                                   rules={[{required: true, message: "Введите название курса"}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Описание" name="description"
                                   rules={[{required: true, message: "Введите описание курса"}]}>
                            <TextArea rows={4}/>
                        </Form.Item>
                        <Form.Item label="Размер группы" name="group_size"
                                   rules={[{required: true, message: "Введите размер группы"}]}>
                            <InputNumber min={1}/>
                        </Form.Item>
                        <Form.Item label="Интенсивность" name="intensity"
                                   rules={[{required: true, message: "Введите интенсивность"}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Цена" name="price" rules={[{required: true, message: "Введите цену"}]}>
                            <InputNumber min={0}/>
                        </Form.Item>
                        <Form.Item label="Язык" name="language_id" rules={[{required: true, message: "Выберите язык"}]}>
                            <Select>
                                {languages.map((lang) => (
                                    <Option key={lang.id} value={lang.id}>
                                        {lang.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Формат" name="format_id"
                                   rules={[{required: true, message: "Выберите формат"}]}>
                            <Select>
                                {formats.map((format) => (
                                    <Option key={format.id} value={format.id}>
                                        {format.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Возрастная группа" name="age_group_id"
                                   rules={[{required: true, message: "Выберите возрастную группу"}]}>
                            <Select>
                                {ageGroups.map((group) => (
                                    <Option key={group.id} value={group.id}>
                                        {group.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Уровни" name="levels" rules={[{required: true, message: "Выберите уровни"}]}>
                            <Select mode="multiple">
                                {levels.map((level) => (
                                    <Option key={level.id} value={level.id}>
                                        {level.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Активность" name="is_active" valuePropName="checked">
                            <Switch/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Сохранить изменения
                            </Button>
                        </Form.Item>
                    </Form>
                </Content>
            </Layout>
        </Layout>
    );
};

export default EditCoursePage;
