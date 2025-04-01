import React, { useState } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';
import Toast from './components/toast';


function Register() {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    account: '',
    password: '',
    confirmPassword: '',
    realName: '',
    company: '',
    role: 'user',
  });

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      //alert('密码与确认密码不一致！');
      setToastMessage('密码与确认密码不一致！');
      setToastType('error');
      return;
    }
    // 提交逻辑（例如调用API）在这里实现
    console.log('注册表单数据:', formData);


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      account: formData.account,
      password: formData.password,
      role: formData.role,
      realName: formData.realName,
      company: formData.company,
    });
    console.log(raw);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://122.228.26.226:58359/api/register", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status !== '200') {
          //alert(`错误: ${result.message}`);
          setToastMessage(`错误: ${result.message}`);
          setToastType('error');
          return Promise.reject(result.message);
        }
        setToastMessage('注册成功！');
        setToastType('success');
        //alert('注册成功！');
        console.log('注册成功:', result);
      })
      .catch(error => {
        setToastMessage('注册失败，请稍后再试！');
        setToastType('error');
        console.log('error', error);
      });
  };
  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>账号:</label>
          <input
            type="text"
            name="account"
            value={formData.account}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="请输入账号"
          />
        </div>
        <div className="form-group">
          <label>密码:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="请输入密码"
          />
        </div>
        <div className="form-group">
          <label>重复密码:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="请重复密码"
          />
        </div>
        <div className="form-group">
          <label>姓名:</label>
          <input
            type="text"
            name="realName"
            value={formData.realName}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="请输入姓名"
          />
        </div>
        <div className="form-group">
          <label>单位:</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="请选择单位"
          />
        </div>
        <div className="form-group">
          <label>用户性质:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="select"
          >
            <option value="user">普通用户</option>
            <option value="accountant">财务</option>
            <option value="admin">管理员</option>
          </select>
        </div>
        <div className="button-group">
          <button type="submit" className="btn btn-primary">注册</button>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>返回登录</button>
        </div>
      </form>
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />}
    </div>
  );
};

export default Register;
