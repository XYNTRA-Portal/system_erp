import React, { useState } from "react";
import axios from "axios";
import "boxicons/css/boxicons.min.css";

const LoginForm = () => {
    const [data, setData] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setData({ ...data, [e.target.name]: e.target.value });
    }
    
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}auth/login`, data)
            console.log(response)
            if (response){
                alert("Inicio exitoso")
            }
        } catch(err: any) {
            alert("Error")
        }
    }

    return (
        <div className="flex flex-col place-items-center w-120 h-auto p-16 rounded-[50px] bg-gray-900">
            <h1 className="text-blue-500 text-3xl font-bold">BALAMDEV</h1>
            <form onSubmit={onSubmit} className="flex flex-col space-y-6 my-6 text-md">
                <input onChange={onChange} type="email" id="email" name="email" placeholder="Email" className="bg-gray-800 text-gray-50 py-2 px-4 rounded-3xl w-80" />
                <div className="relative w-80">
                    <input onChange={onChange} type={showPassword ? "text" : "password"} id="password" name="password" placeholder="Password" className="bg-gray-800 text-gray-50 py-2 px-4 rounded-3xl w-full" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg hover:text-blue-400 cursor-pointer" aria-label={showPassword ? "Hide Password" : "Show Password"}>
                        <i className={ showPassword ? "bx bx-hide" : "bx bx-show" } />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button className="bg-white text-blue-600 p-1 rounded-4xl w-fill hover:bg-blue-700 hover:text-white duration-200 cursor-pointer">Register</button>
                    <button type="submit" className="bg-blue-600 text-white p-1 rounded-4xl w-fill hover:bg-blue-700 duration-200 cursor-pointer">Log in</button>
                </div>
                <p className="text-blue-100 text-xs hover:text-blue-50 duration-300 cursor-pointer">Welcome again!</p>
            </form>
        </div>
    )
}

export default LoginForm;