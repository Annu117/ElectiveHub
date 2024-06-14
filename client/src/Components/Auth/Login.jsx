import React, { useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { AuthContext } from "./AuthContext";
import BackToTopButton from "../BackToTopButton";
import userImg from "../../assets/images/login.png";
import { toast } from "react-toastify";
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Login = () => {
  

  const cookies = new Cookies();
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setInputValue(prevState => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };
  
  useGSAP(()=>{
    const tl = gsap.timeline();
    tl.from('.text-login',{
      opacity: 0,
      y:100,
      duration: 1,
      delay: 0.5,
      ease: "power3.inOut",
      stagger: {
        amount: 0.5,
      },
    });
    tl.from('.form-login',{
      opacity: 0,
      y:100,
      ease: "power3.inOut",
    });
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          ...inputValue,
        },
        {
          withCredentials: true,
        }
      );

      if (response) {
        console.log(response.data.token);
        login(response.data.token);

        cookies.set("TOKEN", response.data.token, {
          path: "/",
        });
      }
      console.log(cookies.get("TOKEN"));

      const { success, message } = response.data;

      if (success) {
        navigate("/Home");
      } else {
        alert(message.message);
        console.log(message);
      }
    } catch (error) {
      toast.error("Incorrect credentials. Check and try again or sign up.");
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 gap-0 md:gap-2 ">
      {/* <img src={userImg} alt="user" className="w-0 sm:w-0 md:w-[30vw]" /> */}
      <div class="hidden lg:flex lg:w-[30vw]">
            <img
              src={userImg}
              alt="mockup"
              width={300}
              height={300}
              className="w-full lg:ml-6 animate-bounce-slow img-home"
            />
      </div>
      <div class="flex flex-col bg-white border-2 shadow-sm rounded-xl dark:bg-gray-900 border-blue-400 dark:border-blue-300 transition duration-300  lg:mb-10 sm:mb-5 ml-12">

      <div className="max-w-md w-full px-6 py-8 rounded-md">
        
        <h2 className="text-[4vw] sm:text-3xl font-bold text-center mb-6 text-white text-login">
          Login Account
        </h2>
        <form onSubmit={handleSubmit} className="form-login">
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-[3vw] sm:text-sm font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              required
              placeholder="Enter your email"
              onChange={handleOnChange}
              className="w-full px-2  py-2 sm:py-2 md:py-3 rounded-md outline-none border  border-blue-400 dark:border-blue-300 bg-transparent border-1.5"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-[3vw] sm:text-sm font-medium text-white"
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={inputValue.showPassword ? 'text' : 'password'}
                name="password"
                required
                value={password}
                placeholder="Enter your password"
                onChange={handleOnChange}
                className="w-full px-2 py-2 sm:py-2 md:py-3 rounded-md outline-none border border-blue-400 text-[15px] dark:border-blue-300 bg-transparent border-1.5"
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                }}
                onClick={togglePasswordVisibility}
              >
                {inputValue.showPassword ?  <i className="material-icons">&#x1F441;</i> : <i className="material-icons">&#x1F440;</i>}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center flex-wrap">
          <div class="flex flex-col bg-white border-2 shadow-sm rounded-xl dark:bg-gray-900 border-blue-400 dark:border-blue-300 transition duration-300 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 lg:mb-10 sm:mb-5">
          {/* <div class="p-4 md:p-5"> */}
            <button
              type="submit"
              className="text-white  font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2 text-center "
            >
              Submit
            </button></div>
            <div className="w-80 ">
            <p className=" text-white  text-[3vw] sm:text-sm">
              New to the Platform?
              <Link
                to={"/signup"}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                {" "}
                Signup
              </Link>
            </p>
          </div></div>
        </form>
      </div></div>
    </div>
  );
};

export default Login;
