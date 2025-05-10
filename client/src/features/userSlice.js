import {
    ADD_NEW_TASK_API, DELETE_TASK_API, SEND_OTP_API,
    UPDATE_TASK_API, USER_LOGIN_API, USER_SIGNUP_API
} from "@/utils/apis";
import { createAsyncThunk, createSlice, isRejected } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";


export const sendOTP = createAsyncThunk('sendOTP/posts', async (email, { rejectWithValue }) => {
    try {
        const resp = await axios.post(SEND_OTP_API, { email });
        return resp.data
    } catch (error) {

        toast.error(error.response?.data?.message)
        return rejectWithValue(error.response?.data?.message)
    }
})

export const signup = createAsyncThunk("signup.posts", async (data, { dispatch, rejectWithValue }) => {
    try {
        const resp = await axios.post(USER_SIGNUP_API, data)
        if (resp?.data?.success) {
            toast.success("Signup successful")
        }
        dispatch(setSignUpData(resp?.data?.user))
        dispatch(setToken(resp?.data?.token))
        return resp?.data
    } catch (error) {
        console.log(error);
        toast.error(error?.response.data.message)
        return rejectWithValue(error?.response.data.message)
    }
})

export const login = createAsyncThunk("login.posts", async (data, { dispatch, rejectWithValue }) => {
    try {
        const resp = await axios.post(USER_LOGIN_API, data)

        if (resp?.data?.success) {
            dispatch(setUserData(resp?.data?.user))
            dispatch(setToken(resp?.data?.token))
        }
        return resp?.data
    } catch (error) {

        const message = error?.response?.data?.message || "Login failed. Please try again.";
        return rejectWithValue(message);
    }
})

export const addNewTask = createAsyncThunk("addNewTask.posts", async (data, { dispatch, rejectWithValue }) => {
    try {
        const token = sessionStorage.getItem("token")
        const resp = await axios.post(ADD_NEW_TASK_API, data, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        if (resp?.data?.success) {
            dispatch(setTask(resp?.data))
        }
        return resp?.data
    } catch (error) {
        console.log("Add task error", error);
        const message = error?.response?.data?.message || "Failed to add task.";
        return rejectWithValue(message);
    }
})

export const deleteTask = createAsyncThunk("deleteTask.posts", async (taskId, { dispatch, rejectWithValue }) => {
    try {
        const token = sessionStorage.getItem("token")
        const resp = await axios.post(DELETE_TASK_API, taskId, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        if (resp?.data.success) {
            dispatch(setTask(resp.data))
        }
        return resp?.data
    } catch (error) {
        console.log(error)
        const msg = error?.response.data.message || "Failed to delete task"
        return rejectWithValue(msg)
    }
})

export const updateTaskDetails = createAsyncThunk("updateTaskDetails.posts", async (data, { dispatch, rejectWithValue }) => {
    try {

        const token = sessionStorage.getItem("token")

        const resp = await axios.post(UPDATE_TASK_API, data, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        if (resp?.data.success) {
            dispatch(setTask(resp.data))
        }
        return resp?.data
    } catch (error) {
        console.log(error)
        const msg = error?.response.data.message || "Failed to update task"
        return rejectWithValue(msg)
    }
})

const initialState = {
    user: null,
    token: null,
    status: "idle",
    error: null
}

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUserData: (state, { payload }) => {
            state.user = payload
        },
        setToken: (state, { payload }) => {
            state.token = payload
        },
        setTask: (state, { payload }) => {
            state.user.tasks = payload.tasks
            state.user.tasksCreated = payload.tasksCreated
        },
        setStatus: (state, { payload }) => {
            state.status = payload
        },
        setError: (state, { payload }) => {
            state.error = payload
        },
        setLogout: (state) => {
            state.user = null
            state.token = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(sendOTP.pending, (state) => {
            state.status = "loading"
        })
            .addCase(sendOTP.fulfilled, (state) => {
                state.status = 'success'
            })
            .addCase(sendOTP.rejected, (state, { payload }) => {
                state.error = payload
                state.status = 'error'
            })
            .addCase(signup.pending, (state) => {
                state.status = "loading"
            })
            .addCase(signup.fulfilled, (state, { payload }) => {
                state.status = "success"
            })
            .addCase(signup.rejected, (state, { payload }) => {
                state.error = payload
                state.status = "error"
            })
            .addCase(login.pending, (state) => {
                state.status = "loading"
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.status = "success"
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.error = payload
                state.status = "error"
            })
            .addCase(addNewTask.pending, (state) => {
                state.status = "loading"
            })
            .addCase(addNewTask.fulfilled, (state, { payload }) => {
                state.status = "success"
            })
            .addCase(addNewTask.rejected, (state, { payload }) => {
                state.error = payload
                state.status = "error"
            })
            .addCase(deleteTask.pending, (state) => {
                state.status = "loading"
            })
            .addCase(deleteTask.fulfilled, (state, { payload }) => {
                state.status = "success"
            })
            .addCase(deleteTask.rejected, (state, { payload }) => {
                state.error = payload
                state.status = "error"
            })
            .addCase(updateTaskDetails.pending, (state) => {
                state.status = "loading"
            })
            .addCase(updateTaskDetails.fulfilled, (state, { payload }) => {
                state.status = "success"
            })
            .addCase(updateTaskDetails.rejected, (state, { payload }) => {
                state.error = payload
                state.status = "error"
            })
    }
})
export const { setUserData, setToken, setTask, setStatus, setError, setLogout } = userSlice.actions
export default userSlice.reducer