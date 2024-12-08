// pages/AdminMainPage.js
import React from "react";
import {Layout, Breadcrumb} from "antd";
import AdminSidebar from "./AdminSideBar";

const {Header, Content, Footer} = Layout;

const AdminMainPage = () => {
    return (
        <Layout>
            <AdminSidebar/>
            <Layout>
                <Header
                    className="shadow-md px-4"
                    style={{
                        backgroundColor: "white",
                        color: "black",
                    }}>
                    <h1 className="text-xl">Панель администратора</h1>
                </Header>
                <Content className="p-4 bg-gray-50">
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item>Главная</Breadcrumb.Item>
                        <Breadcrumb.Item>Панель</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="bg-white p-6 shadow rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Добро пожаловать!</h2>
                        <p>Здесь вы можете управлять данными вашего приложения.</p>
                    </div>
                </Content>

            </Layout>
        </Layout>
    );
};

export default AdminMainPage;
