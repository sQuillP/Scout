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

    const debug_img_src 
    = 'https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg';

    const dummyComment = {
        username:'william Pattison',
        email: 'will.m.pattison@gmail.com',
        postedOn:'02/26/1999',
        content:'Ex anim sint culpa et Lorem. Id cillum cillum sint aliqua excepteur ullamco fugiat ut eiusmod cupidatat ullamco nostrud. Lorem sunt duis voluptate consectetur quis cillum ullamco velit ad. Aliqua consequat exercitation do sit consectetur qui incididunt quis occaecat consectetur dolore laboris. Veniam labore cupidatat irure dolore. Labore nulla in elit laboris amet labore non. Laborum do non dolor Lorem ut excepteur anim aliqua aute.'
    }

    return (
        <div className="tc-main">
            <div className="tc-header">
                <Avatar 
                    src={debug_img_src}
                    alt="T"
                    sx={{
                        border: '1px solid lightgray', 
                        marginRight:'10px',
                        height: '30px',
                        width:'30px'
                    }}
                />
                <div className="tc-header-details">
                    <p className="text tc-username">{dummyComment.username}</p>
                    <p className="text tc-email">{dummyComment.email}</p>
                </div>
            </div>
            <div className="tc-body">
                <p className="text tc-comment">
                    {!viewMore ? dummyComment.content.substring(0,initial_view_length) : dummyComment.content}
                    {
                        !viewMore && dummyComment.content.length >= initial_view_length&& (
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
                <p className="text tc-posted-on">Posted on: {dummyComment.postedOn}</p>
            </div>
        </div>

    )
}