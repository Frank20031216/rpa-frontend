import React from 'react';
import { useState } from 'react';


function RpaUpload() {
  const [formValues, setFormValues] = useState({
    reimbursementNumber: '',
    buyer: '',
    seller: '',
    invoiceCode: '',
    invoiceNumber: '',
    invoiceDate: '',
    verificationCode: '',
    totalAmountCapital: '',
    totalAmountLowercase: ''
  });

  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTableData([...tableData, { ...formValues }]);
    setFormValues({
      reimbursementNumber: '',
      buyer: '',
      seller: '',
      invoiceCode: '',
      invoiceNumber: '',
      invoiceDate: '',
      verificationCode: '',
      totalAmountCapital: '',
      totalAmountLowercase: ''
    });
  };

  return (
    <div className="invoice-form-container">
      <div className="invoice-count">
        本次已提交发票数: {tableData.length}
      </div>

      <form onSubmit={handleSubmit} className="invoice-form">
        <div className="form-row">
          <div className="form-group">
            <label>报销编号:</label>
            <input
              type="text"
              name="reimbursementNumber"
              value={formValues.reimbursementNumber}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>购买方:</label>
            <input
              type="text"
              name="buyer"
              value={formValues.buyer}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>销售方:</label>
            <input
              type="text"
              name="seller"
              value={formValues.seller}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>发票代码:</label>
            <input
              type="text"
              name="invoiceCode"
              value={formValues.invoiceCode}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>发票号码:</label>
            <input
              type="text"
              name="invoiceNumber"
              value={formValues.invoiceNumber}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>开票日期:</label>
            <input
              type="text"
              name="invoiceDate"
              value={formValues.invoiceDate}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>校验码:</label>
            <input
              type="text"
              name="verificationCode"
              value={formValues.verificationCode}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>价税合计(大写):</label>
            <input
              type="text"
              name="totalAmountCapital"
              value={formValues.totalAmountCapital}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>价税合计(小写):</label>
            <input
              type="text"
              name="totalAmountLowercase"
              value={formValues.totalAmountLowercase}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <button type="submit" className="submit-button">提交</button>
      </form>

      <div className="table-container">
        <table className="data-table">
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
      </div>
    </div>
  );
};

export default RpaUpload;

