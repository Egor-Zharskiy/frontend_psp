import React, {useEffect, useState} from 'react';
import {Layout, Table, Button, Modal, Form, Input, message, Spin, Select} from 'antd';
import {useNavigate} from 'react-router-dom';

const {Header, Content} = Layout;

const GroupsPage = () => {
    const [groupsData, setGroupsData] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const [teachersData, setTeachersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://127.0.0.1:8000/courses/get_teacher_groups/10', {
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


    const handleViewDetails = (id) => {
        navigate(`/teacher/groups/${id}`);
    };

    const columns = [
        {
            title: 'Название группы',
            dataIndex: 'group_name',
            key: 'group_name',
        },

        {
            title: 'Действия',
            key: 'actions',
            render: (text, record) => (
                <Button href={`/teacher/groups/${record.id}`} type="link" onClick={() => handleViewDetails(record.id)}>
                    Подробнее
                </Button>
            ),
        },
    ];

    return (
        <Layout>
            <Header style={{color: 'black', fontSize: '20px', backgroundColor: "white"}}>Управление
                группами</Header>
            <Content style={{margin: '20px', padding: '20px', backgroundColor: 'white'}}>

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


        </Layout>
    );
};

export default GroupsPage;
