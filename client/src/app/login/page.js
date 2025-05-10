"use client";
import { LoginForm } from "@/components/LoginForm";
import OpenRoute from "@/components/OpenRoute";
import { SignUpForm } from "@/components/SignupForm";

import { useState } from "react";
const formLogin = "login"
const formSignup = "signup"
export default function Login() {
    const [formType, setFormType] = useState("login")
    
    return (
        <>
            <OpenRoute>
                <section className="container d-flex justify-content-center align-items-center">
                    <div className="rounded border my-5 shadow border-warning p-3" style={{ width: "30rem" }}>
                        {/* Top */}
                        <div className="text-center mt-2 ">
                            <h2 >Welcome to WEDO</h2>
                            <div>
                                <div>Signup or login to manage your</div>
                                <div>task, project & productivity</div>
                            </div>
                            <div className="d-flex justify-content-center  mt-3">
                                <div className={`w-100 py-2 fw-semibold ${formType === formLogin ? "border-3 text-success  border-success  border-bottom" : ""} `}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setFormType("login")}
                                >
                                    Login
                                </div>
                                <div className={`w-100 py-2 fw-semibold ${formType !== "login" ? "border-3 text-success  border-success  border-bottom" : ""} `}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setFormType("signup")}
                                >
                                    Sign Up
                                </div>
                            </div>
                        </div>
                        {/* Form */}
                        <div className="bg-light">
                            <div className="mx-3 py-4">

                                {
                                    formType === formLogin ? (<LoginForm />) : (<SignUpForm  />)
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </OpenRoute>
        </>
    )

}