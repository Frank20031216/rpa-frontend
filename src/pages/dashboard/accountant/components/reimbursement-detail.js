import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './reimbursement-detail.css';
import { updateReimbursementStatus } from './utils';

const ReimbursementDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const detail = state?.detail || {};
  const itemId = state?.id; // 获取传递的 ID

  // 定义更新状态的函数
  const handleStatusUpdate = async (newStatus) => {
    try {
      const updatedDetail = await updateReimbursementStatus(detail.reimbursementNumber, newStatus);
      if (updatedDetail) {
        // 更新成功后，返回列表
        navigate(-1);
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      // 可以考虑在这里增加错误提示
    }
  };

  return (
    <div className="detail-container">
      <div className="detail-header">
        <h2 className="detail-title">报销单详情</h2>
        <button
          className="back-btn action-button"
          onClick={() => navigate(-1)}
        >
          返回列表
        </button>
      </div>

      <div className="detail-card">
        {/* 基础信息区块 */}
        <div className="detail-section">
          <h3>发票信息</h3>
          <div className="detail-item">
            <span className="detail-label">单位名称</span>
            <span className="detail-value">{detail.seller || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">单位名称（原字段）</span>
            <span className="detail-value">{detail.company || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">报销人</span>
            <span className="detail-value">{detail.buyer || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">发票金额（含税）（文字表述）</span>
            <span className="detail-value">{detail.totalWithTaxInWords || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">发票金额（不含税）（数字表述）</span>
            <span className="detail-value">¥{detail.totalWithoutTaxInNumbers?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">发票日期</span>
            <span className="detail-value">{detail.invoiceDate || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">发票代码</span>
            <span className="detail-value">{detail.invoiceCode || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">发票号码</span>
            <span className="detail-value">{detail.invoiceNumber || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">验证码</span>
            <span className="detail-value">{detail.verificationCode || 'N/A'}</span>
          </div>
        </div>

        {/* 审批信息区块 */}
        <div className="detail-section">
          <h3>审批信息</h3>
          <div className="detail-item">
            <span className="detail-label">报销人</span>
            <span className="detail-value">{detail.buyer || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">所属部门</span>
            <span className="detail-value">{detail.seller || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">当前状态</span>
            <span className="detail-value" style={{
              color: detail.status === 'approved' ? '#52c41a' : '#ff4d4f'
            }}>
              {detail.status === 'wait' ? '待审核' :
                detail.status === 'approved' ? '已报销' : '已拒绝'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">总金额（含税）大写</span>
            <span className="detail-value">{detail.totalWithTaxInWords || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">校验码</span>
            <span className="detail-value">{detail.verificationCode || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">不含税总金额（数字）</span>
            <span className="detail-value">{detail.totalWithoutTaxInNumbers?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">发票日期</span>
            <span className="detail-value">{detail.invoiceDate || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">发票代码</span>
            <span className="detail-value">{detail.invoiceCode || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">发票号码</span>
            <span className="detail-value">{detail.invoiceNumber || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* 操作按钮（如果是待审核状态显示） */}
      {detail.status === 'pending' && (
        <div className="detail-actions">
          <button
            className="approve-btn action-button"
            onClick={() => handleStatusUpdate('approved')}
          >
            通过
          </button>
          <button
            className="reject-btn action-button"
            onClick={() => handleStatusUpdate('rejected')}
          >
            不通过
          </button>
        </div>
      )}
    </div>
  );
};

export default ReimbursementDetail;

// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './reimbursement-detail.css';
// import { updateReimbursementStatus } from './utils';

// const ReimbursementDetail = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const detail = state?.detail || {};
//   const itemId = state?.id;

//   const handleStatusUpdate = async (newStatus) => {
//     try {
//       const updatedDetail = await updateReimbursementStatus(detail.reimbursementNumber, newStatus);
//       if (updatedDetail) {
//         navigate(-1);
//       }
//     } catch (error) {
//       console.error('更新状态失败:', error);
//     }
//   };

//   // 获取完整的图片URL
//   const getImageUrl = () => {
//     if (!detail.image) return null;
//     return `${process.env.REACT_APP_API_BASE_URL}/images/${detail.image}`;
//   };

//   return (
//     <div className="detail-container">
//       <div className="detail-header">
//         <h2 className="detail-title">报销单详情</h2>
//         <button
//           className="back-btn action-button"
//           onClick={() => navigate(-1)}
//         >
//           返回列表
//         </button>
//       </div>

//       <div className="detail-card">
//         {/* 新增影像预览区块 */}
//         <div className="detail-section">
//           <h3>票据影像</h3>
//           <div className="preview-container">
//             {getImageUrl() ? (
//               detail.image.endsWith('.pdf') ? (
//                 <embed
//                   src={getImageUrl()}
//                   type="application/pdf"
//                   width="100%"
//                   height="600px"
//                   className="preview-content"
//                 />
//               ) : (
//                 <img
//                   src={getImageUrl()}
//                   alt="票据影像"
//                   className="preview-content"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.style.display = 'none';
//                   }}
//                 />
//               )
//             ) : (
//               <div className="no-preview">
//                 <span>暂无影像资料</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* 原有发票信息区块 */}
//         <div className="detail-section">
//           <h3>发票信息</h3>
//           {/* 保持原有发票信息字段... */}
//         </div>

//         {/* 原有审批信息区块 */}
//         <div className="detail-section">
//           <h3>审批信息</h3>
//           {/* 保持原有审批信息字段... */}
//         </div>
//       </div>

//       {/* 操作按钮 */}
//       {detail.status === 'pending' && (
//         <div className="detail-actions">
//           <button
//             className="approve-btn action-button"
//             onClick={() => handleStatusUpdate('approved')}
//           >
//             通过
//           </button>
//           <button
//             className="reject-btn action-button"
//             onClick={() => handleStatusUpdate('rejected')}
//           >
//             不通过
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReimbursementDetail;