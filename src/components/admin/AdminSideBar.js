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
                    <Link to="/admin/groups/" style={{color: "white"}}>Группы</Link>
                </Menu.Item>
                <Menu.Item key="6" style={{color: "white"}}>
                    <Link to="/admin/languages/" style={{color: "white"}}>Языки обучения</Link>
                </Menu.Item>
                <Menu.Item key="7" style={{color: "white"}}>
                    <Link to="/admin/age-groups/" style={{color: "white"}}>Возрастные группы</Link>
                </Menu.Item>
                <Menu.Item key="8" style={{color: "white"}}>
                    <Link to="/admin/language-levels/" style={{color: "white"}}>Уровни языков</Link>
                </Menu.Item>
                <Menu.Item key="9" style={{color: "white"}}>
                    <Link to="/admin/comments/" style={{color: "white"}}>Отзывы</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default AdminSidebar;
