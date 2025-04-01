import React from "react";
import "./reimbursement-record.css";
import { useState } from "react";

function InvoiceReimbursement() {
  // 模拟数据
  const [data, setData] = useState([
    { id: "CLBX2020090001", title: "住宿费", amount: 5000, date: "2020-09-10", state: "wait" },
    { id: "CLBX2020090002", title: "材料费", amount: 12331, date: "2020-09-10", state: "pass" },
    { id: "CLBX2020090003", title: "交通费", amount: 1325, date: "2020-09-11", state: "unpass" },
    { id: "CLBX2020090004", title: "餐费", amount: 1124, date: "2020-09-12", state: "pass" },
  ]);

  // 当前筛选状态
  const [activeTab, setActiveTab] = useState("all");

  // 搜索框过滤条件
  const [searchId, setSearchId] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchAmount, setSearchAmount] = useState("");

  // 计算已经通过的总金额
  const totalApprovedAmount = data
  .filter((item) => item.state === "pass")
  .reduce((sum, item) => sum + item.amount, 0);

  // 格式化金额，三位一逗号
  const formatAmount = (amount) =>{
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  // 过滤数据
  const filteredData = data.filter((item) => {
    if (activeTab !== "all" && item.state !== activeTab) return false;
    if (searchId && !item.id.includes(searchId)) return false;
    if (searchDate && !item.date.includes(searchDate)) return false;
    if (searchAmount && item.amount.toString() !== searchAmount) return false;
    return true;
  });

  return (
    <div className="reimbursement-record">
      {/* 顶部导航 */}
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
         {/* 金额统计 */}
        <div className="approved-amount">
        <span className="amount-title">报销金额合计:</span>
        <span className="amount-value">{formatAmount(totalApprovedAmount)} 元</span>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="搜索报销编号"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <input
          type="text"
          placeholder="搜索申请日期 (如2020-09-11)"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="搜索报销金额"
          value={searchAmount}
          onChange={(e) => setSearchAmount(e.target.value)}
        />
      </div>

      {/* 表格内容 */}
      <table>
        <thead>
          <tr>
            <th>报销编号</th>
            <th>报销标题</th>
            <th>报销金额</th>
            <th>申请日期</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.amount}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceReimbursement;
