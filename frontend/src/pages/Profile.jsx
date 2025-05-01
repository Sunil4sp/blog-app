import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [imgurl, setImgurl] = useState("");
  const [password, setPassword] = useState("");
  const [isEdit, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = () => {
    setUsername(user.username);
    setImgurl(user.imageUrl || "");
    setPassword(user.password);
    setIsEditing(true);
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const updatedUser = {
        username,
        imageUrl: imgurl,
        password,
      };

      const response = await axios.put(
        "http://localhost:8000/editProfile",
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local user state with updated data from server
      setUser(response.data.user);
      setIsEditing(false);
      setPassword(""); // Clear password field after update
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`http://localhost:8000/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("User data fetched: ", response.data.user);
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
          // If error occurs (e.g., token expired), remove the token and set user to null
          localStorage.removeItem("token");
          setUser(null);
          navigate("/login");
        });
    } else {
      setUser(null); // If there's no token, set user to null
    }
  }, [navigate]);

  return (
    <>
      {user ? (
        <>
          <div className="md:container-sm px-10 space-x-4 bg-slate-50 mt-2 mx-auto flex flex-row justify-center border-0 bg-orange-50 w-5/6 ">
            <div className="basis-1/4 border-r-1">
              <div className="rounded-full p-8 flex flex-col grid justify-items-center">
                  <img
                    src={user.imageUrl || "https://icons.veryicon.com/png/o/miscellaneous/standard/avatar-15.png"}
                    alt="avatar"
                    width={200}
                    className="rounded-full"
                  />
                
                {/* Link to upload new profile picture */}
                <Link to={`/uploadProfilePicture/${user._id}`}>
                  {/* {console.log(user._id)
                } */}
                  <button className="mt-2 bg-blue-500 text-white rounded px-4 py-2">
                    Change Picture
                  </button>
                </Link>
              </div>
            </div>
            <div className="basis-3/4 border-l-2 font-mono p-4 flex flex-col bg-blue-100 text-black">
              <div className="text-sm grid grid-cols-4 gap-4 items-stretch">
                {!isEdit ? (
                  <button
                    className="p-4 rounded-lg w-36 z-0 hover:bg-sky-500 hover:w-40 hover:text-white hover:font-bold"
                    onClick={handleEditClick}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                  className="p-4 rounded-lg w-36 bg-green-500 text-white hover:bg-green-600"
                  onClick={saveProfile}
                >
                  Save Changes
                </button>
                )}
                <Link to="/create">
                  <button className="p-4 rounded-lg w-36 hover:bg-sky-500 hover:w-40 hover:text-white hover:font-bold">
                    Create blog
                  </button>
                </Link>
                <Link to="/fetchblogs/:id">
                  <button className="p-4 rounded-lg w-36 hover:bg-sky-500 hover:w-40 hover:text-white hover:font-bold">
                    My blog
                  </button>
                </Link>
                <button
                  className="p-4 rounded-lg w-36 hover:bg-sky-500 hover:w-40 hover:text-white hover:font-bold"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
              <div className="mb-4 pl-5 text-xl flex pb-5">Profile</div>
              {isEdit ? (
              <div className="pl-10 space-y-2">
                <div>
                  <label className="block">User's Name:</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block">Image URL:</label>
                  <input
                    type="text"
                    value={imgurl}
                    onChange={(e) => setImgurl(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block">Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="text-l pl-10">{`Hello, ${user.username}!`}
              </div>
            )}
            </div>
            
          </div>
        </>
      ) : (
         <Loader />
      )}
    </>
  );
};

export default Profile;
