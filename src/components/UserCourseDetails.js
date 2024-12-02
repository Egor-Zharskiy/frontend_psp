import React, { useEffect, useState } from "react";
import { Typography, List, Card, Divider, Row, Col } from "antd";

const { Title, Text } = Typography;

const UserCourseDetails = ({ courseId }) => {
    const [courseData, setCourseData] = useState([]);
    const [teacher, setTeacher] = useState(null);
    const [courseInfo, setCourseInfo] = useState(null);
    const [groupName, setGroupName] = useState("");

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://127.0.0.1:8000/courses/get_student_marks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Ошибка загрузки данных курса");
                }
                const data = await response.json();
                setCourseData(data);

                if (data.length > 0) {
                    setTeacher(data[0].group.teacher);
                    setCourseInfo(data[0].group.course);
                    setGroupName(data[0].group.group_name);
                }
            } catch (error) {
                console.error("Ошибка загрузки данных курса:", error);
            }
        };

        fetchCourseData();
    }, [courseId]);

    return (
        <div className="container mx-auto p-4">
            <Title level={3} className="text-center mb-2">Детали курса</Title>

            <Row gutter={[16, 16]} className="mb-4">
                {courseInfo && (
                    <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column'}}>
                        <Card size="small" style={{ height: '100%', backgroundColor: 'rgb(243, 244, 246)'}}>
                            <Title level={5}>{courseInfo.name}</Title>
                            <Text><b>Описание:</b> {courseInfo.description}</Text>
                            <br />
                            <Text><b>Группа:</b> {groupName}</Text>
                        </Card>
                    </Col>
                )}

                {teacher && (
                    <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column' }}>
                        <Card size="small" style={{ height: '100%', backgroundColor: 'rgb(243, 244, 246)'}}>
                            <Title level={5}>Преподаватель</Title>
                            <Text><b>Имя:</b> {teacher.first_name} {teacher.last_name}</Text>
                            <br />
                            <Text><b>Email:</b> {teacher.email}</Text>
                            <br />
                            <Text><b>Телефон:</b> {teacher.phone_number}</Text>
                        </Card>
                    </Col>
                )}
            </Row>

            <Divider />

            <Title level={4} className="mb-2">Ваши отметки</Title>
            <List
                itemLayout="horizontal"
                dataSource={courseData}
                renderItem={(item) => (
                    <List.Item>
                        <Card size="small" className="w-full">
                            <Row>
                                <Col span={8}>
                                    <Text><b>Оценка:</b> {item.grade}</Text>
                                </Col>
                                <Col span={8}>
                                    <Text><b>Дата:</b> {new Date(item.date_assigned).toLocaleDateString()}</Text>
                                </Col>
                                <Col span={8}>
                                    <Text><b>Комментарий:</b> {item.comments || "Нет комментариев"}</Text>
                                </Col>
                            </Row>
                        </Card>
                    </List.Item>
                )}
            />
            {courseData.length === 0 && (
                <Text>У вас пока нет отметок по этому курсу.</Text>
            )}
        </div>
    );
};

export default UserCourseDetails;
