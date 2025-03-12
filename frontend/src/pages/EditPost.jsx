import React, {useState} from 'react';
import axios from 'axios';

const EditPost = () => {
  const [error, setError] = useState("");

  const updateBlog = async (id, updatedData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to update a blog.");
      return;
    }
  
    try {
      await axios.put(`http://localhost:8000/update/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // After successful edit, maybe redirect or update the state
    } catch (error) {
      console.error("Error updating blog:", error);
      setError(error.response?.data?.message || "Error updating blog");
    }
  };
  return (
    <div>EditPost</div>
  )
}

export default EditPost