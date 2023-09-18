import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Badge from './Badge'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Popover } from '@mui/material';
import AlertItem from '../pages/projects/components/AlertItem';
import { logout } from '../redux/slice/authSlice';
import "./styles/HorizontalNavigation.css";
import Scout from '../axios/scout';
import { setNotifications } from '../redux/slice/projectSlice';


export default function HorizontalNavigation() {


    //Have a firebase notification listener on the notifications
    //each notification will have a link to which the notification will take the user to.

    //selector 
    const [anchorEl, updateAnchorEl] = useState(null); 
    const [popoverEl, updatePopoverEl] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((store)=> store.auth.user);
    const notifications = useSelector((store)=> store.project.notifications);
    const currentProject = useSelector((store)=> store.project.currentProject);


    const open = Boolean(anchorEl);
    const openNotification = Boolean(popoverEl);

    function onOpenUserMenu(e) {
        updateAnchorEl(e.currentTarget);
    }


    function onOpenPopoverMenu(e) {
        //make firebase api call to show that the notification has been read
        updatePopoverEl(e.currentTarget);
    }

    function handleCloseNotificationMenu(){
        updatePopoverEl(null);
    }


    function handleCloseUserMenu() {
        updateAnchorEl(null);
    }

    function onDismissNotification() {

         
    }


    /**
     * 
     * @description - perform optimistic delete on the notification in case the 
     * request fails or stalls.
     * @returns 
     */
    async function onDeleteNotification(notificationId) {

        if(!notificationId){
            handleCloseNotificationMenu();
            return;
        }

        if(currentProject === null) return;
        const notificationsCopy = [...notifications];
        const removeIdx = notificationsCopy.findIndex((notif)=> notif._id === notificationId);
        notificationsCopy.splice(removeIdx,1);
        dispatch(setNotifications(notificationsCopy));
        try {
            const response = await Scout.delete('/notifications/'+currentProject._id,{
                data: {notification: notificationId}
            });
            //set the actual notifications from the server
            dispatch(setNotifications(response.data.data));
        } catch(error) {
            console.log(error, error.message);
        } finally {
            handleCloseNotificationMenu();
        }
    }


    function onLogoutUser() {
        dispatch(logout());
        handleCloseUserMenu();
        navigate('/auth/login');
    }



    return (
        <div className="horizontal-main">
            <div className="horizontal-nav-item">
                {/* <img src="https://style.helpscout.com/images/logo/help-scout-logo-square-blue.svg" alt="" className="logo" /> */}
                <p className="text app-title">Scout!</p>
            </div>
            <ul className="horizontal-nav-content">
                <li className="horizontal-nav-item">
                    <div className='icon-container'>
                        {notifications.length !== 0 && <Badge count={notifications.length}/>}
                        <i onClick={onOpenPopoverMenu} className="horizontal-icon fa-solid fa-bell"></i>
                        <Popover
                            anchorEl={popoverEl}
                            open={openNotification && notifications.length !== 0}
                            onClose={handleCloseNotificationMenu}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <div className="alert-container">
                                {notifications?.slice(0,5).map((notification) => {
                                    return (
                                        <AlertItem 
                                            data={notification} 
                                            key={notification._id}
                                            onClose={(id)=> onDeleteNotification(id)}
                                        />
                                    );
                                })}
                            </div>
                        </Popover>
                    </div>
                </li>
                {
                    user !== null && (
                        <>
                            <li className="horizontal-nav-item">
                            <Link className='horizontal-nav-profile-link'>
                                <p className="text nav-user-text">{user.firstName + " " +user.lastName}</p>
                                {/* { */}
                                    {/* !!user.profileImage ? <img className='horizontal-user-profile' src={user.profileImage}/> : ( */}
                                        <Avatar>{user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()}</Avatar>
                                    {/* ) */}
                                {/* } */}
                            </Link>
                            <i onClick={onOpenUserMenu} className="nav-down-icon fa-solid fa-sort-down"></i>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={onLogoutUser}>Logout</MenuItem>
                                <MenuItem onClick={()=> navigate('/profile-details')}>Profile Details</MenuItem>
                            </Menu>
                            </li>
                        </>
                    )
               
                }
            </ul>
        </div>
    )
}