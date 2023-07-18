import { useEffect } from "react";
import HorizontalNavigation from "../../components/HorizontalNavigation";
import VerticalNavigation from "./components/VerticalNavigation";
import { Outlet, useParams } from "react-router-dom";



export default function Project() {

    const {projectId} = useParams();

    useEffect(()=> {
        //when projectid changes, fetch a new project instance
    },[projectId])

    return (
        <>
            <HorizontalNavigation/>
            <VerticalNavigation/>
            <Outlet/>
        </>
    )

}