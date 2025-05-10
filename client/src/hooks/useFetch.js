"use client"

import axios from "axios";
import { useCallback, useState } from "react"


export default function useFetch() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const BASEURL = process.env.NEXT_PUBLIC_BASEURL

    const fetchData = useCallback(async (params = "") => {
        try {
            setError(null)
            setData(null)
            setLoading(true)
            const resp = await axios.get(BASEURL + `/user/${params}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            })
            // console.log(resp?.data);

            if (resp?.data?.success) {
                setData(resp.data.userList)

            } else {
                setError(resp.data.message || "Unknown error");
            }

        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "An error occurred")
        }
        finally {
            setLoading(false)
        }
    }, [])
    return { loading, error, data, fetchData }
}