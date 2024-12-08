import React, {useEffect, useState} from 'react';
import {Layout, Table, Button, Modal, Form, Input, Select, message, Spin} from 'antd';
import {useParams, useNavigate} from 'react-router-dom';
import AdminSidebar from "./AdminSideBar";

const {Header, Content} = Layout;
const {Option} = Select;

const GroupDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [groupData, setGroupData] = useState(null);
    const [usersData, setUsersData] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const [teachersData, setTeachersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);  // Модальное окно для изменения преподавателя
    const [form] = Form.useForm();
    const [userForm] = Form.useForm();
    const [teacherForm] = Form.useForm();

    const fetchGroupDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://127.0.0.1:8000/courses/get_detailed_group/${id}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
            });

            if (!response.ok) {
                throw new Error('Failed to fetch group details');
            }

            const data = await response.json();
            setGroupData(data);
        } catch (error) {
            message.error('Не удалось загрузить данные группы.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSupportData = async () => {
        try {
            const [usersResponse, coursesResponse, teachersResponse] = await Promise.all([
                fetch('http://127.0.0.1:8000/auth/users', {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                }),
                fetch('http://127.0.0.1:8000/courses/get_courses', {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                }),
                fetch('http://127.0.0.1:8000/auth/get_teachers', {
                    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
                }),
            ]);

            if (!usersResponse.ok || !coursesResponse.ok || !teachersResponse.ok) {
                throw new Error('Failed to fetch users, courses, or teachers');
            }

            const usersData = await usersResponse.json();
            const coursesData = await coursesResponse.json();
            const teachersData = await teachersResponse.json();

            setUsersData(usersData);
            setCoursesData(coursesData);
            setTeachersData(teachersData);
        } catch (error) {
            message.error('Не удалось загрузить вспомогательные данные.');
            console.error(error);
        }
    };

    const handleUserDelete = async (userId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/courses/remove_user_from_group/${userId}/${id}`, {
                method: 'DELETE',
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
            });

            if (!response.ok) {
                throw new Error('Failed to remove user');
            }

            message.success('Пользователь удален из группы.');
            fetchGroupDetails();
        } catch (error) {
            message.error('Ошибка при удалении пользователя.');
            console.error(error);
        }
    };

    const handleUserAdd = async (values) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/courses/add_user_to_group/${id}/${values.user_id}`, {
                method: 'POST',
                headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            message.success('Пользователь добавлен в группу.');
            fetchGroupDetails();
            setIsUserModalOpen(false);
            userForm.resetFields();
        } catch (error) {
            message.error('Ошибка при добавлении пользователя.');
            console.error(error);
        }
    };

    const handleTeacherRebind = async (values) => {
        try {
            console.log(values);
            console.log(id);
            const response = await fetch(`http://127.0.0.1:8000/courses/add_teacher_to_group/${id}/${values.teacher_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to rebind teacher');
            }

            message.success('Преподаватель успешно изменен.');
            fetchGroupDetails();
            setIsTeacherModalOpen(false);
        } catch (error) {
            message.error('Ошибка при изменении преподавателя.');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchGroupDetails();
        fetchSupportData();
    }, []);

    const handleEditGroup = async (values) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/courses/edit_group/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to edit group');
            }

            message.success('Группа успешно обновлена.');
            fetchGroupDetails();
        } catch (error) {
            message.error('Ошибка при обновлении группы.');
            console.error(error);
        }
    };

    const columns = [
        {
            title: 'Имя',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Фамилия',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (text, record) => (
                <Button type="link" danger onClick={() => handleUserDelete(record.id)}>
                    Удалить
                </Button>
            ),
        },
    ];

    return (
        <Layout>
            <AdminSidebar/>
            <Layout>
                <Header style={{color: 'black', fontSize: '20px', backgroundColor: 'white'}}>
                    Информация о группе
                </Header>
                <Content style={{margin: '20px', padding: '20px', backgroundColor: 'white'}}>
                    {loading || !groupData ? (
                        <Spin tip="Загрузка..."/>
                    ) : (
                        <>
                            <h2>{groupData.group_name}</h2>
                            <p>
                                <strong>Курс:</strong> {groupData.course.name}
                            </p>
                            <p>
                                <strong>Преподаватель:</strong> {groupData.teacher.first_name} {groupData.teacher.last_name}
                            </p>

                            <Button type="primary" onClick={() => setIsModalOpen(true)} style={{marginRight: '10px'}}>
                                Редактировать группу
                            </Button>

                            <Button type="primary" onClick={() => setIsTeacherModalOpen(true)}
                                    style={{marginRight: '10px'}}>
                                Перепривязать преподавателя
                            </Button>

                            <Button type="primary" onClick={() => setIsUserModalOpen(true)}>
                                Добавить пользователя
                            </Button>

                            <h3>Участники группы</h3>
                            <Table
                                dataSource={groupData.users}
                                columns={columns}
                                rowKey={(record) => record.id}
                                pagination={{pageSize: 5}}
                            />

                            <Modal
                                title="Редактировать группу"
                                open={isModalOpen}
                                onCancel={() => setIsModalOpen(false)}
                                onOk={form.submit}>
                                <Form form={form} onFinish={handleEditGroup} initialValues={groupData}>
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

                            <Modal
                                title="Перепривязать преподавателя"
                                open={isTeacherModalOpen}
                                onCancel={() => setIsTeacherModalOpen(false)}
                                onOk={teacherForm.submit}>
                                <Form form={teacherForm} onFinish={handleTeacherRebind}>
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

                            <Modal
                                title="Добавить пользователя"
                                open={isUserModalOpen}
                                onCancel={() => setIsUserModalOpen(false)}
                                onOk={userForm.submit}>
                                <Form form={userForm} onFinish={handleUserAdd}>
                                    <Form.Item
                                        label="Пользователь"
                                        name="user_id"
                                        rules={[{required: true, message: 'Выберите пользователя'}]}>
                                        <Select>
                                            {usersData.map((user) => (
                                                <Option key={user.id} value={user.id}>
                                                    {user.first_name} {user.last_name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default GroupDetailsPage;
