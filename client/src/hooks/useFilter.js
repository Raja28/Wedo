"use client"

import { setTask, setUserData, setStatus, setError } from "@/features/userSlice";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux";


export default function useFilter() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);
    const BASEURL = process.env.NEXT_PUBLIC_BASEURL
    const dispatch = useDispatch()

    const searchParams = useSearchParams()
    const [currentParams, setCurrentParams] = useState(searchParams.toString());
    // console.log(searchParams);

    const fetchData = useCallback(async (queryParams = {}) => {
        try {
            setError(null)
            setData(null)
            setLoading(true)
            dispatch(setStatus("loading"))

            const resp = await axios.get(BASEURL + `/user/task`, {
                params: queryParams,
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            })
            // console.log(resp?.data);

            if (resp?.data?.success) {
                // setData(resp.data.userList)
                const user = JSON.parse(sessionStorage.getItem("user"))
                user.tasks = resp?.data.tasks
                user.tasksCreated = resp?.data.tasksCreated
                sessionStorage.setItem("user", JSON.stringify(user))
                dispatch(setUserData(user))
                dispatch(setStatus("success"))
            } else {

                setStatus("error")
                setError(resp.data.message || "Unknown error")
            }

        } catch (error) {
            console.log(error);
            dispatch(setStatus("error"))
            dispatch(setError(error.response?.data?.message || "An error occurred"))
        }
        finally {
            setLoading(false)

        }
    }, [])

    useEffect(() => {
        const queryParams = {}
        if (searchParams.size > 0) {
            if (searchParams.get("status")) queryParams.status = searchParams.get("status")
            if (searchParams.get("priority")) queryParams.priority = searchParams.get("priority")
        }
        // console.log("useFilter", queryParams);
        fetchData(queryParams)

    }, [searchParams.toString(), currentParams])

    return { loading, data, fetchData }
}