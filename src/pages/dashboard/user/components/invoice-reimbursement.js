import React, { useState } from 'react';
import './invoice-reimbursement.css';
import { toast, ToastContainer } from "react-toastify";

function InvoiceReimbursement() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageStyle, setImageStyle] = useState({ width: "300px", height: "150px" });
  const [ocrData, setOcrData] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [formData, setFormData] = useState({
    reason: '差旅费',
    amount: '',
    comments: '',
  });
  const [uploadImage, setUploadImage] = useState(null);

  const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  };

  //OCR识别函数
  const handleOCR = async (file) => {
    try {

      setUploadImage(file);
      
      const ocrFormData = new FormData();
      ocrFormData.append("file", file, file.name);
      console.log('获取的Token:', getCookie('Authorization'));
      const ocrResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/ocr`, {
        method: "POST",
        // headers: {  // 修正：headers应该是一个对象
        //   'Authorization': `Bearer ${getCookie('Authorization')}`,
        //   // 注意：不要手动设置Content-Type，FormData会自动设置
        // },
        credentials: 'include',  // 如果需要携带cookie，取消注释这行
        body: ocrFormData,
      });
      const ocrResult = await ocrResponse.json();
      if (ocrResult.status === "200") {
        //console.log('OCR识别成功:', ocrResult.data);
        setOcrData(ocrResult.data);
        setShowVerification(true);
        setFormData(prev => ({ ...prev, amount: ocrResult.data.totalWithoutTaxInNumbers }));
      }
    } catch (error) {
      console.log('OCR识别失败:', error);
      toast.error('OCR识别失败，请稍后再试');
    }
  };

  //图片上传处理
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 显示预览
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
        // 调整预览尺寸
        const img = new Image();
        img.onload = () => {
          const maxWidth = 500, maxHeight = 250;
          let { width, height } = img;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (maxHeight / height) * width;
            height = maxHeight;
          }

          setImageStyle({ width: `${width}px`, height: `${height}px` });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);

      // 进行OCR识别
      handleOCR(file);
    }
  };

  //提交处理
  const handleSubmit = async () => {
    try {
      //上传图片
      console.log('上传图片:', uploadImage);
      const uploadFormData = new FormData();
      uploadFormData.append("file", uploadImage);
      const uploadResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/upload`, {
        method: "POST",
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
        body: uploadFormData,
        credentials: 'include',
      });

      const uploadResult = await uploadResponse.json();
      if (uploadResult.status !== "200") throw new Error("上传失败");

      //上传完整数据s
      const payload = {
        title: formData.reason,
        amount: formData.amount,
        invoiceCode: ocrData.invoiceCode,
        buyer: ocrData.buyer,
        seller: ocrData.seller,
        invoiceNumber: ocrData.invoiceNumber,
        invoiceDate: ocrData.invoiceDate,
        verificationCode: ocrData.verificationCode,
        totalWithTaxInWords: ocrData.totalWithTaxInWords,
        totalWithoutTaxInNumbers: ocrData.totalWithoutTaxInNumbers,
        image: uploadResult.data,
        remarks: formData.comments,
      };

      const saveResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/save`, {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (saveResponse.status === 200) {
        toast.success('提交成功');
        // 重置状态
        setImageSrc(null);
        setOcrData(null);
        setShowVerification(false);
      }
    } catch (error) {
      console.error('提交失败:', error);
      toast.error('提交过程中发生错误');
    }
  };


  return (
    <div className="invoice-reimbursement-container">
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
                  
      {/* 图片上传区域*/}
      <div className="upload-area" style={imageStyle}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="upload-input"
        />
        {imageSrc ? (
          <img src={imageSrc} alt="Uploaded" className="uploaded-image" />
        ) : (
          <div className="placeholder">
            <span className="plus-icon">+</span>
            <p>上传电子发票</p>
          </div>
        )}
      </div>

      {/* OCR数据验证 */}
      {showVerification && (
        <div className="verification-panel">
          <h3>发票信息验证</h3>
          <div className="ocr-data">
            <p>卖方：{ocrData.seller}</p>
            <p>买方：{ocrData.buyer}</p>
            <p>发票金额：{ocrData.totalWithoutTaxInNumbers}元</p>
            <p>发票日期：{ocrData.invoiceDate}</p>
          </div>
          <div className="verification-buttons">
            <button onClick={() => setShowVerification(false)}>信息有误</button>
            <button onClick={() => setShowVerification(false)}>确认无误</button>
          </div>
        </div>
      )}

      {/* 表单区域 */}
      <div className="form-container">
        <label htmlFor="reason">报销理由</label>
        <select
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        >
          <option>差旅费</option>
          <option>设备费</option>
          <option>餐费</option>
        </select>

        <label htmlFor="amount">报销金额</label>
        <input
          type="number"
          id="amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="请输入金额"
        />

        <label htmlFor="comments">备注信息</label>
        <textarea
          id="comments"
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          placeholder="请输入备注信息"
        />
      </div>

      {/* 提交按钮 */}
      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={!showVerification}
      >
        提交
      </button>
    </div>
  );
}

export default InvoiceReimbursement;

