import React, { useState, useEffect, use } from "react";
import "./user_management.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserManagement() {
  // 用户数据状态
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 搜索功能
  const [uid, setUid] = useState("");
  const [realName, setRealName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [editCount, setEditCount] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  // 从后端获取用户数据
  const fetchUsers = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams(searchParams).toString();
      const url = queryParams
        ? `${process.env.REACT_APP_API_BASE_URL}/admin/pageUser?page=1&pageSize=10&${queryParams}`
        : `${process.env.REACT_APP_API_BASE_URL}/admin/pageUser?page=1&pageSize=10`;

      const requestOptions = {
        method: "GET",
        redirect: "follow",
        credentials: "include",
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result) {

        setUsers(result.data.record);
        
        setLoading(false);
      } 
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      toast.error("获取用户数据失败，请稍后重试！");
    } finally {
      setLoading(false);
    }
  };

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


    // uid: "",
    // account: "",
    // password: "",
    // role: "用户",
    // realName: "",
    // address: "",
    // accountStatus: "active",
    // totalReimbursementAmounts: 0.00,
    // totalAmountPaid: 0.00,
    // email: "",
    // phone: "",
    // company: "",



    if (!formValues.account.trim()) {
      toast.error("账号不能为空");
      return false;
    }
    // if (!formValues.password.trim()) {
    //   toast.error("密码不能为空");
    //   return false;
    // }
    if (!formValues.realName.trim()) {
      toast.error("姓名不能为空");
      return false;
    }
    // if (!formValues.address.trim()) {
    //   toast.error("地址不能为空");
    //   return false;
    // }
    // if (!formValues.email.trim()) {
    //   toast.error("邮件不能为空");
    //   return false;
    // }
    // if (!formValues.phone.trim()) {
    //   toast.error("手机号不能为空");
    //   return false;
    // }
    // if (!formValues.company.trim()) {
    //   toast.error("单位不能为空");
    //   return false;
    // }
    return true;
  };

  // 初始化表单
  const initialize = () => {
    setFormValues({
      uid: "",
      account: "",
      password: "",
      role: "用户",
      realName: "",
      address: "",
      accountStatus: "active",
      totalReimbursementAmounts: 0,
      totalAmountPaid: 0,
      email: "",
      phone: "",
      company: "",
    });
  };

  // 检查用户ID是否已存在
  const isUserIdExists = (userId) => {
    return users.some((user) => user.uid === userId);
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
        credentials: "include",
      };

      const response = await fetch(
        isUpdate ? `${process.env.REACT_APP_API_BASE_URL}/admin/updateUser` : "/admin/addUser",
        requestOptions
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result.status ==="200") {
        // return result.data;
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
      toast.error("保存失败，请稍后重试！");
      return null;
    }
  };

  // 添加用户
  const handleAddUser = async () => {
    if (validateForm()) {
      const newUser = {
        uid: formValues.uid,
        account: formValues.account,
        password: formValues.password,
        role: formValues.role,
        realName: formValues.realName,
        address: formValues.address,
        accountStatus: formValues.accountStatus,
        totalReimbursementAmounts: parseFloat(formValues.totalReimbursementAmounts),
        totalAmountPaid: parseFloat(formValues.totalAmountPaid),
        email: formValues.email,
        phone: formValues.phone,
        company: formValues.company,
      };

      if (isUserIdExists(formValues.uid)) {
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
    

    const userToEdit = users.find((user) => user.uid === userId);
    setFormValues({
      uid: userToEdit.uid,
      account: userToEdit.account,
      // password: userToEdit.password,
      role: userToEdit.role,
      realName: userToEdit.realName,
      address: userToEdit.address,
      accountStatus: userToEdit.accountStatus,
      totalReimbursementAmounts: userToEdit.totalReimbursementAmounts,
      totalAmountPaid: userToEdit.totalAmountPaid,
      email: userToEdit.email,
      phone: userToEdit.phone,
      company: userToEdit.company,
    });
    console.log(userToEdit.password)
    setEditUserId(userId);
    setShowModal(true);
  };

  // 更新用户
  const handleUpdateUser = async () => {
    
    if (validateForm()) {
      const updatedUserData = {
        uid: formValues.uid,
        account: formValues.account,
        password: formValues.password,
        role: formValues.role,
        realName: formValues.realName,
        address: formValues.address,
        accountStatus: formValues.accountStatus,
        totalReimbursementAmounts: parseFloat(formValues.totalReimbursementAmounts),
        totalAmountPaid: parseFloat(formValues.totalAmountPaid),
        email: formValues.email,
        phone: formValues.phone,
        company: formValues.company,
      };

      if (isUserIdExists(formValues.uid) && formValues.uid !== editUserId) {
        toast.error("用户ID已存在，无法更新用户");
        return;
      }

      const updatedUser = await saveUserToBackend(updatedUserData, true);

      console.log(updatedUser);

      if (updatedUser) {
        // setUsers(users.map((user) => (user.uid === editUserId ? updatedUser : user)));
        setShowModal(false);
        
        setEditUserId(null);
        toast.success("用户更新成功");
      }
      initialize();
    }
  };

  // 删除用户
  const handleDeleteUser = (userId) => {
    if (window.confirm("确定要删除此用户吗？")) {
      const updatedUsers = users.filter((user) => user.uid !== userId);
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
  
  // 模态框状态
  const [showModal, setShowModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [formValues, setFormValues] = useState({
    uid: "",
    account: "",
    password: "",
    role: "用户",
    realName: "",
    address: "",
    accountStatus: "active",
    totalReimbursementAmounts: 0.00,
    totalAmountPaid: 0.00,
    email: "",
    phone: "",
    company: "",
  });

  // 搜索功能
  const handleSearch = () => {
    const searchParams = {};
    if (uid) searchParams.uid = uid;
    if (realName) searchParams.realName = realName;
    if (role) searchParams.role = role;
    if (company) searchParams.company = company;

    fetchUsers(searchParams);
  };
  // console.log(users);
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

      {loading ? (
        <div className="loading">加载中...</div>
      ) : error ? (
        <div className="error">错误: {error}</div>
      ) : (
        <>
          {/* 用户管理部分 */}
          <div className="user-management">
            <div className="user-actions">
              <button onClick={() => setShowModal(true)}>新增用户</button>
              <input
                type="text"
                placeholder="搜索用户id"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
              />
              <input
                type="text"
                placeholder="搜索用户姓名"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
              />
              <input
                type="text"
                placeholder="搜索用户身份"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <input
                type="text"
                placeholder="搜索用户单位"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <button onClick={handleSearch}>搜索</button>
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
                {users.map((user) => (
                  <tr key={user.uid}>
                    <td>{user.uid}</td>
                    <td>{user.account}</td>
                    <td>{user.role}</td>
                    <td>{user.realName}</td>
                    <td>{user.address}</td>
                    <td>
                      {user.accountStatus === "active" ? (
                        <span className="accountStatus-active">活跃</span>
                      ) : (
                        <span className="accountStatus-inactive">不活跃</span>
                      )}
                    </td>
                    <td>{user.totalReimbursementAmounts}</td>
                    <td>{user.totalAmountPaid}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.company}</td>
                    <td>
                      <button onClick={() => handleEditUser(user.uid)}>编辑</button>
                      <button onClick={() => handleDeleteUser(user.uid)}>删除</button>
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
                          name="uid"
                          value={formValues.uid}
                          onChange={handleFormChange}
                          disabled={!!editUserId}
                        />
                      </div>
                      <div className="form-group">
                        <label>账号:</label>
                        <input
                          type="text"
                          name="account"
                          value={formValues.account}
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
                          <option value="user">用户</option>
                          <option value="accountant">会计</option>
                          <option value="admin">管理员</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>姓名:</label>
                        <input
                          type="text"
                          name="realName"
                          value={formValues.realName}
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
                          name="accountStatus"
                          value={formValues.accountStatus}
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
                          name="totalReimbursementAmounts"
                          value={formValues.totalReimbursementAmounts}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>已付金额合计:</label>
                        <input
                          type="number"
                          name="totalAmountPaid"
                          value={formValues.totalAmountPaid}
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
        </>
      )}
    </div>
  );
}

export default UserManagement;