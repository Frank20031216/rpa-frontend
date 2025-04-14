import React, { useState, useEffect } from "react";
import "./invoice_management.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InvoiceManagement() {
  // 发票数据状态
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 当前筛选状态
  const [activeTab, setActiveTab] = useState("all");

  // 搜索框状态
  const [searchReimbursementNumber, setSearchReimbursementNumber] = useState("");
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
    reimbursementNumber: "",
    buyer: "",
    seller: "",
    invoiceCode: "",
    invoiceNumber: "",
    invoiceDate: "",
    verificationCode: "",
    totalWithTaxInWords: "",
    totalWithoutTaxInNumbers: "",
    status: "wait",
  });

  // 从后端获取发票数据
  const fetchInvoices = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams(searchParams).toString();
      const url = queryParams
        ? `${process.env.REACT_APP_API_BASE_URL}/admin/pageInvoice?page=1&pageSize=10&${queryParams}`
        : `${process.env.REACT_APP_API_BASE_URL}/admin/pageInvoice?page=1&pageSize=10`;

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
        console.log(result);
        setInvoices(result.data.record);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      toast.error("获取发票数据失败，请稍后重试！");
    } finally {
      setLoading(false);
    }
  };

  // 过滤数据
  const filteredData = invoices.filter((item) => {
    if (activeTab !== "all" && item.status !== activeTab) return false;
    if (searchReimbursementNumber && !String(item.reimbursementNumber).includes(searchReimbursementNumber)) return false;
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
    .filter((item) => item.status === "approved")
    .reduce((sum, item) => sum + item.totalWithoutTaxInNumbers, 0);

  const totalUnapprovedAmount = filteredData
    .filter((item) => item.status === "rejected")
    .reduce((sum, item) => sum + parseFloat(item.totalWithoutTaxInNumbers), 0);

  const totalPendingAmount = filteredData
    .filter((item) => item.status === "wait")
    .reduce((sum, item) => sum + parseFloat(item.totalWithoutTaxInNumbers), 0);

  // 格式化金额，三位一逗号
  const formatAmount = (amount) => {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 初始化表单
  const initialize = () => {
    setFormValues({
      reimbursementNumber: "",
      buyer: "",
      seller: "",
      invoiceCode: "",
      invoiceNumber: "",
      invoiceDate: "",
      verificationCode: "",
      totalWithTaxInWords: "",
      totalWithoutTaxInNumbers: "",
      status: "wait",
    });
  };

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
        toast.error("日期格式不正确，请使用 yyyy-mm-dd 格式");
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
    if (!formValues.reimbursementNumber) {
      toast.error("报销编号不能为空");
      return false;
    }
    if (!formValues.buyer) {
      toast.error("购买方不能为空");
      return false;
    }
    if (!formValues.seller) {
      toast.error("销售方不能为空");
      return false;
    }
    if (!formValues.invoiceCode) {
      toast.error("发票代码不能为空");
      return false;
    }
    if (!formValues.invoiceNumber) {
      toast.error("发票号码不能为空");
      return false;
    }
    if (!formValues.invoiceDate) {
      toast.error("开票日期不能为空");
      return false;
    }
    if (!formValues.verificationCode) {
      toast.error("校验码不能为空");
      return false;
    }
    if (!formValues.totalWithTaxInWords) {
      toast.error("价税合计（大写）不能为空");
      return false;
    }
    if (!formValues.totalWithoutTaxInNumbers) {
      toast.error("价税合计（小写）不能为空");
      return false;
    }
    return true;
  };

  // 检查发票ID是否已存在
  const isInvoiceIdExists = (invoiceId) => {
    return invoices.some((invoice) => invoice.reimbursementNumber === invoiceId);
  };

  // 保存发票信息到后端
  const saveInvoiceToBackend = async (invoiceData, isUpdate) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(invoiceData);

      const requestOptions = {
        method: isUpdate ? "PUT" : "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
        credentials: "include",
      };

      const response = await fetch(
        isUpdate ? `${process.env.REACT_APP_API_BASE_URL}/accountant/update` : "/admin/addInvoice",
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result) {
        setEditCount(editCount+1);
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

  // 添加发票
  const handleAddInvoice = async () => {
    if (!validateForm()) return;

    if (isInvoiceIdExists(formValues.id)) {
      toast.error("发票ID已存在，无法添加新发票");
      return;
    }

    const newInvoice = {
      reimbursementNumber: formValues.reimbursementNumber,
      buyer: formValues.buyer,
      seller: formValues.seller,
      invoiceCode: formValues.invoiceCode,
      invoiceNumber: formValues.invoiceNumber,
      invoiceDate: formValues.invoiceDate,
      verificationCode: formValues.verificationCode,
      totalWithTaxInWords: formValues.totalWithTaxInWords,
      totalWithoutTaxInNumbers: parseFloat(formValues.totalWithoutTaxInNumbers),
      status: formValues.status,
    };

    const savedInvoice = await saveInvoiceToBackend(newInvoice, false);

    if (savedInvoice) {
      setInvoices([...invoices, savedInvoice]);
      setShowModal(false);
      initialize();
      toast.success("发票添加成功");
    }
  };

  // 编辑发票
  const handleEditInvoice = (invoiceId) => {
    const invoiceToEdit = invoices.find((invoice) => invoice.reimbursementNumber === invoiceId);
    setFormValues({
      reimbursementNumber: invoiceToEdit.reimbursementNumber,
      buyer: invoiceToEdit.buyer,
      seller: invoiceToEdit.seller,
      invoiceCode: invoiceToEdit.invoiceCode,
      invoiceNumber: invoiceToEdit.invoiceNumber,
      invoiceDate: invoiceToEdit.invoiceDate,
      verificationCode: invoiceToEdit.verificationCode,
      totalWithTaxInWords: invoiceToEdit.totalWithTaxInWords,
      totalWithoutTaxInNumbers: invoiceToEdit.totalWithoutTaxInNumbers.toString(),
      status: invoiceToEdit.status,
    });
    setEditInvoiceId(invoiceId);
    setShowModal(true);
  };

  // 更新发票
  const handleUpdateInvoice = async () => {
    if (!validateForm()) return;

    const updatedInvoiceData = {
      reimbursementNumber: formValues.reimbursementNumber,
      buyer: formValues.buyer,
      seller: formValues.seller,
      invoiceCode: formValues.invoiceCode,
      invoiceNumber: formValues.invoiceNumber,
      invoiceDate: formValues.invoiceDate,
      verificationCode: formValues.verificationCode,
      totalWithTaxInWords: formValues.totalWithTaxInWords,
      totalWithoutTaxInNumbers: parseFloat(formValues.totalWithoutTaxInNumbers),
      status: formValues.status,
    };

    if (isInvoiceIdExists(formValues.reimbursementNumber) && formValues.reimbursementNumber !== editInvoiceId) {
      toast.error("发票ID已存在，无法更新发票");
      return;
    }

    const updatedInvoice = await saveInvoiceToBackend(updatedInvoiceData, true);

    if (updatedInvoice) {
      // setInvoices(invoices.map((invoice) => (invoice.reimbursementNumber === editInvoiceId ? updatedInvoice : invoice)));
      setShowModal(false);
      initialize();
      setEditInvoiceId(null);
      toast.success("发票更新成功");
    }
  };

  // 删除发票
  const handleDeleteInvoice = (invoiceId) => {
    if (window.confirm("确定要删除此发票吗？")) {
      const updatedInvoices = invoices.filter((invoice) => invoice.reimbursementNumber !== invoiceId);
      setInvoices(updatedInvoices);
      toast.success("发票删除成功");
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
      setFormValues({
        ...formValues,
        invoiceDate: defaultDate,
      });
    } else if (editInvoiceId && originalInvoiceDate && !formValues.invoiceDate) {
      setFormValues({
        ...formValues,
        invoiceDate: originalInvoiceDate,
      });
    }
  }, [defaultDate, editInvoiceId, formValues, originalInvoiceDate]);

  const [editCount,setEditCount] = useState(0);
  // 初始加载发票数据
  useEffect(() => {
    fetchInvoices();
  }, [editCount]);

  return (
    <div className="reimbursement-record_invoice_management">
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
      <div className="dashboard-header_invoice_management">
        <h1>智能报销系统 - 发票管理界面</h1>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : error ? (
        <div className="error">错误: {error}</div>
      ) : (
        <>
          {/* 选项卡 */}
          <div className="tabs_invoice_management">
            <button
              className={activeTab === "all" ? "tab active_invoice_management" : "tab_invoice_management"}
              onClick={() => setActiveTab("all")}
            >
              全部 ({invoices.length})
            </button>
            <button
              className={activeTab === "wait" ? "tab active_invoice_management" : "tab_invoice_management"}
              onClick={() => setActiveTab("wait")}
            >
              审批中 ({invoices.filter((item) => item.status === "wait").length})
            </button>
            <button
              className={activeTab === "rejected" ? "tab active_invoice_management" : "tab_invoice_management"}
              onClick={() => setActiveTab("rejected")}
            >
              未通过 ({invoices.filter((item) => item.status === "rejected").length})
            </button>
            <button
              className={activeTab === "approved" ? "tab active_invoice_management" : "tab_invoice_management"}
              onClick={() => setActiveTab("approved")}
            >
              已通过 ({invoices.filter((item) => item.status === "approved").length})
            </button>
          </div>

          {/* 金额统计 */}
          <div className="amount-stats_invoice_management">
            {activeTab === "all" ? (
              <>
                <div className="stat-item_invoice_management">
                  <span className="amount-title_invoice_management">已通过金额合计:</span>
                  <span className="amount-value_invoice_management">{formatAmount(totalApprovedAmount)} 元</span>
                </div>
                <div className="stat-item_invoice_management">
                  <span className="amount-title_invoice_management">未通过金额合计:</span>
                  <span className="amount-value_invoice_management">{formatAmount(totalUnapprovedAmount)} 元</span>
                </div>
                <div className="stat-item_invoice_management">
                  <span className="amount-title_invoice_management">审批中金额合计:</span>
                  <span className="amount-value_invoice_management">{formatAmount(totalPendingAmount)} 元</span>
                </div>
              </>
            ) : activeTab === "approved" ? (
              <div className="stat-item_invoice_management">
                <span className="amount-title_invoice_management">已通过金额合计:</span>
                <span className="amount-value_invoice_management">{formatAmount(totalApprovedAmount)} 元</span>
              </div>
            ) : activeTab === "rejected" ? (
              <div className="stat-item_invoice_management">
                <span className="amount-title_invoice_management">未通过金额合计:</span>
                <span className="amount-value_invoice_management">{formatAmount(totalUnapprovedAmount)} 元</span>
              </div>
            ) : (
              <div className="stat-item_invoice_management">
                <span className="amount-title_invoice_management">审批中金额合计:</span>
                <span className="amount-value_invoice_management">{formatAmount(totalPendingAmount)} 元</span>
              </div>
            )}
          </div>

          {/* 搜索功能 */}
          <div className="search-bar_invoice_management">
            <input
              type="text"
              placeholder="搜索报销编号"
              value={searchReimbursementNumber}
              onChange={(e) => setSearchReimbursementNumber(e.target.value)}
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
          <div className="invoice-management_invoice_management">
            <div className="invoice-actions_invoice_management">
              <button onClick={() => setShowModal(true)}>新增发票</button>
            </div>
            <table className="table_invoice_management">
              <thead>
                <tr>
                  <th className="th_invoice_management">报销编号</th>
                  <th className="th_invoice_management">购买方</th>
                  <th className="th_invoice_management">销售方</th>
                  <th className="th_invoice_management">发票代码</th>
                  <th className="th_invoice_management">发票号码</th>
                  <th className="th_invoice_management">开票日期</th>
                  <th className="th_invoice_management">校验码</th>
                  <th className="th_invoice_management">价税合计(大写)</th>
                  <th className="th_invoice_management">价税合计(小写)</th>
                  <th className="th_invoice_management">状态</th>
                  <th className="th_invoice_management">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.reimbursementNumber}>
                    <td className="td_invoice_management">{item.reimbursementNumber}</td>
                    <td className="td_invoice_management">{item.buyer}</td>
                    <td className="td_invoice_management">{item.seller}</td>
                    <td className="td_invoice_management">{item.invoiceCode}</td>
                    <td className="td_invoice_management">{item.invoiceNumber}</td>
                    <td className="td_invoice_management">{item.invoiceDate}</td>
                    <td className="td_invoice_management">{item.verificationCode}</td>
                    <td className="td_invoice_management">{item.totalWithTaxInWords}</td>
                    <td className="td_invoice_management">{item.totalWithoutTaxInNumbers}</td>
                    <td className="td_invoice_management">
                      {item.status === "wait" && <span className="status-wait_invoice_management">审批中</span>}
                      {item.status === "approved" && <span className="status-pass_invoice_management">已通过</span>}
                      {item.status === "rejected" && <span className="status-unpass_invoice_management">未通过</span>}
                    </td>
                    <td className="td_invoice_management">
                      <button className="button_invoice_management" onClick={() => handleEditInvoice(item.reimbursementNumber)}>编辑</button>
                      <button className="button_invoice_management" onClick={() => handleDeleteInvoice(item.reimbursementNumber)}>删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 模态框 */}
          {showModal && (
            <div className="modal_invoice_management">
              <div className="modal-content_invoice_management">
                <h2>{editInvoiceId ? "编辑发票" : "新增发票"}</h2>
                <div className="form-group_invoice_management">
                  <label>报销编号:</label>
                  <input
                    type="text"
                    name="reimbursementNumber"
                    value={formValues.reimbursementNumber}
                    onChange={handleFormChange}
                    disabled={!!editInvoiceId}
                  />
                </div>
                <div className="form-group_invoice_management">
                  <label>购买方:</label>
                  <input
                    type="text"
                    name="buyer"
                    value={formValues.buyer}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group_invoice_management">
                  <label>销售方:</label>
                  <input
                    type="text"
                    name="seller"
                    value={formValues.seller}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group_invoice_management">
                  <label>发票代码:</label>
                  <input
                    type="text"
                    name="invoiceCode"
                    value={formValues.invoiceCode}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group_invoice_management">
                  <label>发票号码:</label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={formValues.invoiceNumber}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group_invoice_management">
                  <label>开票日期:</label>
                  <input
                    type="date"
                    name="invoiceDate"
                    value={formValues.invoiceDate}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group_invoice_management">
                  <label>校验码:</label>
                  <input
                    type="text"
                    name="verificationCode"
                    value={formValues.verificationCode}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group_invoice_management">
                  <label>价税合计(大写):</label>
                  <input
                    type="text"
                    name="totalWithTaxInWords"
                    value={formValues.totalWithTaxInWords}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group_invoice_management">
                  <label>价税合计(小写):</label>
                  <input
                    type="number"
                    name="totalWithoutTaxInNumbers"
                    value={formValues.totalWithoutTaxInNumbers}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group_invoice_management">
                  <label>状态:</label>
                  <select
                    name="status"
                    value={formValues.status}
                    onChange={handleFormChange}
                  >
                    <option value="wait">审批中</option>
                    <option value="approved">已通过</option>
                    <option value="rejected">未通过</option>
                  </select>
                </div>
                <div className="modal-actions_invoice_management">
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
        </>
      )}
    </div>
  );
}

export default InvoiceManagement;