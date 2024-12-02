import React, {useEffect, useState} from "react";
import {List, Avatar, Spin} from "antd";

const CommentsPage = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/comments/get_verified_comments")
            .then((response) => response.json())
            .then((data) => {
                setComments(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка загрузки комментариев:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large"/>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6 sm:mt-4 md:mt-6 lg:mt-8 ">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    Отзывы о школе
                </h1>
                <List
                    itemLayout="horizontal"
                    dataSource={comments}
                    renderItem={(comment) => (
                        <div className="bg-gray-100 p-4 mb-4 rounded-lg shadow-sm">
                            <List.Item className="border-none">
                                <List.Item.Meta
                                    avatar={
                                        <Avatar className="bg-green-300">
                                            {comment.user.first_name[0]}
                                            {comment.user.last_name[0]}
                                        </Avatar>
                                    }
                                    title={
                                        <span className="text-lg font-semibold text-gray-700">
                      {comment.user.first_name} {comment.user.last_name}
                    </span>
                                    }
                                    description={
                                        <div>
                                            <p className="text-gray-600">{comment.comment}</p>
                                            <p className="text-sm text-gray-400">
                                                {new Date(comment.date_added).toLocaleString()}
                                            </p>
                                        </div>
                                    }
                                />
                            </List.Item>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default CommentsPage;
