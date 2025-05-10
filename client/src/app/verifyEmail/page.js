"use client"
import OpenRoute from "@/components/OpenRoute";
import { sendOTP, setUserData, signup } from "@/features/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import OtpInput from 'react-otp-input';
import { useDispatch, useSelector } from "react-redux";

const _status = "loading"
export default function VerifyEmail() {
    const { user, status } = useSelector(state => state.userSlice)
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch()
    const router = useRouter();

    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem("signUpData"))
        dispatch(setUserData(data))
    }, [status])

    async function reSendOTPHandler() {
        try {
            const resp = await dispatch(sendOTP(user.email)).unwrap()
            if (resp.success) {
                toast.success("OTP sent")
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            const message = error || "Failed to send OTP. Please try again.";
            toast.error(message);

        }

    }

    async function signupHandler() {
        if (otp.length < 4) {
            toast.error("4 digit OTP required")
            return
        }

        try {
            const resp = await dispatch(signup(user)).unwrap();
            if (resp?.success) {
                sessionStorage.setItem("token", resp?.token)
                sessionStorage.setItem("user", JSON.parse(resp?.user))
                sessionStorage.removeItem("signUpData")
                toast.success("Signup successful")
                router.push("/dashboard");
            } else {
                toast.error(resp?.message || "Signup failed");
            }

        } catch (error) {
            console.error("Error signing up:", error);
            const message = error?.message || "Failed to signup. Please try again.";
            toast.error(message);
        }
    }
    return (
        <OpenRoute>
            <section className="container  d-flex justify-content-center align-items-center" style={{ marginTop: "", minHeight: "calc(100vh - 5rem)" }}>
                <div className="d-flex flex-column justify-content-center align-items-center border border-warning rounded shadow p-5" style={{ maxWidth: "30rem" }}>
                    <div className="text-center">
                        <h2>Verify Email</h2>
                        <div className=''>
                            A verification code has been sent to you on
                            <p className='text-primary m-0'>{user?.email}</p> Enter the code below.
                        </div>
                    </div>
                    <div className="my-3">
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={4}

                            renderSeparator={<span>-</span>}
                            renderInput={(props) => <input {...props}
                                style={{ width: "48px" }}
                                disabled={status === _status ? true : false}
                                className='border border-dark rounded text-center'
                            />}
                        />
                    </div>
                    <div className="w-50 border">
                        <button className="btn btn-warning w-100 mx-auto my-auto"
                            disabled={status === _status ? true : false}
                            onClick={signupHandler}
                        >
                            {status === _status ? "Please wait..." : "Verify"}
                        </button>
                    </div>
                    <div className="d-flex justify-content-between align-items-center w-100 mt-3 mb-2">
                        <Link href={`${status === _status ? "" : "/"}`}
                            className="text-decoration-none text-secondary"
                            disabled={status === _status ? true : false}
                        >
                            Back
                        </Link>
                        <button
                            className="text-decoration-none btn border-0 p-0 text-secondary"
                            disabled={status === _status ? true : false}
                            onClick={reSendOTPHandler}>
                            Resend OTP
                        </button>
                    </div>
                </div>
            </section>
        </OpenRoute>
    )
}