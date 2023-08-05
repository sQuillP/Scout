import { useState } from "react";
import "../styles/TicketComment.css";
import {
    Avatar, Tooltip,

} from '@mui/material';

/**
 * 
 * @param {{
 *  username:string, 
 *  email:string, 
 *  uri:string, 
 *  postedOn:string,
 *  content:string,
 * }: comment} - Relevant comment data this can be modified.
 * @returns 
 */
export default function TicketComment({comment}) {

    const [viewMore, setViewMore] = useState(false);

    //restrict the view length to 200 characters before user wants to see more.
    const initial_view_length = 150;


    return (
        <div className="tc-main">
            <div className="tc-header">
                <Avatar 
                    src={comment.author.profileImage}
                    alt="T"
                    sx={{
                        border: '1px solid lightgray', 
                        marginRight:'10px',
                        height: '30px',
                        width:'30px'
                    }}
                />
                <div className="tc-header-details">
                    <p className="text tc-username">{comment.author.firstName + " "+comment.author.lastName }</p>
                    <p className="text tc-email">{comment.email}</p>
                </div>
            </div>
            <div className="tc-body">
                <p className="text tc-comment">
                    {!viewMore ? comment.content.substring(0,initial_view_length) : comment.content}
                    {
                        !viewMore && comment.content.length >= initial_view_length&& (
                            <Tooltip title='View More'>
                                <span 
                                    className="tc-view-change" 
                                    onClick={()=> setViewMore(true)} 
                                    style={{color:'blue'}}> (...)
                                </span>
                            </Tooltip>
                        )

                    }
                </p>
            </div>
            <div className="tc-footer">
                {
                    viewMore && (
                        <span 
                            style={{color:'blue', cursor:'pointer', fontSize:'0.7rem' }} 
                            onClick={()=> setViewMore(false)}
                        >
                        View less
                        </span>)
                }
                <p className="text tc-posted-on">Posted on: {comment.createdAt}</p>
            </div>
        </div>

    )
}