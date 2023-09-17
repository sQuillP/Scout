import { useEffect } from "react";
import HorizontalNavigation from "../../components/HorizontalNavigation";
import VerticalNavigation from "./components/VerticalNavigation";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProjectById } from "../../redux/thunk/project";
import LoadingProject from "./components/LoadingProject";
import { socket } from "../../sockets/socketIO";
import { pushNotification } from "../../redux/slice/projectSlice";
import Scout from "../../axios/scout";
export default function Project() {

    const {projectId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {loadingCurrentProject, loadCurrentProjectFailure, currentProject} = useSelector((store)=> store.project);
    const user = useSelector((store)=> store.auth.user);
    
   

    //get new project whenever the params change.
    useEffect(()=> {
        dispatch(getProjectById(projectId));

        function onReceiveNotification(data) {
            console.log('received notification', data);
            dispatch(pushNotification(data));
        }
        if(!projectId) return;
        if(user !== null) {socket.emit('join-room',user._id);}
        socket.emit('join-room',projectId)
        socket.on('receiveNotification',onReceiveNotification);
        return ()=> {
            socket.off('receiveNotification', onReceiveNotification);
        }
    },[projectId, user]);


    useEffect(()=> {
        if(loadCurrentProjectFailure === true){
            navigate('/auth/login');
        }
    },[loadCurrentProjectFailure]);


    async function fetchProjectInformation() {
        try {
            // await Scout.get()
        } catch(error) {
            console.log('unable to fetch project notifications');
        }
    }

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