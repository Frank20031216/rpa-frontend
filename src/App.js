import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import React from 'react';
import Login from './pages/login/index.js';
import Register from './pages/login/register.js';
import NormalUser from './pages/dashboard/user/normal-user.js';
import Accountant from './pages/dashboard/accountant/accountant.js';
import Admin from './pages/dashboard/admin/admin.js';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 登录页面路由 */}
          <Route path="/" element={<Login />} />
          {/* 注册页面路由 */}
          <Route path="/register" element={<Register />} />
          {/* 普通用户页面路由 */}
          <Route path="/user/*" element={<NormalUser />} />
          {/* 财务页面路由 */}
          <Route path="/accountant/*" element={<Accountant />} />
          {/* 管理员页面路由 */}          
          <Route path="/admin" element={<Admin />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* 登录页面路由 */}
//           <Route path="/" element={<Login />} />
//           {/* 注册页面路由 */}
//           <Route path="/register" element={<Register />} />
//           {/* 普通用户页面路由 */}
//           <Route path="/user/*" element={<NormalUser />} />
//           {/* 财务页面路由 */}
//           <Route path="/accountant/*" element={<Accountant />} />
//           {/* 管理员页面路由 */}          
//           <Route path="/admin" element={<Admin />} />
          
//         </Routes>
//       </div>
//     </Router>
//   );
// }
