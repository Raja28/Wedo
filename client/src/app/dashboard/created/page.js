"use client"
import OpenRoute from "@/components/OpenRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import useFetch from "@/hooks/useFetch";
import useFilter from "@/hooks/useFilter";
import deleteTaskHandler, { updateTasks } from "@/utils/operation";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

export default function TaskCreated() {
    const params = useParams();
    const searchParams = useSearchParams()
    const router = useRouter();
    const dispatch = useDispatch()

    const { user, status, error } = useSelector(state => state?.userSlice)
    const { fetchData } = useFilter()
    const [filterDetails, setFilterDetails] = useState()

    const [edit, setEdit] = useState(false)
    const [taskData, setTaskData] = useState(null)
    const [updateTaskId, setUpdateTaskId] = useState(null)
    const { loading, fetchData: fetchUserList, data, error: fetchUserListError } = useFetch()

    const closeModalBtn = useRef(null);

    useEffect(() => {
        // fetchData()

        let taskIndex;
        taskIndex = user?.tasks?.findIndex(task => task._id === updateTaskId);

        setTaskData(user?.tasks[taskIndex])

        if (status == "success" && user && !!taskIndex) {
            closeModalBtn.current?.click()
        }

        getUserList()

        if (status === "success") {
            // setTaskData(null)

            setEdit(false)
        }

    }, [updateTaskId, status, user])

    function getUserList() {
        fetchUserList("userList")
    }

    function onChangeHandler(e) {
        const { name, value } = e.target
        setTaskData(prev => ({
            ...prev,
            [name]: value
        }))
    }


    function filterHandler(key, value) {

        const newParams = new URLSearchParams(searchParams.toString())
        if (value === "all") {
            newParams.delete(key)
        } else {
            newParams.set(key, value)
            setFilterDetails(prev => ({
                ...prev,
                [key]: value
            }))
        }

        router.push(`?${newParams.toString()}`);

    }

    function clearFilterHandler() {
        const newParams = new URLSearchParams(searchParams.toString())
        // console.log(newParams)
        // newParams.clear()
        router.push(window.location.pathname);
    }

    function updateHandler() {
        updateTasks(taskData, dispatch)
    }

    return (
        <ProtectedRoute>
            <section className="container border">
                <h2 className=" text-center ">Tasks Created</h2>
                <div className="d-flex gap-2 justify-content-end align-items-center ">
                    <p className=" m-0">Filter by:</p>
                    <select className="form-select form-select-sm"
                        onChange={(e) => filterHandler("status", e.target.value)}
                        style={{ width: "5.5rem" }}>
                        <option value={"all"}>Status</option>
                        {
                            statusList.map(status => (
                                <option key={status.label} value={status.value}>{status.label}</option>
                            ))
                        }
                    </select>
                    <select className="form-select form-select-sm"
                        onChange={(e) => filterHandler("priority", e.target.value)}
                        style={{ width: "5.5rem" }}>
                        <option value={"all"}>Priority</option>
                        {
                            priorityList.map(list => (
                                <option key={list.label} value={list.value}>{list.label}</option>
                            ))
                        }
                    </select>
                    <p onClick={clearFilterHandler} className="text-secondary m-0" style={{ cursor: "pointer" }}>Clear</p>
                </div>
            </section>

            <section className="container">
                {
                    status === "loading" && !error ? (
                        <div className="w-100 my-5 text-center">
                            <span className="loader"></span>
                        </div>
                    ) : (<>
                        {
                            status !== _status && user?.tasksCreated?.length == 0 ? (
                                <div className="text-center my-4">
                                    <p>No Task Available</p>
                                </div>
                            ) : (
                                <>
                                    <div className="row">
                                        {
                                            user?.tasksCreated?.map(task => (
                                                <div key={task?._id} className="col-lg-4 col-md-6 my-3 ">
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="card-title fw-semibold d-flex justify-content-between align-items-center">
                                                                <p className="m-0">{task.title}</p>
                                                                <p className="text-secondary m-0" style={{ fontSize: "12px" }}>{task.status}</p>
                                                            </div>
                                                            <div className="m-0" style={{ fontSize: "13px" }}>{task.description}</div>
                                                            <div className="d-flex justify-content-between align-items-center gap-3">

                                                                <div className="" style={{ fontSize: "13px" }}>
                                                                    <strong>Assigned To: </strong>
                                                                    {task.assignedTo.name}
                                                                </div>
                                                                <div className="d-flex justify-content-end align-items-center gap-3">
                                                                    <button className="btn btn-danger btn-sm m-0"
                                                                        onClick={(e) => deleteTaskHandler(task?._id, dispatch)}
                                                                        disabled={status === _status ? true : false}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                    <button className="btn btn-primary btn-sm m-0"
                                                                        disabled={status === _status ? true : false}
                                                                        data-bs-toggle="modal" data-bs-target="#addTaskModal" data-bs-whatever="@mdo"
                                                                        onClick={() => setUpdateTaskId(task?._id)}
                                                                    >
                                                                        Details
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </>
                            )
                        }
                    </>)
                }
            </section>

            {/* update task form modal*/}

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
                                        disabled={!edit || status === _status ? true : false}
                                        value={taskData?.title}
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
                                        disabled={!edit || status === _status ? true : false}
                                        value={taskData?.description}
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
                                            disabled={!edit || status === _status ? true : false}
                                            onChange={onChangeHandler}
                                        >
                                            <option value={taskData?.priority}>{taskData?.priority}</option>
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
                                            disabled={!edit || status === _status ? true : false}
                                            onChange={onChangeHandler}
                                        >

                                            <option value={taskData?.status}>{taskData?.status}</option>
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
                                            disabled={!edit || status === _status ? true : false}
                                            value={taskData?.dueDate && (taskData?.dueDate).replaceAll("/", "-").split("T")[0]}
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
                                            disabled={!edit || status === _status ? true : false}
                                            onChange={onChangeHandler}
                                        >

                                            <option value={taskData?.assignedTo._id}>{taskData?.assignedTo.name}</option>
                                            {
                                                loading && !fetchUserListError ? (
                                                    <option className="w-100 text-center">Loading...</option>
                                                ) : (<>
                                                    {
                                                        !loading && fetchUserListError ? (<option>{fetchUserListError}</option>)
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
                            {!edit ? (<>
                                <button className="btn btn-primary btn-sm "
                                    onClick={() => setEdit(true)}
                                >
                                    Edit
                                </button>
                            </>) :
                                (
                                    <>
                                        <button
                                            type="button"
                                            ref={closeModalBtn}
                                            className="btn btn-sm btn-secondary"
                                            data-bs-dismiss="modal"
                                            onClick={() => setEdit(false)}
                                            disabled={status === _status ? true : false}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            disabled={status === _status ? true : false}
                                            onClick={updateHandler}
                                        >
                                            Save
                                        </button>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}