import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:4000/all-users", // Endpoint to fetch all users
          {},
          {
            withCredentials: true,
          }
        );

        const { status, users } = data;
        if (status) {
          setUserDetails(users);
          toast(`Fetched ${users.length} users`, { position: "top-right" });
        } else {
          removeCookie("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        removeCookie("token");
        navigate("/login");
      }
    };

    fetchAllUsers();
  }, [cookies.token, navigate, removeCookie]);

  const Logout = () => {
    removeCookie("token");
    navigate("/login");
  };

  return (
    <>
      <div className="navbar">
        <span className="username">Welcome</span>
        <button className="logout-button" onClick={Logout}>
          LOGOUT
        </button>
      </div>
      <div className="home_page">
        <h4>All Users Details</h4>
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                
                <th>Name</th>
                <th>Email</th>
                <th>Date of Birth</th>
                
              </tr>
            </thead>
            <tbody>
              {userDetails.map((user) => (
                <tr key={user._id}>
                  
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.dob).toLocaleDateString()}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
