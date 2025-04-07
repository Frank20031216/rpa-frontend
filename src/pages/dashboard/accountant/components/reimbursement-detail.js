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
    // 调用全局更新逻辑（假设有一个全局函数 updateReimbursementStatus）
    const updatedDetail = await updateReimbursementStatus(itemId, newStatus);
    if (updatedDetail) {
      // 更新成功后，重新加载详情页或返回列表
      navigate(-1);
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
          <h3>基本信息</h3>
          <div className="detail-item">
            <span className="detail-label">报销编号</span>
            <span className="detail-value">{detail.reimbursementNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">报销标题</span>
            <span className="detail-value">{detail.title}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">报销金额</span>
            <span className="detail-value">¥{detail.amount?.toLocaleString()}</span>
          </div>
        </div>

        {/* 审批信息区块 */}
        <div className="detail-section">
          <h3>审批信息</h3>
          <div className="detail-item">
            <span className="detail-label">报销人</span>
            <span className="detail-value">{detail.auditor}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">所属部门</span>
            <span className="detail-value">{detail.company}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">当前状态</span>
            <span className="detail-value" style={{ 
              color: detail.status === 'approved' ? '#52c41a' : '#ff4d4f' 
            }}>
              {detail.status === 'pending' ? '待审核' : 
               detail.status === 'approved' ? '已报销' : '已拒绝'}
            </span>
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