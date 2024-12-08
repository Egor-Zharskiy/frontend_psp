import React from 'react';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import HomePage from './components/HomePage';
import CoursesPage from './components/CoursesPage';
import AboutPage from "./components/AboutPage";
import CoursePage from "./components/CoursePage";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import Register from "./components/Register";
import ProfilePage from "./components/ProfilePage";
import MyCourses from "./components/MyCourses";
import UserCourseDetails from "./components/UserCourseDetails";
import SchoolComments from "./components/SchoolComments";
import AdminMainPage from "./components/admin/AdminMainPage";
import UsersAdminPage from "./components/admin/UsersAdminPage";
import UserDetailsPage from "./components/admin/UserDetailsPage";
import AdminCoursesPage from "./components/admin/AdminCoursesPage";
import CreateCoursePage from "./components/admin/CreateCoursePage";
import EditCoursePage from "./components/admin/EditCoursePage";
import CourseRequestsPage from "./components/admin/CourseRequestsPage";
import CourseRequestDetailsPage from "./components/admin/CourseRequestDetailPage";
import CommentsAdminPage from "./components/admin/CommentsAdminPage";
import LanguagesPage from "./components/admin/LanguagesPage";
import LanguageDetailsPage from "./components/admin/LanguageDetailsPage";
import GroupsPage from "./components/admin/GroupsPage";
import GroupDetailsPage from "./components/admin/GroupDetailsPage";
import AgeGroupAdmin from "./components/admin/AgeGroupAdmin";
import LanguageLevelsPage from "./components/admin/LanguageLevelsPage";
import TeacherUsersPage from "./components/teacher/TeacherUsersPage";
import TeacherGroupDetails from "./components/teacher/TeacherGroupDetails";

function App() {
    return (
        <Router>
            <AppContent/>
        </Router>
    );
}

function AppContent() {
    const location = useLocation();

    const adminRoutes = ['/admin'];

    const showHeader = !adminRoutes.some(route => location.pathname.startsWith(route));

    return (
        <>
            {showHeader && <Header/>}
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/courses" element={<CoursesPage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/course/:id" element={<CoursePage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/my_courses" element={<MyCourses/>}/>
                <Route path="/user_course/:id" element={<UserCourseDetails/>}/>
                <Route path="/comments" element={<SchoolComments/>}/>


                <Route path="/admin" element={<AdminMainPage/>}/>
                <Route path="/admin/users" element={<UsersAdminPage/>}/>
                <Route path="/admin/users/:id" element={<UserDetailsPage/>}/>
                <Route path="/admin/courses/" element={<AdminCoursesPage/>}/>
                <Route path="/admin/courses/create/" element={<CreateCoursePage/>}/>
                <Route path="/admin/courses/edit_course/:id" element={<EditCoursePage/>}/>
                <Route path="/admin/requests/" element={<CourseRequestsPage/>}/>
                <Route path="/admin/requests/request/:id" element={<CourseRequestDetailsPage/>}/>
                <Route path="/admin/comments/" element={<CommentsAdminPage/>}/>
                <Route path="/admin/languages/" element={<LanguagesPage/>}/>
                <Route path="/admin/languages/:id" element={<LanguageDetailsPage/>}/>
                <Route path="/admin/groups/" element={<GroupsPage/>}/>
                <Route path="/admin/groups/:id" element={<GroupDetailsPage/>}/>
                <Route path="/admin/age-groups/" element={<AgeGroupAdmin/>}/>
                <Route path="/admin/language-levels/" element={<LanguageLevelsPage/>}/>

                <Route path="/teacher/groups/" element={<TeacherUsersPage/>}/>
                <Route path="/teacher/groups/:id" element={<TeacherGroupDetails/>}/>


            </Routes>
        </>
    );
}

export default App;
