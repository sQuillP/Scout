import { Avatar } from "@mui/material"

import "../styles/SearchResult.css";



export default function SearchResult({user}){


    return (
        // <>
            <div className="sr-container">
                <Avatar>{user.firstName[0]  + user.lastName[0]}</Avatar>
                <div className="user-info">
                    <p className="text sr-fullname">{user.firstName + " " + user.lastName}</p>
                    <p className="text sm light">{user.email}</p>
                </div>
            </div>
        // </>
    );
}