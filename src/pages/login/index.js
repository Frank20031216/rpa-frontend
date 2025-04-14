import React, { useEffect } from 'react';
import { useState } from 'react';
import './index.css'; // 创建一个 CSS 文件来处理样式
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";

function Login() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  
  const setCookie = (name, value) => {
    document.cookie = `${name}=${value}; path=/; SameSite=Lax`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var requestOptions = {
      method: 'POST',
      account: account,
      password: password,
    };

    console.log('登录请求参数:', requestOptions);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login?account=${encodeURIComponent(account)}&password=${encodeURIComponent(password)}`, requestOptions)
    //fetch(`https://122.228.26.226:58359/api/login?account=${encodeURIComponent(account)}&password=${encodeURIComponent(password)}`, requestOptions)
      .then(response => response.json())
      //.then(result => console.log(result))
      //.then(result => setRole(result.data.role))
      .then(result => {
        if(result.status == 200){
        // 保存token到cookie，仅限当前会话
        setCookie(result.data.tokenName, result.data.tokenValue);
        setRole(result.data.role);
      }else{
        toast.error(result.message);
      }
      })
      .catch(error => console.log('error', error));
  //   根据 role 字段进行页面跳转
  // setRole('user')

  };
  useEffect(() => {
    console.log(role);
    if (role !== null) {
      if (role === 'user') {
        navigate('/user/normal-user'); // 跳转到普通用户页面
      } else if (role === 'accountant') {
        navigate('/accountant/accountant'); // 跳转到财务页面
      } else if (role === 'admin') {
        navigate('/admin/admin'); // 跳转到管理员页面
      } else {
        toast.error('未知角色，无法跳转！');
      }
    }
  }, [role]);


  return (
    <div className="login-container">
      {/* Toast容器 */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="account">账号</label>
          <input
            type="text"
            id="account"
            name="account"
            className="form-control"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="请输入账号"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn btn-primary" >
            登录
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/register')}>
            注册
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;