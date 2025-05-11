"use client"
import ProtectedRoute from "@/components/ProtectedRoute";
import { addNewTask, setLogout, setUserData } from "@/features/userSlice";
import useFetch from "@/hooks/useFetch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const taskData = [
    { title: "Tasks", count: 5, color: "text-bg-primary ", css: "#87CEEB", url: "tasks" },
    { title: "Created", count: 2, color: "text-bg-warning", css: "#32de84", url: "tasks-created" },
    { title: "OverDue", count: 1, color: "text-bg-danger", css: "#F88379", url: "tasks-closed" },
    // { title: "All", count: 10, color: "text-bg-info" },
]
"Todo", "In-Progress", "Completed", "Blocked"
const statusList = [
    { label: "Todo", value: "Todo" },
    { label: "In-Progress", value: "In-Progress" },
    { label: "Completed", value: "Completed" },
    { label: "Blocked", value: "Blocked" },
]
const priorityList = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
]
const _status = "loading"

export default function Dashboard() {
    const { user, status } = useSelector(state => state.userSlice)
    const [taskDetails, setTaskDetails] = useState({ title: "", description: "", dueDate: "", priority: "", status: "", assignTo: "" })
    const dispatch = useDispatch()
    const closeModalBtn = useRef(null);
    const { fetchData, error, data, loading } = useFetch()

    const router = useRouter()
    useEffect(() => {
        dispatch(setUserData(JSON.parse(sessionStorage.getItem("user"))))
    }, [])

    function onChangeHandler(e) {
        const { name, value } = e.target

        setTaskDetails(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function getUserList() {
        fetchData("userList")
    }

    async function addNewTaskHandler(e) {
        e.preventDefault()

        const { title, description, dueDate, assignTo, status, priority } = taskDetails
        if (!title || !description || !dueDate || !assignTo || !status || !priority) {
            toast.error("All feilds required")
            return
        }

        try {
            const resp = await dispatch(addNewTask(taskDetails)).unwrap()

            if (resp?.success) {
                const user = JSON.parse(sessionStorage.getItem("user"))
                user.tasks = resp.tasks
                user.tasksCreated = resp.tasksCreated
                sessionStorage.setItem("user", JSON.stringify(user))
                toast.success("New task added")
                closeModalBtn.current.click()
                setTaskDetails({ title: "", description: "", dueDate: "", priority: "", status: "", assignTo: "" })
            }
        } catch (error) {
            console.log(error)
            const message = error || "Failed add task";
            toast.error(message);

        }

    }

    function logoutHandler() {
        sessionStorage.clear();
        router.replace("/login");
    }

    return (
        <>
            <ProtectedRoute>
                <section className="container ">
                    <div className=" my-3 row gap-3">
                        {/* left-card */}
                        <div className="card col-lg-4">
                            <div className="card-body d-flex flex-column align-items-center ">
                                <div className='rounded-circle ' style={{ maxWidth: "5rem" }}>
                                    <img
                                        src={`https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(user?.name)}`}
                                        className="rounded-circle border w-100 h-100 object-fit-cover "
                                        alt="user profile image"

                                    />
                                </div>
                                <div className="my-4  text-center">
                                    <h5 className="card-title">{user?.name}</h5>
                                    <div>{user?.email}</div>

                                    <div className="btn btn-danger btn-sm mt-3" onClick={logoutHandler}>Logout</div>
                                </div>
                            </div>
                        </div>


                        {/* right card */}

                        <div className=" card border col">
                            <div className="card-body">
                                <div className="d-flex justify-content-between ">
                                    <h6 className="card-title my-auto">Hi, Welcome back</h6>
                                    <div className="btn btn-sm btn-warning"
                                        data-bs-toggle="modal" data-bs-target="#addTaskModal" data-bs-whatever="@mdo"
                                        onClick={getUserList}
                                    >
                                        Add Task
                                    </div>
                                </div>
                                <hr />
                                <div className="d-flex flex-wrap flex-md-nowrap flex-lg-nowrap gap-3  my-auto mt-5">

                                    <Link href={`/dashboard/tasks`} className={`card w-100 h-100 text-decoration-none `} style={{ cursor: "pointer", }}>
                                        <div className="card-body text-center d-flex-column  flex justify-content-center align-items-center">
                                            <p className="card-title fw-semibold">Task</p>
                                            <p className="fw-semibold">{user?.tasks?.length}</p>
                                        </div>
                                    </Link>
                                    <Link href={`/dashboard/created`} className={`card w-100 h-100 text-decoration-none `} style={{ cursor: "pointer", }}>
                                        <div className="card-body text-center d-flex-column  flex justify-content-center align-items-center">
                                            <p className="card-title fw-semibold">Created</p>
                                            <p className="fw-semibold">{user?.tasksCreated?.length}</p>
                                        </div>
                                    </Link>
                                    <Link href={`/dashboard/overdue`} className={`card w-100 h-100 text-decoration-none `} style={{ cursor: "pointer", }}>
                                        <div className="card-body text-center d-flex-column  flex justify-content-center align-items-center">
                                            <p className="card-title fw-semibold">Over Due</p>
                                            <p className="fw-semibold">{user?.tasks?.filter(task => new Date(task.dueDate) < Date.now()).length}</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>


                    </div>
                </section>

            </ProtectedRoute>
            {/* add new task form modal*/}

            <div className="modal fade" id="addTaskModal" tabIndex="-1" aria-labelledby="addTaskModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addTaskModalLabel">Add Task</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="recipient-name" className="col-form-label">Title:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="recipient-name"
                                        name="title"
                                        value={taskData.title}
                                        onChange={onChangeHandler}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message-text" className="col-form-label">Description:</label>
                                    <textarea
                                        className="form-control"
                                        id="message-text"
                                        name="description"
                                        rows={2}
                                        cols={30}
                                        value={taskDetails.description}
                                        onChange={onChangeHandler}
                                    ></textarea>
                                </div>
                                <div className="d-flex gap-3 mb-3">
                                    <div className="w-100">
                                        <label htmlFor="priority" className="col-form-label">Priority:</label>
                                        <select
                                            className="form-select form-select-sm"
                                            id="priority"
                                            aria-label="Small select example"
                                            name="priority"
                                            onChange={onChangeHandler}
                                        >
                                            <option value={""}>Select Priority</option>
                                            {
                                                priorityList.map(priority => (
                                                    <option
                                                        key={priority.label}

                                                    >
                                                        {priority.label}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="w-100">
                                        <label htmlFor="status" className="col-form-label">Status:</label>
                                        <select
                                            className="form-select form-select-sm"
                                            aria-label="Small select example"
                                            name="status"
                                            onChange={onChangeHandler}
                                        >

                                            <option value={""}>Select Status</option>
                                            {
                                                statusList.map(status => (
                                                    <option
                                                        key={status.label}
                                                        value={status.value}
                                                    >
                                                        {status.label}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="d-flex gap-3 mb-3">
                                    <div className="mb-3 w-100">
                                        <label htmlFor="dueDate" className="col-form-label">Due Date:</label>
                                        <input
                                            type="Date"
                                            className="form-control"
                                            id="dueDate"
                                            name="dueDate"
                                            value={taskData.dueDate}
                                            onChange={onChangeHandler}
                                        />
                                    </div>
                                    <div className="w-100">
                                        <label htmlFor="AssignTo" className="col-form-label">Assign To:</label>
                                        <select
                                            className="form-select form-select-sm"
                                            id="AssignTo"
                                            aria-label="Small select example"
                                            name="assignTo"
                                            onChange={onChangeHandler}
                                        >

                                            <option value={""}>Select Status</option>
                                            {
                                                loading && !error ? (
                                                    <option className="w-100 text-center">Loading...</option>
                                                ) : (<>
                                                    {
                                                        !loading && error ? (<option>{error}</option>)
                                                            : (
                                                                <>
                                                                    {
                                                                        data?.map(user => (
                                                                            <option key={user._id} value={user._id}>{user.name}</option>
                                                                        ))
                                                                    }
                                                                </>
                                                            )
                                                    }
                                                </>)
                                            }
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                ref={closeModalBtn}
                                className="btn btn-sm btn-secondary"
                                data-bs-dismiss="modal"
                                disabled={status === _status ? true : false}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                disabled={status === _status ? true : false}
                                onClick={addNewTaskHandler}
                            >
                                Add Task

                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}