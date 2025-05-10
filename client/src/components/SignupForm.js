import { useEffect, useState } from "react"
import { VscEyeClosed } from "react-icons/vsc";
import { RxEyeOpen } from "react-icons/rx";
import { BsShieldFillCheck } from "react-icons/bs";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { sendOTP, setUserData } from "@/features/userSlice";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";


const passwordDesc = [
    { icon: <BsShieldFillCheck />, description: "At least 8 characters" },
    { icon: <BsShieldFillCheck />, description: "At least 1 number" },
    { icon: <BsShieldFillCheck />, description: "Both upper & lower case letters" },
]
const _status = "loading"

export const SignUpForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [signupData, setSignupData] = useState({
        name: "", email: "", password: "", confirmPassword: ""
    })
    const { status } = useSelector(state => state.userSlice)
    const dispatch = useDispatch()
    const router = useRouter();

    function onChangeHandler(e) {
        const { name, value } = e.target

        setSignupData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    async function sendOTPHandler() {
        const { name, email, password, confirmPassword } = signupData;

        // Simple validation
        if (!name || !email || !password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Password checks
        const isValidPassword =
            password.length >= 8 &&
            /\d/.test(password) && // has number
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password);

        if (!isValidPassword) {
            toast.error("Password does not meet the requirements");
            return;
        }

        try {
            // Save to Redux
            dispatch(setUserData(signupData));
            // Save to sessionStorage
            sessionStorage.setItem("signUpData", JSON.stringify(signupData));

            // Send OTP
            const resp = await dispatch(sendOTP(email)).unwrap(); // Get `redirectTo`


            if (resp?.redirectTo) {
                router.push(resp.redirectTo);
            }
        } catch (error) {
            console.error("OTP send failed:", error);
            // Error is already toasted in thunk
        }
    }

    return (
        <>
            <section className="">
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInputName"
                        placeholder="John Doe"
                        disabled={status === _status ? true : false}
                        name="name"
                        value={signupData.name}
                        onChange={onChangeHandler}
                    />
                    <label htmlFor="floatingInputName">Enter name</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        disabled={status === _status ? true : false}
                        name="email"
                        value={signupData.email}
                        onChange={onChangeHandler}
                    />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                {/* password */}
                <div className="form-floating position-relative mb-3">
                    <div className="position-absolute  z-3 end-0 top-50" style={{ transform: "translate(-1.5rem, -50%) scale(1.1)" }}
                        onClick={() => setShowPassword(prev => !prev)}>
                        {showPassword ? <RxEyeOpen className="text-secondary" /> : <VscEyeClosed className="text-secondary" />}
                    </div>
                    <input type={showPassword ? "text" : "password"}
                        className="form-control position-relative"
                        id="floatingPassword" placeholder="Password"
                        disabled={status === _status ? true : false}
                        name="password"
                        value={signupData.password}
                        onChange={onChangeHandler}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                {/* confirm-password */}
                <div className="form-floating position-relative">
                    <div className="position-absolute  z-3 end-0 top-50 " style={{ transform: "translate(-1.5rem, -50%) scale(1.1)" }}
                        onClick={() => setShowConfirmPassword(prev => !prev)}>
                        {showConfirmPassword ? <RxEyeOpen className="text-secondary" /> : <VscEyeClosed className="text-secondary" />}
                    </div>
                    <input type={showConfirmPassword ? "text" : "password"}
                        className="form-control position-relative"
                        id="floatingConfirmPassword"
                        placeholder="Confirm password"
                        disabled={status === _status ? true : false}
                        name="confirmPassword"
                        value={signupData.confirmPassword}
                        onChange={onChangeHandler}
                    />
                    <label htmlFor="floatingConfirmPassword">Confirm password</label>
                </div>
                <div className="my-2 ">
                    {
                        passwordDesc.map(info => (
                            <p key={info.description} className="my-1 d-flex gap-2 align-items-center text-secondary" style={{ height: "1.3rem" }}>
                                {info.icon}
                                <span>{info.description}</span>
                            </p>
                        ))
                    }
                </div>
                <div className="mt-3 d-flex justify-content-center align-items-center">
                    <button className="btn btn-warning m-0 w-75"
                        disabled={status === _status ? true : false}
                        onClick={sendOTPHandler} >
                        {status === _status ? "Please wait...":"Sign Up"}
                    </button>
                </div>
            </section>
        </>
    )
}