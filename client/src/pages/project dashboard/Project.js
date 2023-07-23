import { useEffect } from "react";
import HorizontalNavigation from "../../components/HorizontalNavigation";
import VerticalNavigation from "./components/VerticalNavigation";
import { Outlet, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProjectById } from "../../redux/thunk/project";
export default function Project() {

    const {projectId} = useParams();
    const dispatch = useDispatch();

    //get new project whenever the params change.
    useEffect(()=> {
        dispatch(getProjectById(projectId));
    },[projectId])

    return (
        <>
            <HorizontalNavigation/>
            <VerticalNavigation/>
            <Outlet/>
        </>
    )

}