import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Sandbox from "../pages/Sandbox";
import Home from "../pages/Home";
import UserList from "../pages/UserList";
import RoleList from "../pages/RoleList";
import RightList from "../pages/RightList";
import NoPermission from "../pages/NoPermission";
import NewsAdd from "../pages/news/NewsAdd";
import NewsDraft from "../pages/news/NewsDraft";
import NewsCategory from "../pages/news/NewsCategory";
import NewsUpdate from "../pages/news/NewsUpdate";
import AuditList from "../pages/audit/AuditList";
import AuditNews from "../pages/audit/AuditNews";
import NotPublishYet from "../pages/publish/NotPublishYet";
import Published from "../pages/publish/Published";
import UnPublished from "../pages/publish/UnPublished";
import NewsPreview from "../pages/news/NewsPreview";
//check if user is login,if not, jump to login
function getLoginInfo() {
  return localStorage.getItem("token") ? <Sandbox /> : <Login />;
}
const path = getLoginInfo();
//local map
const localPathElement = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/news-manage/preview/:id": NewsPreview,
  "/news-manage/update/:id": NewsUpdate,
  "/audit-manage/audit": AuditNews,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": NotPublishYet,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": UnPublished,
};

const rights = JSON.parse(localStorage.getItem("token"))
  ? JSON.parse(localStorage.getItem("token"))[0].role.rights
  : [];

// const rights = [
//   {
//     id: 1,
//     title: "首页",
//     key: "/home",
//     pagepermisson: 1,
//     grade: 1,
//   },
//   {
//     id: 2,
//     title: "用户管理",
//     key: "/user-manage",
//     pagepermisson: 1,
//     grade: 1,
//   },
//   {
//     id: 7,
//     title: "权限管理",
//     key: "/right-manage",
//     pagepermisson: 1,
//     grade: 1,
//   },
//   {
//     id: 14,
//     title: "新闻管理",
//     key: "/news-manage",
//     pagepermisson: 1,
//     grade: 1,
//   },
//   {
//     id: 21,
//     title: "审核管理",
//     key: "/audit-manage",
//     pagepermisson: 1,
//     grade: 1,
//   },
//   {
//     id: 24,
//     title: "发布管理",
//     key: "/publish-manage",
//     pagepermisson: 1,
//     grade: 1,
//   },
// ];
//generate modular
const lazyLoad = (moduleName) => {
  const Module = localPathElement[moduleName];
  return <Module />;
};

//create router children
const generateRouters = () => {
  //see what right this user has
  const childList = rights.filter((item) => {
    //if item can find in localmap, return a router
    if (localPathElement.hasOwnProperty(item)) {
      return { path: item.substr(1), element: lazyLoad(item) };
    }
  });
  const lost = childList.map((item) => {
    return { path: item.substr(1), element: lazyLoad(item) };
  });
  return lost;
};
const routers = [
  { path: "/login", element: <Login /> },
  {
    path: "/sandbox",
    element: path,
    children: [
      ...generateRouters(),

      { path: "", element: <Navigate to="/sandbox/home" /> },
      { path: "*", element: <NoPermission /> },
    ],
  },
  { path: "/", element: <Navigate to="/sandbox/home" /> },
];
export default routers;
