// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './reimbursement-audit.css';
// import { updateReimbursementStatus } from './utils';

// // Mock data
// const initialData = [
//   { id: 1, reimbursementNumber: 'RN001', title: 'Title 1', amount: 1000, auditor: 'Auditor A', company: '财务部', status: 'pending' },
//   { id: 2, reimbursementNumber: 'RN002', title: 'Title 2', amount: 1100, auditor: 'Auditor B', company: '财务部', status: 'pending' },
//   { id: 3, reimbursementNumber: 'RN003', title: 'Title 3', amount: 1200, auditor: 'Auditor C', company: '财务部', status: 'pending' },
//   { id: 4, reimbursementNumber: 'RN004', title: 'Title 4', amount: 1300, auditor: 'Auditor D', company: '行政部', status: 'pending' },
//   { id: 5, reimbursementNumber: 'RN005', title: 'Title 5', amount: 1400, auditor: 'Auditor E', company: '行政部', status: 'pending' },
//   { id: 6, reimbursementNumber: 'RN006', title: 'Title 6', amount: 1500, auditor: 'Auditor F', company: '财务部', status: 'pending' },
//   { id: 7, reimbursementNumber: 'RN007', title: 'Title 7', amount: 1600, auditor: 'Auditor G', company: '财务部', status: 'pending' },
//   { id: 8, reimbursementNumber: 'RN008', title: 'Title 8', amount: 1700, auditor: 'Auditor H', company: '财务部', status: 'pending' },
//   { id: 9, reimbursementNumber: 'RN009', title: 'Title 9', amount: 1800, auditor: 'Auditor I', company: '行政部', status: 'pending' },
//   { id: 10, reimbursementNumber: 'RN010', title: 'Title 10', amount: 1900, auditor: 'Auditor J', company: '财务部', status: 'pending' },
//   { id: 11, reimbursementNumber: 'RN011', title: 'Title 11', amount: 2000, auditor: 'Auditor K', company: '财务部', status: 'pending' },
// ];

// function ReimbursementAudit() {
//   const [auditItems, setAuditItems] = useState(initialData);
//   const [filteredItems, setFilteredItems] = useState(initialData);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchParams, setSearchParams] = useState({
//     reimbursementNumber: '',
//     company: ''
//   });
//   const itemsPerPage = 10;

//   const pendingCount = auditItems.filter(item => item.status === 'pending').length;
//   const reviewedCount = auditItems.filter(item => item.status === 'reviewed').length;
//   const navigate = useNavigate();

//   // Handle search when searchParams change
//   useEffect(() => {
//     const results = auditItems.filter(item => {
//       const matchesNumber = searchParams.reimbursementNumber === '' ||
//         item.reimbursementNumber.toLowerCase().includes(searchParams.reimbursementNumber.toLowerCase());

//       const matchesCompany = searchParams.company === '' ||
//         item.company.toLowerCase().includes(searchParams.company.toLowerCase());

//       return matchesNumber && matchesCompany && item.status === 'pending';
//     });
//     setFilteredItems(results);
//     setCurrentPage(1); // Reset to first page when search changes
//   }, [searchParams, auditItems]);

//   const handleExport = () => {
//     console.log('Export to Excel');
//     // Implement export logic
//   };
//   /*
//     const handleAudit = (id, newstatus) => {
//       const updatedItems = auditItems.map(item =>
//         item.id === id ? { ...item, status: newstatus } : item
//       );
//       setAuditItems(updatedItems);
//     };
//   */

//   const handleAudit = async (id, newStatus) => {
//     const updatedDetail = await updateReimbursementStatus(id, newStatus);
//     if (updatedDetail) {
//       // 更新本地状态
//       setAuditItems(auditItems.map(item => item.id === id ? updatedDetail : item));
//     }
//   };

//   const handleSearchChange = (e) => {
//     const { name, value } = e.target;
//     setSearchParams(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleViewDetail = (item) => {
//     navigate(`/accountant/components/reimbursement-detail/${item.id}`, {
//       state: {
//         detail: item,
//         id: item.id // 传递 ID
//       }
//     });
//   };

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

//   const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

//   const paginate = pageNumber => setCurrentPage(pageNumber);

//   return (
//     <div className="container">
//       {/* First Row: Status buttons and Export */}
//       <div className="first-row">
//         <div className="status-buttons">
//           <span className="status-button">待审核({pendingCount})</span>
//           <span className="status-button">已审核({reviewedCount})</span>
//         </div>
//         <button className="export-button" onClick={handleExport}>导出EXCEL</button>
//       </div>

//       {/* Second Row: Search fields */}
//       <div className="second-row">
//         <input
//           type="text"
//           name="reimbursementNumber"
//           placeholder="报销编号"
//           className="search-input"
//           value={searchParams.reimbursementNumber}
//           onChange={handleSearchChange}
//         />
//         <input
//           type="text"
//           name="company"
//           placeholder="单位名称"
//           className="search-input"
//           value={searchParams.company}
//           onChange={handleSearchChange}
//         />
//       </div>

//       {/* Third Row: Table */}
//       <table className="audit-table">
//         <thead>
//           <tr>
//             <th>报销编号</th>
//             <th>报销标题</th>
//             <th>报销金额</th>
//             <th>报销人</th>
//             <th>单位名称</th>
//             <th>操作</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentItems.length > 0 ? (
//             currentItems.map(item => (
//               <tr key={item.id}>
//                 <td>{item.reimbursementNumber}</td>
//                 <td>{item.title}</td>
//                 <td>{item.amount.toLocaleString()}</td>
//                 <td>{item.auditor}</td>
//                 <td>{item.company}</td>
//                 <td>
//                   <>
//                     <button
//                       className="detail-btn"
//                       onClick={() => handleViewDetail(item)}
//                     >
//                       详细
//                     </button>
//                     <button
//                       className="approve-btn"
//                       onClick={() => handleAudit(item.id, 'approved')}
//                     >
//                       通过
//                     </button>
//                     <button
//                       className="reject-btn"
//                       onClick={() => handleAudit(item.id, 'rejected')}
//                     >
//                       不通过
//                     </button>

//                   </>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="no-data">没有找到匹配的报销记录</td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       {filteredItems.length > itemsPerPage && (
//         <div className="pagination">
//           <button
//             onClick={() => paginate(Math.max(1, currentPage - 1))}
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
//                 onClick={() => paginate(pageNum)}
//                 className={currentPage === pageNum ? 'active' : ''}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}

//           <button
//             onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
//             disabled={currentPage === totalPages}
//           >
//             下一页
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ReimbursementAudit;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './reimbursement-audit.css';
import { updateReimbursementStatus } from './utils';

function ReimbursementAudit() {

  const [editCount, setEditCount] = useState(0);
  const [auditItems, setAuditItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    reimbursementNumber: '',
    company: ''
  });
  const itemsPerPage = 10;

  const pendingCount = auditItems.filter(item => item.status === 'wait').length;
  const reviewedCount = auditItems.filter(item => item.status === 'approved' || item.status === 'rejected').length;
  const navigate = useNavigate();

  function getCookie(name) {
    const cookieArray = document.cookie.split('; '); // 按照分号和空格分割
    for (let i = 0; i < cookieArray.length; i++) {
        const cookiePair = cookieArray[i].split('='); // 按照等号分割
        if (name === cookiePair[0]) {
            return decodeURIComponent(cookiePair[1]); // 返回解码后的值
        }
    }
    return null; // 如果没有找到对应的 Cookie，返回 null
}

  useEffect(() => {
    // Fetch data from the API
    console.log(getCookie('Authorization'))
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/accountant/page?page=${currentPage}&pageSize=${itemsPerPage}`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data)
        if (data.status === '200') {
          setAuditItems(data.data.record);
          setFilteredItems(data.data.record);
          setTotalPages(Math.ceil(data.data.total / itemsPerPage));
          setLoading(false);
        } else {
          console.error('API Error:', data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage,editCount]);

  // Handle search when searchParams change
  useEffect(() => {
    const results = auditItems.filter(item => {
      const matchesNumber = searchParams.reimbursementNumber === '' ||
        item.reimbursementNumber.toString().includes(searchParams.reimbursementNumber);

      const matchesCompany = searchParams.company === '' ||
        item.seller.toLowerCase().includes(searchParams.company.toLowerCase());

      return matchesNumber && matchesCompany && item.status === 'wait';
    });
    setFilteredItems(results);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchParams, auditItems]);

  const handleExport = () => {
    console.log('Export to Excel');
    // Implement export logic
  };

  const handleAudit = async (item, newStatus) => {
    const updatedDetail = await updateReimbursementStatus(item.id, {
      reimbursementNumber: item.reimbursementNumber,
      status: newStatus
    });
    if (updatedDetail) {
      // 更新本地状态
      setAuditItems(auditItems.map(it => it.id === item.id ? updatedDetail : it));
    }
    setEditCount(editCount + 1);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleViewDetail = (item) => {
    navigate(`/accountant/components/reimbursement-detail/${item.id}`, {
      state: {
        detail: item,
        id: item.id // 传递 ID
      }
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container">
      {/* First Row: Status buttons and Export */}
      <div className="first-row">
        <div className="status-buttons">
          <span className="status-button">待审核({pendingCount})</span>
          <span className="status-button">已审核({reviewedCount})</span>
        </div>
        <button className="export-button" onClick={handleExport}>导出EXCEL</button>
      </div>

      {/* Second Row: Search fields */}
      <div className="second-row">
        <input
          type="text"
          name="reimbursementNumber"
          placeholder="报销编号"
          className="search-input"
          value={searchParams.reimbursementNumber}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="company"
          placeholder="单位名称"
          className="search-input"
          value={searchParams.company}
          onChange={handleSearchChange}
        />
      </div>

      {/* Third Row: Table */}
      <table className="audit-table">
        <thead>
          <tr>
            <th>报销编号</th>
            <th>报销标题</th>
            <th>报销金额</th>
            <th>报销人</th>
            <th>单位名称</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="no-data">加载中...</td>
            </tr>
          ) : currentItems.length > 0 ? (
            currentItems.map(item => (
              <tr key={item.id}>
                <td>{item.reimbursementNumber}</td>
                <td>{item.title}</td>
                <td>{item.amount.toLocaleString()}</td>
                <td>{item.buyer}</td>
                <td>{item.seller}</td>
                <td>
                  <button
                    className="detail-btn"
                    onClick={() => handleViewDetail(item)}
                  >
                    详细
                  </button>
                  <button
                    className="approve-btn"
                    onClick={() => handleAudit(item, 'approved')}
                  >
                    通过
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleAudit(item, 'rejected')}
                  >
                    不通过
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">没有找到匹配的报销记录</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {filteredItems.length > itemsPerPage && (
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
                className={currentPage === pageNum ? 'active' : ''}
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

export default ReimbursementAudit;