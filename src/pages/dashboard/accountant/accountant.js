import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyPageA from './components/my-page-a.js'; // 我的
import ReimbursementAudit from './components/reimbursement-audit.js'; // 审核报销
import RpaUpload from './components/rpa-upload.js'; // RPA上传
import ReimbursementDetail from './components/reimbursement-detail.js';
//import './accountant.css';

function Accountant() {
    return(
        <div className = "container">
            {/*侧边栏*/}
            <div className = "sidebar">
                <ul>
                    <li>
                        <Link to = "/accountant/components/my-page-a">我的</Link>
                    </li>
                    <li>
                        <Link to = "/accountant/components/reimbursement-audit">审核报销</Link>
                    </li>
                    <li>
                        <Link to = "/accountant/components/rpa-upload">RPA上传</Link>
                    </li>
                </ul>
            </div>
            {/*内容*/}
            <div className = "content">
                <Routes>
                    <Route path = "components/my-page-a" element = {<MyPageA/>} />
                    <Route path = "components/reimbursement-audit" element = {<ReimbursementAudit/>} />
                    <Route path = "components/rpa-upload" element = {<RpaUpload/>} />
                    <Route path = "components/reimbursement-detail/:id" element={<ReimbursementDetail />} />
                </Routes>
            </div>
        </div>
        
    )
}

export default Accountant;