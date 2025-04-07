// utils.js
export const updateReimbursementStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/reimbursements/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
  
      const updatedDetail = await response.json();
      return updatedDetail;
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again later.');
    }
  };