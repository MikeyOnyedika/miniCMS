import { Outlet } from "react-router-dom"
import { useUserContentContext } from "../contexts/UserContentProvider"
import { useEffect } from "react";

export const DashboardIndex = () => {

    const { getCollections, collections } = useUserContentContext();

    useEffect(() => {
        if (collections == null) {
            getCollections();
        }
    }, [collections])


    return (
        <>
            <Outlet />
        </>
    )
}
