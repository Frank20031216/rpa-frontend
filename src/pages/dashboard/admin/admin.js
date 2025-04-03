import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

// import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import './normal-user.css';
import MyPage from './components/my-page'; // 我的
import UserManagement from './components/user_management'; // 用户管理
import InvoiceCheck from './components/invoice_check'; // 发票管理

function Admin() {
    return(
        <div className = "container">
            {/*侧边栏*/}
            <div className = "sidebar">
                <ul>
                    <li>
                        <Link to = "/admin/components/my-page">我的</Link>
                    </li>
                    <li>
                        <Link to = "/admin/components/user_management">用户管理</Link>
                    </li>
                    <li>
                        <Link to = "/admin/components/invoice_check">发票管理</Link>
                    </li>
                </ul>
            </div>
            {/*内容*/}
            <div className = "content">
                <Routes>
                    <Route path = "components/my-page" element = {<MyPage/>} />
                    <Route path = "components/user_management" element = {<UserManagement/>} />
                    <Route path = "components/invoice_check" element = {<InvoiceCheck/>} />
                </Routes>
            </div>
        </div>
        
    )
}
export default Admin;
