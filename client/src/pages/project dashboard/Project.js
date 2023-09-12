import { useEffect } from "react";
import HorizontalNavigation from "../../components/HorizontalNavigation";
import VerticalNavigation from "./components/VerticalNavigation";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProjectById } from "../../redux/thunk/project";
import LoadingProject from "./components/LoadingProject";




export default function Project() {

    const {projectId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {loadingCurrentProject, loadCurrentProjectFailure, currentProject} = useSelector((store)=> store.project);

    //get new project whenever the params change.
    useEffect(()=> {
        dispatch(getProjectById(projectId));
        
    },[projectId]);

    useEffect(()=> {

        if(loadCurrentProjectFailure === true){
            console.log('navigating');
            navigate('/auth/login');
        }

    },[loadCurrentProjectFailure]);

    //improve outlet because of page flickering.
    return (
        <>
            <HorizontalNavigation/>
            <VerticalNavigation/>
            {
                ((loadingCurrentProject || currentProject===null))? (<LoadingProject/>):(<Outlet/>)
            }
        </>
    )

}