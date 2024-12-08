import React, {useState, useEffect} from "react";
import {Layout, Table, Tag, Select, message, Button} from "antd";
import {useNavigate} from "react-router-dom";
import AdminSidebar from "./AdminSideBar";

const {Header, Content} = Layout;
const {Option} = Select;

const CourseRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseRequests = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/courses/get_course_requests",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Ошибка при загрузке заявок на курсы");
                const data = await response.json();
                setRequests(data);
                setFilteredRequests(data);
            } catch (error) {
                message.error("Не удалось загрузить заявки на курсы");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseRequests();
    }, []);

    const handleFilterChange = (value) => {
        setStatusFilter(value);

        if (value === "all") {
            setFilteredRequests(requests);
        } else {
            const filtered = requests.filter((request) => request.status === value);
            setFilteredRequests(filtered);
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/admin/requests/request/${id}`);
    };

    const columns = [
        {
            title: "ID заявки",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "ID пользователя",
            dataIndex: "user_id",
            key: "user_id",
        },
        {
            title: "ID курса",
            dataIndex: "course_id",
            key: "course_id",
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = "blue";
                if (status === "approved") color = "green";
                else if (status === "rejected") color = "red";
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Дата создания",
            dataIndex: "created_at",
            key: "created_at",
            render: (created_at) => new Date(created_at).toLocaleString(),
        },
        {
            title: "Обработано",
            dataIndex: "is_processed",
            key: "is_processed",
            render: (is_processed) => (is_processed ? "Да" : "Нет"),
        },
        {
            title: "Архивировано",
            dataIndex: "is_archived",
            key: "is_archived",
            render: (is_archived) => (is_archived ? "Да" : "Нет"),
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, record) => (
                <Button type="link" onClick={() => handleViewDetails(record.id)}>
                    Подробнее
                </Button>
            ),
        },
    ];

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
                    <h1 className="text-xl">Заявки на курсы</h1>
                </Header>
                <Content className="p-4 bg-gray-50">
                    <div style={{marginBottom: 16}}>
                        <Select
                            value={statusFilter}
                            onChange={handleFilterChange}
                            style={{width: 200}}
                        >
                            <Option value="all">Все</Option>
                            <Option value="pending">В ожидании</Option>
                            <Option value="approved">Одобрено</Option>
                            <Option value="declined">Отклонено</Option>
                        </Select>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredRequests}
                        rowKey="id"
                        loading={loading}
                    />
                </Content>
            </Layout>
        </Layout>
    );
};

export default CourseRequestsPage;
