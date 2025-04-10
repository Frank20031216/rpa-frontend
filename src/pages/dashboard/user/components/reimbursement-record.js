// import React from "react";
// import "./reimbursement-record.css";
// import { useState } from "react";

// function ReimbursementRecord() {
//   // 模拟数据
//   const [data, setData] = useState([
//     { id: "CLBX2020090001", title: "住宿费", amount: 5000, date: "2020-09-10", state: "wait" },
//     { id: "CLBX2020090002", title: "材料费", amount: 12331, date: "2020-09-10", state: "pass" },
//     { id: "CLBX2020090003", title: "交通费", amount: 1325, date: "2020-09-11", state: "unpass" },
//     { id: "CLBX2020090004", title: "餐费", amount: 1124, date: "2020-09-12", state: "pass" },
//   ]);

//   // 当前筛选状态
//   const [activeTab, setActiveTab] = useState("all");

//   // 搜索框过滤条件
//   const [searchId, setSearchId] = useState("");
//   const [searchDate, setSearchDate] = useState("");
//   const [searchAmount, setSearchAmount] = useState("");

//   // 计算已经通过的总金额
//   const totalApprovedAmount = data
//   .filter((item) => item.state === "pass")
//   .reduce((sum, item) => sum + item.amount, 0);

//   // 格式化金额，三位一逗号
//   const formatAmount = (amount) =>{
//     return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };
//   // 过滤数据
//   const filteredData = data.filter((item) => {
//     if (activeTab !== "all" && item.state !== activeTab) return false;
//     if (searchId && !item.id.includes(searchId)) return false;
//     if (searchDate && !item.date.includes(searchDate)) return false;
//     if (searchAmount && item.amount.toString() !== searchAmount) return false;
//     return true;
//   });

//   return (
//     <div className="reimbursement-record">
//       {/* 顶部导航 */}
//       <div className="tabs">
//         <button
//           className={activeTab === "all" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("all")}
//         >
//           全部 ({data.length})
//         </button>
//         <button
//           className={activeTab === "wait" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("wait")}
//         >
//           审批中 ({data.filter((item) => item.state === "wait").length})
//         </button>
//         <button
//           className={activeTab === "unpass" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("unpass")}
//         >
//           未通过 ({data.filter((item) => item.state === "unpass").length})
//         </button>
//         <button
//           className={activeTab === "pass" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("pass")}
//         >
//           已通过 ({data.filter((item) => item.state === "pass").length})
//         </button>
//          {/* 金额统计 */}
//         <div className="approved-amount">
//         <span className="amount-title">报销金额合计:</span>
//         <span className="amount-value">{formatAmount(totalApprovedAmount)} 元</span>
//         </div>
//       </div>

//       {/* 搜索栏 */}
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="搜索报销编号"
//           value={searchId}
//           onChange={(e) => setSearchId(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="搜索申请日期 (如2020-09-11)"
//           value={searchDate}
//           onChange={(e) => setSearchDate(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="搜索报销金额"
//           value={searchAmount}
//           onChange={(e) => setSearchAmount(e.target.value)}
//         />
//       </div>

//       {/* 表格内容 */}
//       <table>
//         <thead>
//           <tr>
//             <th>报销编号</th>
//             <th>报销标题</th>
//             <th>报销金额</th>
//             <th>申请日期</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((item) => (
//             <tr key={item.id}>
//               <td>{item.id}</td>
//               <td>{item.title}</td>
//               <td>{item.amount}</td>
//               <td>{item.date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default ReimbursementRecord;


import React, { useState, useEffect } from "react";
import "./reimbursement-record.css";
import { useNavigate } from "react-router-dom";

function ReimbursementRecord() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    reimbursementNumber: "",
    date: "",
    amount: "",
  });
  const itemsPerPage = 10;

  const pendingCount = data.filter((item) => item.state === "wait").length;
  const reviewedCount = data.filter((item) => item.state === "pass" || item.state === "unpass").length;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://122.228.26.226:58359/user/page?page=${currentPage}&pageSize=${itemsPerPage}`,
          {
            method: "GET",
            redirect: "follow",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        if (result.status === "200") {
          setData(result.data.records);
          setFilteredData(result.data.records);
          setTotalPages(Math.ceil(result.data.total / itemsPerPage));
          setLoading(false);
        } else {
          console.error("API Error:", result.message);
          setLoading(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const results = data.filter((item) => {
      const matchesId = searchParams.reimbursementNumber === "" ||
        item.id.includes(searchParams.reimbursementNumber);
      const matchesDate = searchParams.date === "" ||
        item.date.includes(searchParams.date);
      const matchesAmount = searchParams.amount === "" ||
        item.amount.toString().includes(searchParams.amount);
      return matchesId && matchesDate && matchesAmount;
    });
    setFilteredData(results);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchParams, data]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatAmount = (amount) => {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const totalApprovedAmount = filteredData
    .filter((item) => item.state === "pass")
    .reduce((sum, item) => sum + item.amount, 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="reimbursement-record">
      {/* 顶部导航 */}
      <div className="tabs">
        <button className="tab active">全部 ({data.length})</button>
        <button className="tab">审批中 ({pendingCount})</button>
        <button className="tab">未通过 ({reviewedCount})</button>
        <button className="tab">已通过 ({reviewedCount})</button>
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
          name="reimbursementNumber"
          placeholder="搜索报销编号"
          value={searchParams.reimbursementNumber}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="date"
          placeholder="搜索申请日期 (如2020-09-11)"
          value={searchParams.date}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="amount"
          placeholder="搜索报销金额"
          value={searchParams.amount}
          onChange={handleSearchChange}
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
          {loading ? (
            <tr>
              <td colSpan="4" className="no-data">
                加载中...
              </td>
            </tr>
          ) : currentItems.length > 0 ? (
            currentItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.amount}</td>
                <td>{item.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">
                没有找到匹配的报销记录
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 分页导航 */}
      {filteredData.length > itemsPerPage && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            上一页
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={currentPage === pageNum ? "active" : ""}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}

export default ReimbursementRecord;