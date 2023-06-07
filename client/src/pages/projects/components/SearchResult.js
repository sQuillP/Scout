import { Avatar } from "@mui/material"

import "../styles/SearchResult.css";



export default function SearchResult({data}){


    return (
        // <>
            <div className="sr-container">
                <Avatar>A</Avatar>
                <div className="user-info">
                    <p className="text sr-fullname">Allan Smith</p>
                    <p className="text sm light">allansmith@gmail.com</p>
                </div>
            </div>
        // </>
    );
}