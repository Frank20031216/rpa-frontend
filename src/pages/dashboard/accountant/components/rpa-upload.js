import React, { useState } from 'react';
import './rpa-upload.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RpaUpload() {
  const [formValues, setFormValues] = useState({
    reimbursementNumber: '',
    buyer: '',
    seller: '',
    invoiceCode: '',
    invoiceNumber: '',
    invoiceDate: '',
    verificationCode: '',
    totalWithTaxInWords: '',
    totalWithoutTaxInNumbers: ''
  });

  const [tableData, setTableData] = useState([]);

  // 保存发票信息到后端
  const saveInvoiceToBackend = async (invoiceData) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(invoiceData);

      console.log(raw);


      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
        credentials : 'include'
      };

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/accountant/rpa`, requestOptions);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result);
      if (result) {
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("保存失败，请稍后重试！");
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 验证表单
    if (!formValues.reimbursementNumber.trim()) {
      toast.error("报销编号不能为空");
      return;
    }
    if (!formValues.buyer.trim()) {
      toast.error("购买方不能为空");
      return;
    }
    if (!formValues.seller.trim()) {
      toast.error("销售方不能为空");
      return;
    }
    if (!formValues.invoiceCode.trim()) {
      toast.error("发票代码不能为空");
      return;
    }
    if (!formValues.invoiceNumber.trim()) {
      toast.error("发票号码不能为空");
      return;
    }
    if (!formValues.invoiceDate.trim()) {
      toast.error("开票日期不能为空");
      return;
    }
    if (!formValues.verificationCode.trim()) {
      toast.error("校验码不能为空");
      return;
    }
    if (!formValues.totalWithTaxInWords.trim()) {
      toast.error("价税合计（大写）不能为空");
      return;
    }
    if (!formValues.totalWithoutTaxInNumbers.trim()) {
      toast.error("价税合计（小写）不能为空");
      return;
    }

    const savedInvoice = await saveInvoiceToBackend(formValues);

    if (savedInvoice) {
      setTableData([...tableData, { ...formValues }]);
      setFormValues({
        reimbursementNumber: '',
        buyer: '',
        seller: '',
        invoiceCode: '',
        invoiceNumber: '',
        invoiceDate: '',
        verificationCode: '',
        totalWithTaxInWords: '',
        totalWithoutTaxInNumbers: ''
      });
      toast.success("发票添加成功");
    }
  };


  // 下载RPA教程
  const downloadRPAGuide = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
        credentials: 'include'
      };

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/accountant/downloadfile`, requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.blob(); // 将响应体转换为Blob对象
        })
        .then(blob => {
          // 创建一个下载链接
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'RPA教程.zip'; // 设置下载文件的名称
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url); // 释放URL对象
          toast.success("RPA教程下载成功，请查看控制台");
        })
        .catch(error => {
          console.error('Error during export:', error);
          alert('下载失败，请稍后再试');
        });

    } catch (error) {
      console.error('error', error);
      toast.error("RPA教程下载失败，请稍后重试");
    }
  };

  return (
    <div className="invoice-form-container_rpaUpload">
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

    <div className="invoice-butten-count_rpaUpload">

      <div className="invoice-count_rpaUpload">
          本次已提交发票数: {tableData.length}
      </div>

{/* 在右上角新增RPA教程按钮 */}

<button onClick={downloadRPAGuide} >RPA教程</button>
</div>

      <div className="invoice-form_rpaUpload">
        <div className="form-row_rpaUpload">
          <div className="form-group_rpaUpload">
            <label>报销编号:</label>
            <input
              type="text"
              name="reimbursementNumber"
              value={formValues.reimbursementNumber}
              onChange={handleChange}
              className="form-control_rpaUpload"
            />
          </div>
        </div>

        <div className="form-row_rpaUpload">
          <div className="form-group_rpaUpload">
            <label>购买方:</label>
            <input
              type="text"
              name="buyer"
              value={formValues.buyer}
              onChange={handleChange}
              className="form-control_rpaUpload"
            />
          </div>
        </div>

        <div className="form-row_rpaUpload">
          <div className="form-group_rpaUpload">
            <label>销售方:</label>
            <input
              type="text"
              name="seller"
              value={formValues.seller}
              onChange={handleChange}
              className="form-control_rpaUpload"
            />
          </div>
        </div>

        <div className="form-row_rpaUpload">
          <div className="form-group_rpaUpload">
            <label>发票代码:</label>
            <input
              type="text"
              name="invoiceCode"
              value={formValues.invoiceCode}
              onChange={handleChange}
              className="form-control_rpaUpload"
            />
          </div>
        </div>

        <div className="form-row_rpaUpload">
          <div className="form-group_rpaUpload">
            <label>发票号码:</label>
            <input
              type="text"
              name="invoiceNumber"
              value={formValues.invoiceNumber}
              onChange={handleChange}
              className="form-control_rpaUpload"
            />
          </div>
        </div>

        <div className="form-row_rpaUpload">
          <div className="form-group_rpaUpload">
            <label>开票日期:</label>
            <input
              type="text"
              name="invoiceDate"
              value={formValues.invoiceDate}
              onChange={handleChange}
              className="form-control_rpaUpload"
            />
          </div>
        </div>

        <div className="form-row_rpaUpload">
          <div className="form-group_rpaUpload">
            <label>校验码:</label>
            <input
              type="text"
              name="verificationCode"
              value={formValues.verificationCode}
              onChange={handleChange}
              className="form-control_rpaUpload"
            />
          </div>
        </div>

        <div className="form-row_rpaUpload">
          <div className="form-group_rpaUpload">
            <label>价税合计(大写):</label>
            <input
              type="text"
              name="totalWithTaxInWords"
              value={formValues.totalWithTaxInWords}
              onChange={handleChange}
              className="form-control_rpaUpload"
            />
          </div>
        </div>

        <div className="form-row_rpaUpload">
          <div className="form-group_rpaUpload">
            <label>价税合计(小写):</label>
            <input
              type="text"
              name="totalWithoutTaxInNumbers"
              value={formValues.totalWithoutTaxInNumbers}
              onChange={handleChange}
              className="form-control_rpaUpload"
            />
          </div>
        </div>

        <button type="submit" className="submit-button_rpaUpload" onClick={handleSubmit}>
          提交
        </button>
      </div>

      {/* <div className="table-container_rpaUpload">
        <table className="data-table_rpaUpload">
          <thead>
            <tr>
              <th>报销编号</th>
              <th>购买方</th>
              <th>销售方</th>
              <th>发票代码</th>
              <th>发票号码</th>
              <th>开票日期</th>
              <th>校验码</th>
              <th>价税合计(大写)</th>
              <th>价税合计(小写)</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.reimbursementNumber}</td>
                <td>{row.buyer}</td>
                <td>{row.seller}</td>
                <td>{row.invoiceCode}</td>
                <td>{row.invoiceNumber}</td>
                <td>{row.invoiceDate}</td>
                <td>{row.verificationCode}</td>
                <td>{row.totalAmountCapital}</td>
                <td>{row.totalAmountLowercase}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}

export default RpaUpload;