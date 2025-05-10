const BASEURL = process.env.NEXT_PUBLIC_BASEURL

export const SEND_OTP_API = BASEURL + "/auth/send-otp"
export const USER_SIGNUP_API = BASEURL + "/auth/signup"
export const USER_LOGIN_API = BASEURL + "/auth/login"

export const ADD_NEW_TASK_API = BASEURL + "/user/task"
export const DELETE_TASK_API = BASEURL + "/user/task/delete"
export const UPDATE_TASK_API = BASEURL + "/user/task/update"