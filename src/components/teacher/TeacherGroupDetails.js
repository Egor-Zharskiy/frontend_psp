import React, {useEffect, useState} from 'react';
import {Layout, Table, message, Button, Spin, Input, Modal, Select} from 'antd';
import {useParams} from 'react-router-dom';

const {Header, Content} = Layout;

const TeacherGroupDetails = () => {
    const {id} = useParams();

    const [groupData, setGroupData] = useState(null);
    const [gradesData, setGradesData] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [markToEdit, setMarkToEdit] = useState(null);
    const [newMark, setNewMark] = useState("");
    const [newComments, setNewComments] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const handleDeleteMark = async (gradeId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/courses/delete_mark/${gradeId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete mark');
            }

            message.success('Оценка успешно удалена');
            fetchGroupDetails();
        } catch (error) {
            message.error('Ошибка при удалении оценки');
            console.error(error);
        }
    };

    const fetchGroupDetails = async () => {
        try {
            setLoading(true);
            const groupResponse = await fetch(`http://127.0.0.1:8000/courses/get_detailed_group/${id}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
            });

            if (!groupResponse.ok) {
                throw new Error('Failed to fetch group details');
            }

            const groupData = await groupResponse.json();
            setGroupData(groupData);
            console.log(groupData.users);

            const users = groupData.users.map(user => ({
                id: user.id,
                name: `${user.first_name} ${user.last_name}`,
            }));
            setUsersList(users);

            const gradesResponse = await fetch(`http://127.0.0.1:8000/courses/get_group_marks/${id}`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
            });

            if (!gradesResponse.ok) {
                throw new Error('Failed to fetch grades');
            }

            const grades = await gradesResponse.json();
            const formattedGrades = grades.map((grade) => ({
                ...grade,
                user_name: `${grade.user.first_name} ${grade.user.last_name}`,
            }));
            setGradesData(formattedGrades);
        } catch (error) {
            message.error('Не удалось загрузить данные группы или оценки.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupDetails();
    }, [id]);

    const handleAddMark = async () => {
        try {
            const params = new URLSearchParams({
                grade: newMark,
                comment: newComments,
            });

            const response = await fetch(`http://127.0.0.1:8000/courses/add_mark/${selectedUser}/${id}?${params.toString()}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to add mark');
            }

            message.success('Оценка успешно добавлена');
            fetchGroupDetails();
            setIsModalVisible(false);
        } catch (error) {
            message.error('Ошибка при добавлении оценки');
            console.error(error);
        }
    };


    const handleEditMark = async () => {
        try {
            const params = new URLSearchParams({
                grade: newMark,
                comment: newComments,
            });

            const response = await fetch(`http://127.0.0.1:8000/courses/edit_mark/${markToEdit.id}?${params.toString()}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to edit mark');
            }

            message.success('Оценка успешно отредактирована');
            fetchGroupDetails();
            setIsModalVisible(false);
        } catch (error) {
            message.error('Ошибка при редактировании оценки');
            console.error(error);
        }
    };

    const usersColumns = [
        {
            title: 'Пользователь',
            dataIndex: 'name',
            key: 'name',
        },
    ];

    const gradesColumns = [
        {
            title: 'Пользователь',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Оценка',
            dataIndex: 'grade',
            key: 'grade',
        },
        {
            title: 'Комментарии',
            dataIndex: 'comments',
            key: 'comments',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <span>
                    <Button
                        type="link"
                        onClick={() => {
                            setMarkToEdit(record);
                            setNewMark(record.grade);
                            setNewComments(record.comments);
                            setIsModalVisible(true);
                        }}
                    >
                        Редактировать
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDeleteMark(record.id)}
                    >
                        Удалить
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <Layout>
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
                            <p><strong>Курс:</strong> {groupData.course.name}</p>

                            <h3>Участники группы</h3>
                            <Table
                                dataSource={usersList}
                                columns={usersColumns}
                                rowKey={(record) => record.id}
                            />

                            <h3>Оценки группы</h3>
                            <Table
                                dataSource={gradesData}
                                columns={gradesColumns}
                                rowKey={(record) => record.id}
                            />

                            <Button
                                type="primary"
                                onClick={() => setIsModalVisible(true)}
                                style={{marginTop: '20px'}}
                            >
                                Добавить оценку
                            </Button>
                        </>
                    )}
                </Content>
            </Layout>

            <Modal
                title={markToEdit ? 'Редактировать оценку' : 'Добавить оценку'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={markToEdit ? handleEditMark : handleAddMark}>
                <div>
                    <Select
                        placeholder="Выберите пользователя"
                        value={selectedUser}
                        onChange={setSelectedUser}
                        style={{width: '100%'}}>
                        {usersList.map((user) => (
                            <Select.Option key={user.id} value={user.id}>
                                {user.name}
                            </Select.Option>
                        ))}
                    </Select>

                    <Input
                        placeholder="Оценка"
                        value={newMark}
                        onChange={(e) => setNewMark(e.target.value)}
                        style={{marginTop: '10px'}}/>
                    <Input
                        placeholder="Комментарии"
                        value={newComments}
                        onChange={(e) => setNewComments(e.target.value)}
                        style={{marginTop: '10px'}}/>
                </div>
            </Modal>
        </Layout>
    );
};

export default TeacherGroupDetails;
