import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Badge from './Badge'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Popover } from '@mui/material';
import AlertItem from '../pages/projects/components/AlertItem';
import { logout } from '../redux/slice/authSlice';

import "./styles/HorizontalNavigation.css";

const dummy_data = [
    {
        type: "comment",
        message:"Hey you should come check this out. It looks really cool",
        title:"Jenna commented on your ticket",
        priority:'low',
        link:"",//link to the comment
        isRead: false,
        id:'223'
    },
    {
        type: "comment",
        message:"Hey you should come check this out. It looks really cool",
        title:"Jenna commented on your ticket",
        priority:'low',
        link:"",//link to the comment
        isRead: false,
        id:'123'
    },
    {
        type:"monitor",
        title:"Error in Ezer Application",
        message:"Uncaught ReferenceError: 'user' is not defined at <anonymous>:1:1",
        priority:'high',
        link:"",
        isRead: false,
        id:'456'
    },
    {
        type:"ticket",
        title:'Ticket 2939823 has been assigned to you',
        message:'unable to fix parsing bug',
        priority:'medium',
        isRead: false,
        id:'789'
    }
];


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

    function onLogoutUser() {
        dispatch(logout());
        handleCloseUserMenu();
        navigate('/auth/login');
    }




    return (
        <div className="horizontal-main">
            <div className="horizontal-nav-item">
                <img src="https://style.helpscout.com/images/logo/help-scout-logo-square-blue.svg" alt="" className="logo" />
                <p className="text app-title">Scout!</p>
            </div>
            <ul className="horizontal-nav-content">
                <li className="horizontal-nav-item">
                    <div className='icon-container'>
                        <Badge count={notifications.length}/>
                        <i onClick={onOpenPopoverMenu} className="horizontal-icon fa-solid fa-bell"></i>
                        <Popover
                            anchorEl={popoverEl}
                            open={openNotification}
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
                            {dummy_data.map((notification) => {
                                return (
                                    <AlertItem 
                                        data={notification} 
                                        key={notification.id}
                                        onClose={onDismissNotification}
                                    />
                                );
                            }).slice(0,5)}
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
                                {
                                    !!user.profileImage ? <img className='horizontal-user-profile' src={user.profileImage}/> : (
                                        <Avatar>{user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()}</Avatar>
                                    )
                                }
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