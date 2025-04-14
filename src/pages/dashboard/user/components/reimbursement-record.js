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

// import React, { useState, useEffect } from "react";
// import './reimbursement-record.css';

// function ReimbursementRecord() {
//   // 生成扩展测试数据（20条）
//   const generateMockData = () =>
//     Array.from({ length: 20 }, (_, index) => ({
//       id: `CLBX20200900${(index + 1).toString().padStart(2, '0')}`,
//       title: `费用类型${index + 1}`,
//       amount: Math.floor(Math.random() * 10000) + 1000,
//       date: `2020-09-${(index % 30 + 1).toString().padStart(2, '0')}`,
//       state: ['wait', 'pass', 'unpass'][Math.floor(Math.random() * 3)]
//     }));

//   // 状态管理
//   const [data] = useState(generateMockData());
//   const [activeTab, setActiveTab] = useState("all");
//   const [searchId, setSearchId] = useState("");
//   const [searchDate, setSearchDate] = useState("");
//   const [searchAmount, setSearchAmount] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // 当过滤条件变化时重置到第一页
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeTab, searchId, searchDate, searchAmount]);

//   // 过滤数据
//   const filteredData = data.filter((item) => {
//     if (activeTab !== "all" && item.state !== activeTab) return false;
//     if (searchId && !item.id.includes(searchId)) return false;
//     if (searchDate && !item.date.includes(searchDate)) return false;
//     if (searchAmount && item.amount.toString() !== searchAmount) return false;
//     return true;
//   });

//   // 分页计算
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

//   // 金额格式化
//   const formatAmount = (amount) =>
//     amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//   // 计算通过总金额
//   const totalApprovedAmount = data
//     .filter((item) => item.state === "pass")
//     .reduce((sum, item) => sum + item.amount, 0);

//   return (
//     <div className="reimbursement-record">
//       {/* 状态标签 */}
//       <div className="tabs">
//         <button className={activeTab === "all" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("all")}>
//           全部 ({data.length})
//         </button>
//         <button className={activeTab === "wait" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("wait")}>
//           审批中 ({data.filter((item) => item.state === "wait").length})
//         </button>
//         <button className={activeTab === "unpass" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("unpass")}>
//           未通过 ({data.filter((item) => item.state === "unpass").length})
//         </button>
//         <button className={activeTab === "pass" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("pass")}>
//           已通过 ({data.filter((item) => item.state === "pass").length})
//         </button>

//         {/* 金额统计 */}
//         <div className="approved-amount">
//           <span className="amount-title">报销金额合计:</span>
//           <span className="amount-value">{formatAmount(totalApprovedAmount)} 元</span>
//         </div>
//       </div>

//       {/* 搜索栏 */}
//       <div className="search-bar">
//         <input type="text" placeholder="搜索报销编号"
//           value={searchId} onChange={(e) => setSearchId(e.target.value)} />
//         <input type="text" placeholder="搜索申请日期"
//           value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
//         <input type="text" placeholder="搜索报销金额"
//           value={searchAmount} onChange={(e) => setSearchAmount(e.target.value)} />
//       </div>

//       {/* 数据表格 */}
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
//           {currentItems.map((item) => (
//             <tr key={item.id}>
//               <td>{item.id}</td>
//               <td>{item.title}</td>
//               <td>{formatAmount(item.amount)}</td>
//               <td>{item.date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* 分页控件 */}
//       {filteredData.length > 0 && (
//         <div className="pagination">
//           <button
//             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//           >
//             上一页
//           </button>

//           {/* 智能页码显示（保持显示5个页码） */}
//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             let pageNum;
//             if (totalPages <= 5) {
//               pageNum = i + 1; // 显示全部页码
//             } else if (currentPage <= 3) {
//               pageNum = i + 1; // 前3页显示1-5
//             } else if (currentPage >= totalPages - 2) {
//               pageNum = totalPages - 4 + i; // 最后3页显示最后5个
//             } else {
//               pageNum = currentPage - 2 + i; // 中间页保持当前页在中间
//             }

//             return (
//               <button
//                 key={pageNum}
//                 onClick={() => setCurrentPage(pageNum)}
//                 className={currentPage === pageNum ? 'active' : ''}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}

//           <button
//             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//             disabled={currentPage === totalPages}
//           >
//             下一页
//           </button>


//           <span className="page-info">
//             第 {currentPage} 页 / 共 {totalPages} 页
//           </span>
//         </div>
//       )}

//       {/* 空状态提示 */}
//       {filteredData.length === 0 && (
//         <div className="empty-state">
//           没有找到匹配的报销记录
//         </div>
//       )}
//     </div>
//   );
// }

// export default ReimbursementRecord;

// import React, { useState, useEffect } from "react";
// import './reimbursement-record.css';
// import { configure } from "@testing-library/dom";

// function ReimbursementRecord() {
//   // 状态管理
//   const [data, setData] = useState([]);
//   const [activeTab, setActiveTab] = useState("all");
//   const [searchId, setSearchId] = useState("");
//   const [searchDate, setSearchDate] = useState("");
//   const [searchAmount, setSearchAmount] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const itemsPerPage = 3;

//   // API 请求配置
//   const fetchData = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_BASE_URL}/user/page?page=${currentPage}&pageSize=${itemsPerPage}`,
//         {
//           method: 'GET',
//           redirect: 'follow',
//           credentials: 'include',
//         }
//       );

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const result = await response.json();
//       // 根据实际 API 返回数据结构调整
//       if (result.status === "200") {
//         setData(result.data.record);
//         setTotalAmount(result.data.total);
//         setTotalPages(Math.ceil(result.data.total / itemsPerPage));
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//     } finally {
//       setLoading(false);
//     }

//   };

//   useEffect(() => {
//     //console.log(currentPage);
//     fetchData();
//     //console.log(data);
//   }, [currentPage]); // 当页码变化时重新获取数据

//   // 当过滤条件变化时重置到第一页
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeTab, searchId, searchDate, searchAmount]);

//   // 客户端过滤逻辑（如果 API 不支持服务端过滤）
//   const filteredData = data.filter((item) => {
//     //console.log(data);
//     // if (activeTab !== "all" && item.status !== activeTab) return false;
//     // if (searchId && !item.reimbursementNumber.includes(searchId)) return false;
//     // if (searchDate && !item.date.includes(searchDate)) return false;
//     // if (searchAmount && item.amount.toString() !== searchAmount) return false;
//     if (activeTab !== "all" && item.status !== activeTab) return false;
//     if (searchId && item.reimbursementNumber && !new RegExp(searchId).test(item.reimbursementNumber)) return false;
//     if (searchDate && item.date && !new RegExp(searchDate).test(item.date)) return false;
//     if (searchAmount && item.amount.toString() !== searchAmount) return false;
//     return true;
//   });

//   useEffect(() => {
//     console.log("Data after fetching:", data);
//     console.log("Filtered data:", filteredData);
//     console.log("Current page items:", currentItems);
//   }, [data]);

//   // 分页计算（基于过滤后的数据）
//   const totalFilteredItems = filteredData.length;
//   const indexOfLastItem = Math.min((currentPage - 1) * itemsPerPage + itemsPerPage, totalFilteredItems);
//   const indexOfFirstItem = Math.max(indexOfLastItem - itemsPerPage, 0);
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);



//   // 金额格式化
//   const formatAmount = (amount) =>
//     amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//   //计算通过总金额
//   const totalApprovedAmount = data
//     .filter((item) => item.status === "approved")
//     .reduce((sum, item) => sum + item.amount, 0);

//   return (
//     <div className="reimbursement-record">
//       {/* 状态标签 */}
//       <div className="tabs">
//         <button className={activeTab === "all" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("all")}>
//           全部 ({totalAmount})
//         </button>
//         <button className={activeTab === "wait" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("wait")}>
//           审批中 ({data.filter((item) => item.status === "wait").length})
//         </button>
//         <button className={activeTab === "unpass" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("unpass")}>
//           未通过 ({data.filter((item) => item.status === "rejected").length})
//         </button>
//         <button className={activeTab === "pass" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("pass")}>
//           已通过 ({data.filter((item) => item.status === "approved").length})
//         </button>

//         {/* 金额统计 */}
//         <div className="approved-amount">
//           <span className="amount-title">报销金额合计:</span>
//           <span className="amount-value">{formatAmount(totalApprovedAmount)} 元</span>
//         </div>
//       </div>

//       {/* 搜索栏 */}
//       <div className="search-bar">
//         <input type="text" placeholder="搜索报销编号"
//           value={searchId} onChange={(e) => setSearchId(e.target.value)} />
//         <input type="text" placeholder="搜索申请日期"
//           value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
//         <input type="text" placeholder="搜索报销金额"
//           value={searchAmount} onChange={(e) => setSearchAmount(e.target.value)} />
//       </div>

//       {/* 数据表格 */}
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
//           {loading ? (
//             <tr>
//               <td colSpan="4">加载中...</td>
//             </tr>
//           ) : currentItems.length > 0 ? (
//             currentItems.map((item) => (
//               <tr key={item.reimbursementNumber}>
//                 <td>{item.reimbursementNumber}</td>
//                 <td>{item.title}</td>
//                 <td>{formatAmount(item.amount)}</td>
//                 <td>{item.date}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="4">没有找到匹配的报销记录</td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* 分页控件 */}
//       {filteredData.length > 0 && (
//         <div className="pagination">
//           <button
//             onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//             disabled={currentPage === 1}
//           >
//             上一页
//           </button>

//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             let pageNum;
//             if (totalPages <= 5) {
//               pageNum = i + 1;
//             } else if (currentPage <= 3) {
//               pageNum = i + 1;
//             } else if (currentPage >= totalPages - 2) {
//               pageNum = totalPages - 4 + i;
//             } else {
//               pageNum = currentPage - 2 + i;
//             }

//             return (
//               <button
//                 key={pageNum}
//                 onClick={() => setCurrentPage(pageNum)}
//                 className={currentPage === pageNum ? 'active' : ''}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}

//           <button
//             onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//             disabled={currentPage === totalPages}
//           >
//             下一页
//           </button>

//           <span className="page-info">
//             第 {currentPage} 页 / 共 {totalPages} 页
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ReimbursementRecord;
import React, { useState, useEffect } from "react";
import './reimbursement-record.css';

function ReimbursementRecord() {
  // 状态管理
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchId, setSearchId] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({ all: 0, wait: 0, unpass: 0, pass: 0 });
  const [totalApprovedAmount, setTotalApprovedAmount] = useState(0);
  const itemsPerPage = 3;

  // 映射状态标签到 API 的 status 参数
  const getStatusParam = (tab) => {
    switch (tab) {
      case "wait": return "wait";
      case "pass": return "approved";
      case "unpass": return "rejected";
      default: return "";
    }
  };

  // 获取分页数据
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        pageSize: itemsPerPage,
      });

      const status = getStatusParam(activeTab);
      if (status) params.append("status", status);

      // 添加搜索参数
      if (searchId) params.append("reimbursementNumber", searchId);
      if (searchDate) params.append("submissionTime", searchDate);
      if (searchAmount) params.append("amount", searchAmount);

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/user/page?${params.toString()}`,
        { credentials: 'include' }
      );

      if (!response.ok) throw new Error('Network error');
      const result = await response.json();

      if (result.status === "200") {
        setData(result.data.record);
        setTotalPages(Math.ceil(result.data.total / itemsPerPage));
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取各状态的总数
  const fetchStatusCounts = async () => {
    try {
      const fetchCount = async (status) => {
        const params = new URLSearchParams({ page: 1, pageSize: 1 });
        if (status) params.append("status", status);
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/page?${params.toString()}`, { credentials: 'include' });
        const data = await res.json();
        return data.data?.total || 0;
      };

      setStatusCounts({
        all: await fetchCount(""),
        wait: await fetchCount("wait"),
        unpass: await fetchCount("rejected"),
        pass: await fetchCount("approved"),
      });
    } catch (error) {
      console.error('Fetch counts error:', error);
    }
  };

  // 获取已通过总金额
  const fetchApprovedTotal = async () => {
    try {
      const params = new URLSearchParams({
        status: "approved",
        page: 1,
        pageSize: 1000 // 假设足够大以获取全部
      });

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/user/page?${params.toString()}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      const total = data.data?.record?.reduce((sum, item) => sum + item.amount, 0) || 0;
      setTotalApprovedAmount(total);
    } catch (error) {
      console.error('Fetch approved total error:', error);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchStatusCounts();
    fetchApprovedTotal();
  }, []);

  // 分页/筛选变化时获取数据
  useEffect(() => { fetchData(); }, [currentPage, activeTab, searchId, searchDate, searchAmount]);

  // 切换筛选条件重置页码
  useEffect(() => { setCurrentPage(1); }, [activeTab, searchId, searchDate, searchAmount]);

  // 金额格式化
  const formatAmount = (amount) => amount?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0.00";

  return (
    <div className="reimbursement-record">
      {/* 状态标签 */}
      <div className="tabs">
        <button className={`tab ${activeTab === "all" && "active"}`} onClick={() => setActiveTab("all")}>
          全部 ({statusCounts.all})
        </button>
        <button className={`tab ${activeTab === "wait" && "active"}`} onClick={() => setActiveTab("wait")}>
          审批中 ({statusCounts.wait})
        </button>
        <button className={`tab ${activeTab === "unpass" && "active"}`} onClick={() => setActiveTab("unpass")}>
          未通过 ({statusCounts.unpass})
        </button>
        <button className={`tab ${activeTab === "pass" && "active"}`} onClick={() => setActiveTab("pass")}>
          已通过 ({statusCounts.pass})
        </button>

        <div className="approved-amount">
          <span>报销金额合计:</span>
          <span className="amount-value">{formatAmount(totalApprovedAmount)} 元</span>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="search-bar">
        <input type="text" placeholder="搜索报销编号" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
        <input type="text" placeholder="搜索申请日期" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
        <input type="text" placeholder="搜索报销金额" value={searchAmount} onChange={(e) => setSearchAmount(e.target.value)} />
      </div>

      {/* 数据表格 */}
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
            <tr><td colSpan="4">加载中...</td></tr>
          ) : data.length > 0 ? (
            data.map((item) => (
              <tr key={item.reimbursementNumber}>
                <td>{item.reimbursementNumber}</td>
                <td>{item.title}</td>
                <td>{formatAmount(item.amount)}</td>
                <td>{item.submissionTime}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">无匹配记录</td></tr>
          )}
        </tbody>
      </table>

      {/* 分页控件 */}
      {data.length > 0 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
            上一页
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let page = currentPage <= 3 ? i + 1 
              : currentPage >= totalPages - 2 ? totalPages - 4 + i 
              : currentPage - 2 + i;
            return (
              <button key={page} onClick={() => setCurrentPage(page)} className={currentPage === page ? "active" : ""}>
                {page}
              </button>
            );
          })}

          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
            下一页
          </button>
          
          <span>第 {currentPage} 页 / 共 {totalPages} 页</span>
        </div>
      )}
    </div>
  );
}

export default ReimbursementRecord;