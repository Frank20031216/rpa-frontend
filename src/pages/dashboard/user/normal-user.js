import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './normal-user.css';
import MyPage from './components/my-page'; // 我的
import InvoiceReimbursement from './components/invoice-reimbursement'; // 发票报销
import ReimbursementRecord from './components/reimbursement-record'; // 报销记录

function NormalUser() {
    return(
        <div className = "container">
            {/*侧边栏*/}
            <div className = "sidebar">
                <ul>
                    <li>
                        <Link to = "/user/components/my-page">我的</Link>
                    </li>
                    <li>
                        <Link to = "/user/components/invoice-reimbursement">发票报销</Link>
                    </li>
                    <li>
                        <Link to = "/user/components/reimbursement-record">报销记录</Link>
                    </li>
                </ul>
            </div>
            {/*内容*/}
            <div className = "content">
                <Routes>
                    <Route path = "components/my-page" element = {<MyPage/>} />
                    <Route path = "components/invoice-reimbursement" element = {<InvoiceReimbursement/>} />
                    <Route path = "components/reimbursement-record" element = {<ReimbursementRecord/>} />
                </Routes>
            </div>
        </div>
        
    )
}

export default NormalUser;