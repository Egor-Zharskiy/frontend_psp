import React, {useEffect, useState} from 'react';
import {Layout, Table, Button, Modal, Form, Input, message, Spin, Select} from 'antd';
import {useNavigate} from 'react-router-dom';
import AdminSidebar from "./AdminSideBar";

const {Header, Content} = Layout;
const {Option} = Select;

const GroupsPage = () => {
    const [groupsData, setGroupsData] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const [teachersData, setTeachersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://127.0.0.1:8000/courses/get_groups', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch groups');
            }
            const data = await response.json();
            setGroupsData(data);
        } catch (error) {
            message.error('Не удалось загрузить данные групп.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCoursesAndTeachers = async () => {
        try {
            const [coursesResponse, teachersResponse] = await Promise.all([
                fetch('http://127.0.0.1:8000/courses/get_courses', {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                }),
                fetch('http://127.0.0.1:8000/auth/get_teachers', {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                }),
            ]);

            if (!coursesResponse.ok || !teachersResponse.ok) {
                throw new Error('Failed to fetch courses or teachers');
            }

            const coursesData = await coursesResponse.json();
            const teachersData = await teachersResponse.json();

            setCoursesData(coursesData);
            setTeachersData(teachersData);
        } catch (error) {
            message.error('Не удалось загрузить данные курсов или преподавателей.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGroups();
        fetchCoursesAndTeachers();
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleCreateGroup = async (values) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/courses/create_group/${values.course_id}/${values.teacher_id}/${values.group_name}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to create group');
            }

            const data = await response.json();
            message.success('Группа успешно создана!');
            setGroupsData((prevData) => [...prevData, data]);
            handleCloseModal();
        } catch (error) {
            message.error('Ошибка при создании группы.');
            console.error(error);
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/admin/groups/${id}`);
    };

    const columns = [
        {
            title: 'Название группы',
            dataIndex: 'group_name',
            key: 'group_name',
        },
        {
            title: 'Курс',
            dataIndex: ['course', 'name'],
            key: 'course_name',
        },
        {
            title: 'Преподаватель',
            dataIndex: 'teacher',
            key: 'teacher',
            render: (teacher) => `${teacher.first_name} ${teacher.last_name}`,
        },
        {
            title: 'Размер группы',
            dataIndex: ['course', 'group_size'],
            key: 'group_size',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (text, record) => (
                <Button href={`/admin/groups/${record.id}`} type="link" onClick={() => handleViewDetails(record.id)}>
                    Подробнее
                </Button>
            ),
        },
    ];

    return (
        <Layout>
            <AdminSidebar/>
            <Layout>
                <Header style={{color: 'black', fontSize: '20px', backgroundColor: "white"}}>Управление
                    группами</Header>
                <Content style={{margin: '20px', padding: '20px', backgroundColor: 'white'}}>
                    <Button type="primary" onClick={handleOpenModal} style={{marginBottom: '20px'}}>
                        Создать новую группу
                    </Button>
                    {loading ? (
                        <Spin tip="Загрузка..."/>
                    ) : (
                        <Table
                            dataSource={groupsData}
                            columns={columns}
                            rowKey={(record) => record.id}
                            pagination={{pageSize: 5}}
                        />
                    )}
                </Content>

                <Modal
                    title="Создание новой группы"
                    open={isModalOpen}
                    onCancel={handleCloseModal}
                    onOk={form.submit}>
                    <Form form={form} onFinish={handleCreateGroup}>
                        <Form.Item
                            label="Название группы"
                            name="group_name"
                            rules={[{required: true, message: 'Введите название группы'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Курс"
                            name="course_id"
                            rules={[{required: true, message: 'Выберите курс'}]}>
                            <Select>
                                {coursesData.map((course) => (
                                    <Option key={course.id} value={course.id}>
                                        {course.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Преподаватель"
                            name="teacher_id"
                            rules={[{required: true, message: 'Выберите преподавателя'}]}>
                            <Select>
                                {teachersData.map((teacher) => (
                                    <Option key={teacher.id} value={teacher.id}>
                                        {teacher.first_name} {teacher.last_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </Layout>
        </Layout>
    );
};

export default GroupsPage;
