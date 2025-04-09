// utils.js
export const updateReimbursementStatus = async (id, updateData) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/accountant/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', 
      body: JSON.stringify(updateData),
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
