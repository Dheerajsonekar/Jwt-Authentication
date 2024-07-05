import React, {useEffect, useState} from "react";
import axios from 'axios';
import {ToastContainer, toast} from "react-toastify";
import {useNavigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';

const Home = () => {

    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const [username, setUsername] = useState("");
   
    useEffect(() => {
        const verifyCookies = async () => {
            if(!cookies.token){
                navigate("/login");
            }

            const {data} = await axios.post(
                "http://localhost:4000",
                {},
                {
                    withCredentials: true,
                }
            );

            const {status, user } = data;
            setUsername(user);
            return status 
            ? toast(`Hello ${user}`, {
                postition: "top-right",
            })
            : (removeCookie("token", navigate("/login")));
        };
        verifyCookies();
    } , [cookies, navigate, removeCookie]);

    const Logout = () => {
        removeCookie("token");
        navigate("/login");
    }



  return (
  <>
    <div className="home_page">
      <h4>
        {" "}
        Welcome <span>{username}</span>
      </h4>
      <button onClick={Logout}>LOGOUT</button>
    </div>
    <ToastContainer />
  </>
  );
};

export default Home;
