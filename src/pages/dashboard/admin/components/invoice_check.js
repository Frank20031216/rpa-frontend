import React, { useState, useEffect }  from "react";
import "./invoice_check.css";

function InvoiceCheck() {
  // 模拟数据
  const [data, setData] = useState([
    {
      id: "CLBX2020090001",
      buyer: "购买方A",
      seller: "销售方A",
      invoiceCode: "123456789012",
      invoiceNumber: "00000001",
      invoiceDate: "2020-09-10",
      verificationCode: "12345678901234567890",
      totalWithTaxInWords: "伍仟元整",
      totalWithoutTaxInNumbers: 5000,
      state: "wait",
    },
    {
      id: "CLBX2020090002",
      buyer: "购买方B",
      seller: "销售方B",
      invoiceCode: "123456789013",
      invoiceNumber: "00000002",
      invoiceDate: "2020-09-11",
      verificationCode: "12345678901234567891",
      totalWithTaxInWords: "壹万贰仟叁佰叁拾壹元整",
      totalWithoutTaxInNumbers: 12331,
      state: "pass",
    },
    {
      id: "CLBX2020090003",
      buyer: "购买方C",
      seller: "销售方C",
      invoiceCode: "123456789014",
      invoiceNumber: "00000003",
      invoiceDate: "2020-09-12",
      verificationCode: "12345678901234567892",
      totalWithTaxInWords: "壹仟叁佰贰拾伍元整",
      totalWithoutTaxInNumbers: 1325,
      state: "unpass",
    },
    {
      id: "CLBX2020090004",
      buyer: "购买方D",
      seller: "销售方D",
      invoiceCode: "123456789015",
      invoiceNumber: "00000004",
      invoiceDate: "2020-09-13",
      verificationCode: "12345678901234567893",
      totalWithTaxInWords: "壹仟壹佰贰拾肆元整",
      totalWithoutTaxInNumbers: 1124,
      state: "pass",
    },
  ]);

  // 当前筛选状态
  const [activeTab, setActiveTab] = useState("all");

  // 搜索功能
  const [searchId, setSearchId] = useState("");
  const [searchBuyer, setSearchBuyer] = useState("");
  const [searchSeller, setSearchSeller] = useState("");
  const [searchInvoiceCode, setSearchInvoiceCode] = useState("");
  const [searchInvoiceNumber, setSearchInvoiceNumber] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchAmount, setSearchAmount] = useState("");



  // 模态框状态
  const [showModal, setShowModal] = useState(false);
  const [editInvoiceId, setEditInvoiceId] = useState(null);
  const [formValues, setFormValues] = useState({
    id: "",
    buyer: "",
    seller: "",
    invoiceCode: "",
    invoiceNumber: "",
    invoiceDate: "",
    verificationCode: "",
    totalWithTaxInWords: "",
    totalWithoutTaxInNumbers: "",
    state: "wait",
  });

  // 过滤数据
  const filteredData = data.filter((item) => {
    if (activeTab !== "all" && item.state !== activeTab) return false;
    if (searchId && !item.id.includes(searchId)) return false;
    if (searchBuyer && !item.buyer.includes(searchBuyer)) return false;
    if (searchSeller && !item.seller.includes(searchSeller)) return false;
    if (searchInvoiceCode && !item.invoiceCode.includes(searchInvoiceCode)) return false;
    if (searchInvoiceNumber && !item.invoiceNumber.includes(searchInvoiceNumber)) return false;
    if (searchDate && !item.invoiceDate.includes(searchDate)) return false;
    if (
      searchAmount &&
      item.totalWithoutTaxInNumbers.toString() !== searchAmount
    )
      return false;
    return true;
  });

  // 计算已经通过的总金额
  const totalApprovedAmount = filteredData
    .filter((item) => item.state === "pass")
    .reduce((sum, item) => sum + item.totalWithoutTaxInNumbers, 0);

    const totalUnapprovedAmount = filteredData
    .filter((item) => item.state === "unpass")
    .reduce((sum, item) => sum + parseFloat(item.totalWithoutTaxInNumbers), 0);

  const totalPendingAmount = filteredData
    .filter((item) => item.state === "wait")
    .reduce((sum, item) => sum + parseFloat(item.totalWithoutTaxInNumbers), 0);

    
  // 格式化金额，三位一逗号
  const formatAmount = (amount) => {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };



  const initialize= () =>
    {
      setFormValues({
        id: "",
        buyer: "",
        seller: "",
        invoiceCode: "",
        invoiceNumber: "",
        invoiceDate: "",
        verificationCode: "",
        totalWithTaxInWords: "",
        totalWithoutTaxInNumbers: "",
        state: "wait",
      });  
    }
  

    // 处理取消按钮
    const handleCancel = () => {
      setShowModal(false);
      setEditInvoiceId(null);
      initialize();
    };
  


  // 表单处理
  const handleFormChange = (e) => {
    const { name, value } = e.target;

      // 验证日期格式
      if (name === "invoiceDate") {
        const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(value);
        if (!isValidDate) {
          // value="2020-09-10";
          alert("日期格式不正确，请使用 yyyy-mm-dd 格式");
          return;
        }
      }


    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // 验证表单
  const validateForm = () => {
    if (!formValues.id.trim()) {
      alert("报销编号不能为空");
      return false;
    }
    if (!formValues.buyer.trim()) {
      alert("购买方不能为空");
      return false;
    }
    if (!formValues.seller.trim()) {
      alert("销售方不能为空");
      return false;
    }
    if (!formValues.invoiceCode.trim()) {
      alert("发票代码不能为空");
      return false;
    }
    if (!formValues.invoiceNumber.trim()) {
      alert("发票号码不能为空");
      return false;
    }
    if (!formValues.invoiceDate.trim()) {
      alert("开票日期不能为空");
      return false;
    }
    if (!formValues.verificationCode.trim()) {
      alert("校验码不能为空");
      return false;
    }
    if (!formValues.totalWithTaxInWords.trim()) {
      alert("价税合计（大写）不能为空");
      return false;
    }
    if (!formValues.totalWithoutTaxInNumbers.trim()) {
      alert("价税合计（小写）不能为空");
      return false;
    }
    return true;
  };

  // 检查发票ID是否已存在
  const isInvoiceIdExists = (invoiceId) => {
    return data.some((invoice) => invoice.id === invoiceId);
  };

  // 添加发票
  const handleAddInvoice = () => {
    if (!validateForm()) return;

    if (isInvoiceIdExists(formValues.id)) {
      alert("发票ID已存在，无法添加新发票");
      return;
    }

    const newInvoice = {
      id: formValues.id,
      buyer: formValues.buyer,
      seller: formValues.seller,
      invoiceCode: formValues.invoiceCode,
      invoiceNumber: formValues.invoiceNumber,
      invoiceDate: formValues.invoiceDate,
      verificationCode: formValues.verificationCode,
      totalWithTaxInWords: formValues.totalWithTaxInWords,
      totalWithoutTaxInNumbers: parseFloat(formValues.totalWithoutTaxInNumbers),
      state: formValues.state,
    };
    setData([...data, newInvoice]);
    setShowModal(false);
    initialize();
  };

  // 编辑发票
  const handleEditInvoice = (invoiceId) => {
    const invoiceToEdit = data.find((invoice) => invoice.id === invoiceId);
    // 存储原始发票日期
  setOriginalInvoiceDate(invoiceToEdit.invoiceDate);
    setFormValues({
      id: invoiceToEdit.id,
      buyer: invoiceToEdit.buyer,
      seller: invoiceToEdit.seller,
      invoiceCode: invoiceToEdit.invoiceCode,
      invoiceNumber: invoiceToEdit.invoiceNumber,
      invoiceDate: invoiceToEdit.invoiceDate,
      verificationCode: invoiceToEdit.verificationCode,
      totalWithTaxInWords: invoiceToEdit.totalWithTaxInWords,
      totalWithoutTaxInNumbers: invoiceToEdit.totalWithoutTaxInNumbers.toString(),
      state: invoiceToEdit.state,
    });
    setEditInvoiceId(invoiceId);
    setShowModal(true);
  };

  // 更新发票
  const handleUpdateInvoice = () => {
    if (!validateForm()) return;

    const updatedData = data.map((invoice) =>
      invoice.id === editInvoiceId
        ? {
            ...invoice,
            ...formValues,

            totalWithoutTaxInNumbers: parseFloat(formValues.totalWithoutTaxInNumbers), // 确保是数字
          }
        : invoice
    );
    setData(updatedData);
    setShowModal(false);
    initialize();
    setEditInvoiceId(null);
  };

  // 删除发票
  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm("确定要删除此发票吗？")) {
      const updatedData = data.filter((invoice) => invoice.id !== invoiceId);
      setData(updatedData);
    }
  };


  // 设置默认日期为今天
  const [defaultDate, setDefaultDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // 存储编辑时的原始发票日期
const [originalInvoiceDate, setOriginalInvoiceDate] = useState(null);


// 确保默认日期在表单值中
useEffect(() => {
  if (!editInvoiceId && !formValues.invoiceDate) {
    // 新增发票时，默认日期为今天
    setFormValues({
      ...formValues,
      invoiceDate: defaultDate,
    });
  } else if (editInvoiceId && originalInvoiceDate && !formValues.invoiceDate) {
    // 编辑发票时，默认日期为原始发票日期
    setFormValues({
      ...formValues,
      invoiceDate: originalInvoiceDate,
    });
  }
}, [defaultDate, editInvoiceId, formValues, originalInvoiceDate]);


  return (
    <div className="reimbursement-record">
      {/* 顶部导航 */}
      <div className="dashboard-header">
        <h1>智能报销系统 - 发票管理界面</h1>
      </div>



      {/* 选项卡 */}
      <div className="tabs">
        <button
          className={activeTab === "all" ? "tab active" : "tab"}
          onClick={() => setActiveTab("all")}
        >
          全部 ({data.length})
        </button>
        <button
          className={activeTab === "wait" ? "tab active" : "tab"}
          onClick={() => setActiveTab("wait")}
        >
          审批中 ({data.filter((item) => item.state === "wait").length})
        </button>
        <button
          className={activeTab === "unpass" ? "tab active" : "tab"}
          onClick={() => setActiveTab("unpass")}
        >
          未通过 ({data.filter((item) => item.state === "unpass").length})
        </button>
        <button
          className={activeTab === "pass" ? "tab active" : "tab"}
          onClick={() => setActiveTab("pass")}
        >
          已通过 ({data.filter((item) => item.state === "pass").length})
        </button>
      </div>


{/* 金额统计 */}
<div className="amount-stats">
        {activeTab === "all" ? (
          <>
            <div className="stat-item">
              <span className="amount-title">已通过金额合计:</span>
              <span className="amount-value">{formatAmount(totalApprovedAmount)} 元</span>
            </div>
            <div className="stat-item">
              <span className="amount-title">未通过金额合计:</span>
              <span className="amount-value">{formatAmount(totalUnapprovedAmount)} 元</span>
            </div>
            <div className="stat-item">
              <span className="amount-title">审批中金额合计:</span>
              <span className="amount-value">{formatAmount(totalPendingAmount)} 元</span>
            </div>
          </>
        ) : activeTab === "pass" ? (
          <div className="stat-item">
            <span className="amount-title">已通过金额合计:</span>
            <span className="amount-value">{formatAmount(totalApprovedAmount)} 元</span>
          </div>
        ) : activeTab === "unpass" ? (
          <div className="stat-item">
            <span className="amount-title">未通过金额合计:</span>
            <span className="amount-value">{formatAmount(totalUnapprovedAmount)} 元</span>
          </div>
        ) : (
          <div className="stat-item">
            <span className="amount-title">审批中金额合计:</span>
            <span className="amount-value">{formatAmount(totalPendingAmount)} 元</span>
          </div>
        )}
      </div>


      {/* 搜索功能 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="搜索报销编号"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <input
          type="text"
          placeholder="搜索购买方"
          value={searchBuyer}
          onChange={(e) => setSearchBuyer(e.target.value)}
        />
        <input
          type="text"
          placeholder="搜索销售方"
          value={searchSeller}
          onChange={(e) => setSearchSeller(e.target.value)}
        />
        <input
          type="text"
          placeholder="搜索发票代码"
          value={searchInvoiceCode}
          onChange={(e) => setSearchInvoiceCode(e.target.value)}
        />
        <input
          type="text"
          placeholder="搜索发票号码"
          value={searchInvoiceNumber}
          onChange={(e) => setSearchInvoiceNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="搜索开票日期 "
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="搜索价税合计(小写)"
          value={searchAmount}
          onChange={(e) => setSearchAmount(e.target.value)}
        />
      </div>

      {/* 发票管理部分 */}
      <div className="invoice-management">
        <div className="invoice-actions">
          <button onClick={() => setShowModal(true)}>新增发票</button>
        </div>
        <table>
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
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.buyer}</td>
                <td>{item.seller}</td>
                <td>{item.invoiceCode}</td>
                <td>{item.invoiceNumber}</td>
                <td>{item.invoiceDate}</td>
                <td>{item.verificationCode}</td>
                <td>{item.totalWithTaxInWords}</td>
                <td>{item.totalWithoutTaxInNumbers}</td>
                <td>
                  {item.state === "wait" && <span className="status-wait">审批中</span>}
                  {item.state === "pass" && <span className="status-pass">已通过</span>}
                  {item.state === "unpass" && <span className="status-unpass">未通过</span>}
                </td>
                <td>
                  <button onClick={() => handleEditInvoice(item.id)}>编辑</button>
                  <button onClick={() => handleDeleteInvoice(item.id)}>删除</button>
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
            <h2>{editInvoiceId ? "编辑发票" : "新增发票"}</h2>
            <div className="form-group">
              <label>报销编号:</label>
              <input
                type="text"
                name="id"
                value={formValues.id}
                onChange={handleFormChange}
                disabled={!!editInvoiceId}
              />
            </div>
            <div className="form-group">
              <label>购买方:</label>
              <input
                type="text"
                name="buyer"
                value={formValues.buyer}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>销售方:</label>
              <input
                type="text"
                name="seller"
                value={formValues.seller}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>发票代码:</label>
              <input
                type="text"
                name="invoiceCode"
                value={formValues.invoiceCode}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>发票号码:</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formValues.invoiceNumber}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>开票日期:</label>
              <input
                type="date"
                name="invoiceDate"
                value={formValues.invoiceDate}
                onChange={handleFormChange}

                // readOnly // 禁用文本框输入
              />
            </div>
            <div className="form-group">
              <label>校验码:</label>
              <input
                type="text"
                name="verificationCode"
                value={formValues.verificationCode}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>价税合计(大写):</label>
              <input
                type="text"
                name="totalWithTaxInWords"
                value={formValues.totalWithTaxInWords}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>价税合计(小写):</label>
              <input
                type="number"
                name="totalWithoutTaxInNumbers"
                value={formValues.totalWithoutTaxInNumbers}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label>状态:</label>
              <select
                name="state"
                value={formValues.state}
                onChange={handleFormChange}
              >
                <option value="wait">审批中</option>
                <option value="pass">已通过</option>
                <option value="unpass">未通过</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={() => handleCancel()}>取消</button>
              {editInvoiceId ? (
                <button onClick={handleUpdateInvoice}>更新</button>
              ) : (
                <button onClick={handleAddInvoice}>添加</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceCheck;