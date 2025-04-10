import React, { useState } from "react";
import "./user_management.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserManagement() {
  // 模拟用户数据
  const [users, setUsers] = useState([
    {
      id: "1",
      username: "user1",
      password: "password1",
      role: "用户",
      name: "张三",
      address: "北京市海淀区",
      status: "active",
      totalReimbursement: 5000,
      totalPaid: 3000,
      email: "user1@example.com",
      phone: "13800138000",
      company: "公司A",
    },
    {
      id: "2",
      username: "user2",
      password: "password2",
      role: "会计",
      name: "李四",
      address: "上海市浦东新区",
      status: "inactive",
      totalReimbursement: 8000,
      totalPaid: 6000,
      email: "user2@example.com",
      phone: "13800138001",
      company: "公司B",
    },
    {
      id: "3",
      username: "user3",
      password: "password3",
      role: "管理员",
      name: "王五",
      address: "广州市天河区",
      status: "active",
      totalReimbursement: 10000,
      totalPaid: 9000,
      email: "user3@example.com",
      phone: "13800138002",
      company: "公司C",
    },
  ]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  // 错误消息
  const [errors, setErrors] = useState({});

  // 模态框状态
  const [showModal, setShowModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [formValues, setFormValues] = useState({
    id: "",
    username: "",
    password: "",
    role: "用户",
    name: "",
    address: "",
    status: "active",
    totalReimbursement: 0,
    totalPaid: 0,
    email: "",
    phone: "",
    company: "",
  });

  // 表单处理
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // 表单验证
  const validateForm = () => {
    if (!formValues.username.trim()) {
      toast.error("账号不能为空");
      return false;
    }
    if (!formValues.password.trim()) {
      toast.error("密码不能为空");
      return false;
    }
    if (!formValues.name.trim()) {
      toast.error("姓名不能为空");
      return false;
    }
    if (!formValues.address.trim()) {
      toast.error("地址不能为空");
      return false;
    }
    if (!formValues.email.trim()) {
      toast.error("邮件不能为空");
      return false;
    }
    if (!formValues.phone.trim()) {
      toast.error("手机号不能为空");
      return false;
    }
    if (!formValues.company.trim()) {
      toast.error("单位不能为空");
      return false;
    }
    return true;
  };

  // 初始化表单
  const initialize = () => {
    setFormValues({
      id: "",
      username: "",
      password: "",
      role: "用户",
      name: "",
      address: "",
      status: "active",
      totalReimbursement: 0,
      totalPaid: 0,
      email: "",
      phone: "",
      company: "",
    });
  };

  // 检查用户ID是否已存在
  const isUserIdExists = (userId) => {
    return users.some((user) => user.id === userId);
  };

  // 保存用户信息到后端
  const saveUserToBackend = async (userData, isUpdate) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(userData);

      const requestOptions = {
        method: isUpdate ? "PUT" : "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        isUpdate ? "/admin/updateUser" : "/admin/addUser",
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error);
      toast.error("保存失败，请稍后重试！");
      return null;
    }
  };

  // 添加用户
  const handleAddUser = async () => {
    if (validateForm()) {
      const newUser = {
        id: formValues.id,
        username: formValues.username,
        password: formValues.password,
        role: formValues.role,
        name: formValues.name,
        address: formValues.address,
        status: formValues.status,
        totalReimbursement: parseFloat(formValues.totalReimbursement),
        totalPaid: parseFloat(formValues.totalPaid),
        email: formValues.email,
        phone: formValues.phone,
        company: formValues.company,
      };

      if (isUserIdExists(formValues.id)) {
        toast.error("用户ID已存在，无法添加新用户");
        return;
      }

      const savedUser = await saveUserToBackend(newUser, false);

      if (savedUser) {
        setUsers([...users, savedUser]);
        setShowModal(false);
        initialize();
        toast.success("用户添加成功");
      }
    }
  };

  // 编辑用户
  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    setFormValues({
      id: userToEdit.id,
      username: userToEdit.username,
      password: userToEdit.password,
      role: userToEdit.role,
      name: userToEdit.name,
      address: userToEdit.address,
      status: userToEdit.status,
      totalReimbursement: userToEdit.totalReimbursement.toString(),
      totalPaid: userToEdit.totalPaid.toString(),
      email: userToEdit.email,
      phone: userToEdit.phone,
      company: userToEdit.company,
    });
    setEditUserId(userId);
    setShowModal(true);
  };

  // 更新用户
  const handleUpdateUser = async () => {
    if (validateForm()) {
      const updatedUserData = {
        id: formValues.id,
        username: formValues.username,
        password: formValues.password,
        role: formValues.role,
        name: formValues.name,
        address: formValues.address,
        status: formValues.status,
        totalReimbursement: parseFloat(formValues.totalReimbursement),
        totalPaid: parseFloat(formValues.totalPaid),
        email: formValues.email,
        phone: formValues.phone,
        company: formValues.company,
      };

      if (isUserIdExists(formValues.id) && formValues.id !== editUserId) {
        toast.error("用户ID已存在，无法更新用户");
        return;
      }

      const updatedUser = await saveUserToBackend(updatedUserData, true);

      if (updatedUser) {
        setUsers(users.map((user) => (user.id === editUserId ? updatedUser : user)));
        setShowModal(false);
        initialize();
        setEditUserId(null);
        toast.success("用户更新成功");
      }
    }
  };

  // 删除用户
  const handleDeleteUser = (userId) => {
    if (window.confirm("确定要删除此用户吗？")) {
      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
      toast.success("用户删除成功");
    }
  };

  // 处理取消按钮
  const handleCancel = () => {
    setShowModal(false);
    setEditUserId(null);
    initialize();
  };

  // 搜索功能
  const filteredUsers = users.filter((item) => {
    if (searchId && !item.id.includes(searchId)) return false;
    if (searchName && !item.name.includes(searchName)) return false;
    if (searchRole && !item.role.includes(searchRole)) return false;
    if (searchCompany && !item.company.includes(searchCompany)) return false;
    return true;
  });

  return (
    <div className="user-management-container">
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
      {/* 顶部导航 */}
      <div className="dashboard-header">
        <h1>智能报销系统 - 用户管理界面</h1>
      </div>

      {/* 用户管理部分 */}
      <div className="user-management">
        <div className="user-actions">
          <button onClick={() => setShowModal(true)}>新增用户</button>
          <input
            type="text"
            placeholder="搜索用户id"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <input
            type="text"
            placeholder="搜索用户姓名"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="搜索用户身份"
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
          />
          <input
            type="text"
            placeholder="搜索用户单位"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>用户ID</th>
              <th>账号</th>
              <th>身份</th>
              <th>姓名</th>
              <th>地址</th>
              <th>账号状态</th>
              <th>报销金额合计</th>
              <th>已付金额合计</th>
              <th>邮件</th>
              <th>手机号</th>
              <th>单位</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>
                  {user.status === "active" ? (
                    <span className="status-active">活跃</span>
                  ) : (
                    <span className="status-inactive">不活跃</span>
                  )}
                </td>
                <td>{user.totalReimbursement}</td>
                <td>{user.totalPaid}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.company}</td>
                <td>
                  <button onClick={() => handleEditUser(user.id)}>编辑</button>
                  <button onClick={() => handleDeleteUser(user.id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 模态框 */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editUserId ? "编辑用户" : "新增用户"}</h2>

            <div className="form-container">
              <div className="form-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label>ID:</label>
                    <input
                      type="text"
                      name="id"
                      value={formValues.id}
                      onChange={handleFormChange}
                      disabled={!!editUserId}
                    />
                  </div>
                  <div className="form-group">
                    <label>账号:</label>
                    <input
                      type="text"
                      name="username"
                      value={formValues.username}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>密码:</label>
                    <input
                      type="password"
                      name="password"
                      value={formValues.password}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>身份:</label>
                    <select
                      name="role"
                      value={formValues.role}
                      onChange={handleFormChange}
                    >
                      <option value="用户">用户</option>
                      <option value="会计">会计</option>
                      <option value="管理员">管理员</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>姓名:</label>
                    <input
                      type="text"
                      name="name"
                      value={formValues.name}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <div className="form-column">
                  <div className="form-group">
                    <label>地址:</label>
                    <input
                      type="text"
                      name="address"
                      value={formValues.address}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>账号状态:</label>
                    <select
                      name="status"
                      value={formValues.status}
                      onChange={handleFormChange}
                    >
                      <option value="active">活跃</option>
                      <option value="inactive">不活跃</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>报销金额合计:</label>
                    <input
                      type="number"
                      name="totalReimbursement"
                      value={formValues.totalReimbursement}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>已付金额合计:</label>
                    <input
                      type="number"
                      name="totalPaid"
                      value={formValues.totalPaid}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>邮件:</label>
                    <input
                      type="email"
                      name="email"
                      value={formValues.email}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>手机号:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formValues.phone}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>单位:</label>
                    <input
                      type="text"
                      name="company"
                      value={formValues.company}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleCancel}>取消</button>
              {editUserId ? (
                <button onClick={handleUpdateUser}>更新</button>
              ) : (
                <button onClick={handleAddUser}>添加</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;