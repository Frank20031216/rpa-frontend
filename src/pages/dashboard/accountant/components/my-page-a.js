import React, { useState, useEffect } from 'react';
import './my-page-a.css';
import { toast, ToastContainer } from "react-toastify";


// MyPage 组件
function MyPage() {
  const [userInfo, setUserInfo] = useState({
    timestamp: 0,
    status: '',
    message: '',
    data: {
      account: '',
      accountStatus: '',
      address: '',
      company: '',
      createTime: '',
      email: '',
      password: '',
      phone: '',
      realName: '',
      role: '',
      totalAmountPaid: 0,
      totalReimbursementAmounts: 0,
      uid: 0
    }
  });
  const [editingFields, setEditingFields] = useState({});
  //const [modalOpen, setModalOpen] = useState(false);
  const [tempInputValues, setTempInputValues] = useState({});

  useEffect(() => {
    getUserInfo();
    //console.log("1");
  }, []);

  const getUserInfo = () => {
    try {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/user/info`, {
        method: 'GET',
        credentials: 'include',
        redirect: 'follow'
      })
        .then(response => response.json())
        .then(data => {
          setUserInfo(data);
          console.log("data", data);
        })
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  };

  // const showEditModal = (field) => {
  //     setEditingField(field);
  //     setModalOpen(true);
  // };

  const handleEdit = (field) => {
    // 切换编辑模式
    setEditingFields(prevFields => ({
      ...prevFields,
      [field]: true,
    }));
    // 保存当前字段的值到临时输入值
    setTempInputValues(prevValues => ({
      ...prevValues,
      [field]: userInfo.data[field],
    }));
  };

  // const hideEditModal = () => {
  //     setEditingField('');
  //     setModalOpen(false);
  // };


  const handleSave = (field) => {
    // 获取当前临时输入值
    const inputValue = tempInputValues[field];

    // 更新userInfo
    setUserInfo(prevUserInfo => ({
      ...prevUserInfo,
      data: {
        ...prevUserInfo.data,
        [field]: inputValue,
      },
    }));
    // 更新临时输入值状态
    setTempInputValues(prevValues => ({
      ...prevValues,
      [field]: '',
    }));

    // 退出编辑模式
    setEditingFields(prevFields => ({
      ...prevFields,
      [field]: false,
    }));

    updateUserInfo(field, inputValue);
  };

  const updateUserInfo = (field, value) => {
    const updateData = {};
    updateData[field] = value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(updateData);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      credentials: 'include',
      redirect: 'follow'
    };

    fetch(`${process.env.REACT_APP_API_BASE_URL}/user/update`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        // 更新显示的信息
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          data: {
            ...prevUserInfo.data,
            [field]: value,
          },
        }));
        if (result.status ==="200")
        {
          toast.success("修改成功");
        }
      })
      .catch(error => console.log('error', error));
  };

  return (
    <div>
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

      <div className="user-info-container-mypage">
        <h2 className="user-info-title-mypage">用户信息</h2>
        <div className="info-row-mypage">
          <span>{`用户名: ${userInfo.data.account}`}</span>
        </div>
        <div className="info-row-mypage">
          <span>{`实名信息: ${userInfo.data.realName}`}</span>
        </div>
        <div>
          {editingFields.address ? (
            <div className="info-row-mypage">
              <input
                type="text"
                value={tempInputValues.address || ''}
                onChange={e => setTempInputValues({ ...tempInputValues, address: e.target.value })}
                className="edit-input"
              />
              <button onClick={() => handleSave('address')} className="save-button">确认</button>
            </div>
          ) : (
            <div className="info-row-mypage">
              <span>{`地址: ${userInfo.data.address}`}</span>
              <button onClick={() => handleEdit('address')}>更改</button>
            </div>
          )}
        </div>
        <div>
          {editingFields.email ? (
            <div className="info-row-mypage">
              <input
                type="text"
                value={tempInputValues.email || ''}
                onChange={e => setTempInputValues({ ...tempInputValues, email: e.target.value })}
                className="edit-input"
              />
              <button onClick={() => handleSave('email')} className="save-button">确认</button>
            </div>
          ) : (
            <div className="info-row-mypage">
              <span>{`邮箱: ${userInfo.data.email}`}</span>
              <button onClick={() => handleEdit('email')}>更改</button>
            </div>
          )}
        </div>
        <div>
          {editingFields.phone ? (
            <div className="info-row-mypage">
              <input
                type="text"
                value={tempInputValues.phone || ''}
                onChange={e => setTempInputValues({ ...tempInputValues, phone: e.target.value })}
                className="edit-input"
              />
              <button onClick={() => handleSave('phone')} className="save-button">确认</button>
            </div>
          ) : (
            <div className="info-row-mypage">
              <span>{`手机号码: ${userInfo.data.phone}`}</span>
              <button onClick={() => handleEdit('phone')}>更改</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPage;