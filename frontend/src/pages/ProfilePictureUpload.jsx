import React, { useState } from "react";
import axios from "axios";

const ProfilePictureUpload = ({ userId }) => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState(null);

    // Handle file change event
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setProfilePicture(file);
        setPreview(URL.createObjectURL(file)); // Create a preview of the image
        }
    };

    // Handle form submission to upload the image
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!profilePicture) {
        setError("Please select a profile picture.");
        return;
        }

        const formData = new FormData();
        formData.append("profilePicture", profilePicture);

        try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.post(`http://localhost:8000/uploadProfilePicture/${userId}`, formData, {
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            },
    
        });
            console.log(response);

        // Handle success
            console.log("Profile picture uploaded successfully:", response.data);
            setUploadedUrl(response.data.filePath);
            setLoading(false);
        } catch (err) {
            console.error("Error uploading profile picture:", err);
            setError("Error uploading profile picture");
            setLoading(false);
        }
    };

    return (
        <div className="md:container-sm md:mx-auto px-4 bg-orange-50 columns-1 md:box-content h-32 w-96 p-4 mt-6 grid border-slate-100 bg-orange-50 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl">
        <h3>Upload Profile Picture</h3>
        {preview && (
            <div>
            <img src={preview} alt="Preview" style={{ width: "150px", height: "150px", borderRadius: "50%" }} />
            {/* <p>Selected image: {profilePicture.name}</p> */}
            </div>
        )}
        <form onSubmit={handleSubmit}>
            <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            />
            <button type="submit" disabled={loading} className="mt-2 bg-blue-500 text-white rounded px-4 py-2">
            {loading ? "Uploading..." : "Upload Picture"}
            </button>
        </form>
        {error && <div style={{ color: "red" }}>{error}</div>}

        {/* Show the uploaded image URL or path */}
        {uploadedUrl && (
            <div>
            <h4>Uploaded Image URL:</h4>
            <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
                {uploadedUrl}
            </a>
            <img
                src={uploadedUrl}
                alt="Uploaded Profile"
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
            />
            </div>
        )}
        </div>
    );
};

export default ProfilePictureUpload;
