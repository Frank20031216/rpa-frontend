// utils.js
export const updateReimbursementStatus = async (id, updateData) => {
  try {
    const response = await fetch(`https://122.228.26.226:58359/accountant/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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