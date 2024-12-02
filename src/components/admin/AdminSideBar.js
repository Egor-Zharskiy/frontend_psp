// components/AdminSidebar.js
import React from "react";
import {Layout, Menu} from "antd";
import {Link} from "react-router-dom";

const {Sider} = Layout;

const AdminSidebar = () => {
    const headerBackgroundColor = "rgb(66,163,142)";

    return (
        <Sider
            style={{
                backgroundColor: headerBackgroundColor,
                minHeight: "100vh",
            }}>
            <div
                className="logo text-white text-center py-4"
                style={{backgroundColor: headerBackgroundColor}}>
            </div>
            <Menu
                theme="dark"
                mode="inline"
                style={{
                    backgroundColor: headerBackgroundColor,
                    color: "white",
                }}>
                <Menu.Item key="1" style={{color: "white"}}>
                    <Link to="/admin/" style={{color: "white"}}>Главная</Link>
                </Menu.Item>
                <Menu.Item key="2" style={{color: "white"}}>
                    <Link to="/admin/users/" style={{color: "white"}}>Пользователи</Link>
                </Menu.Item>
                <Menu.Item key="3" style={{color: "white"}}>
                    <Link to="/admin/courses/" style={{color: "white"}}>Курсы</Link>
                </Menu.Item>
                <Menu.Item key="4" style={{color: "white"}}>
                    <Link to="/admin/requests/" style={{color: "white"}}>Заявки</Link>
                </Menu.Item>
                <Menu.Item key="5" style={{color: "white"}}>
                    <Link to="/admin/reviews/" style={{color: "white"}}>Отзывы</Link>
                </Menu.Item>
                <Menu.Item key="6" style={{color: "white"}}>
                    <Link to="/admin/settings/" style={{color: "white"}}>Настройки</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default AdminSidebar;
