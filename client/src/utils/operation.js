import axios from "axios";

import toast from "react-hot-toast";
import { deleteTask, updateTaskDetails } from "@/features/userSlice";


export default async function deleteTaskHandler(taskId, dispatch) {
    try {
        const resp = await dispatch(deleteTask({ taskId })).unwrap()
        if (resp?.success) {
            const user = JSON.parse(sessionStorage.getItem("user"))
            user.tasks = resp?.tasks?.length > 0 ? resp?.tasks : []
            user.tasksCreated = resp?.tasksCreated?.length > 0 ? resp?.tasksCreated : []
            sessionStorage.setItem("user", JSON.stringify(user))
            toast.success("Task deleted")
        }

    } catch (error) {
        console.log(error)
        const message = error || "Failed delete task";
        toast.error(message);
    }
}

export const updateTasks = async (data, dispatch) => {
    try {

        const resp = await dispatch(updateTaskDetails(data)).unwrap()

        if (resp?.success) {
            const user = JSON.parse(sessionStorage.getItem("user"))
            user.tasks = resp?.tasks?.length > 0 ? resp?.tasks : []
            user.tasksCreated = resp?.tasksCreated?.length > 0 ? resp?.tasksCreated : []
            sessionStorage.setItem("user", JSON.stringify(user))
            toast.success("Task updated")
        }
    } catch (error) {
        console.log("update task", error);

        const message = error || "Failed update task";
        toast.error(message);
    }
}