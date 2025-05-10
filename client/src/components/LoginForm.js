import { VscEyeClosed } from "react-icons/vsc";
import { RxEyeOpen } from "react-icons/rx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { login } from "@/features/userSlice";

const _status = "loading"
export const LoginForm = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const { status } = useSelector(state => state.userSlice)
    const [loginData, setLoginData] = useState({ email: "", password: "" })
    const router = useRouter()
    const dispatch = useDispatch()

    function onChangeHandler(e) {
        const { name, value } = e.target
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    async function loginHandler() {
        if (!loginData.email || !loginData.password) {
            toast.error("Email, password required")
            return
        }

        try {
            const resp = await dispatch(login(loginData)).unwrap()
            
            if (resp?.success) {
                sessionStorage.setItem("token", resp?.token)
                sessionStorage.setItem("user", JSON.stringify(resp?.user))
                router.push("/dashboard");
            } else {
                toast.error(resp?.message || "Login failed");
            }
        } catch (error) {
            console.log("Error login:=>", error);
            const message = error || "Login failed. Please try again.";
            toast.error(message);
        }

    }

    return (
        <>
            <section className="">
                <div className="form-floating mb-3">
                    <input type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        disabled={status === _status ? true : false}
                        name="email"
                        value={loginData.email}
                        onChange={(e) => onChangeHandler(e)}
                    />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating position-relative">
                    <div className="position-absolute  z-3 end-0 top-50" style={{ transform: "translate(-1.5rem, -50%) scale(1.1)" }}
                        onClick={() => setPasswordVisible(prev => !prev)}>
                        {passwordVisible ? <RxEyeOpen className="text-secondary" /> : <VscEyeClosed className="text-secondary" />}
                    </div>
                    <input type={passwordVisible ? "text" : "password"}
                        className="form-control position-relative"
                        id="floatingPassword" placeholder="Password"
                        disabled={status === _status ? true : false}
                        name="password"
                        value={loginData.password}
                        onChange={(e) => onChangeHandler(e)}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="mt-3 d-flex justify-content-center align-items-center">
                    <button className="btn btn-warning m-0 w-75"
                        disabled={status === _status ? true : false}
                        onClick={loginHandler}
                    >
                        {status === _status ? "Please wait..." : "Login"}
                    </button>
                </div>
            </section>
        </>
    )
}