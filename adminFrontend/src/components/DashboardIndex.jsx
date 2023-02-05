import { Outlet } from "react-router-dom"
import { useUserContentContext } from "../contexts/UserContentProvider"
import { useEffect } from "react";

export const DashboardIndex = () => {

    const { getCollections } = useUserContentContext();

    useEffect(() => {
        console.log("started trying to fetch collections")
        getCollections();
    }, [])


    return (
        <>
            <Outlet />
        </>
    )
}
