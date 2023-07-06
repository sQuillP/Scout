import { useState } from "react";
import {
    Button, 
    Stack,
    Tooltip,
    IconButton,
} from '@mui/material';

import {
    Clear,
    SendSharp,


} from '@mui/icons-material'

import "../styles/NewComment.css";


/**
 * @summary - Stores comment state so that parent component does not refresh.
 * 
 * @param {function} onCreateNewComment - Sends comment information to parent component
 * @param {function} onDiscard - Sends boolean value to parent to cancel the comment creation.
 */
export default function NewComment({onCreateNewComment, onDiscard}) {

    const [comment, setComment] = useState('');
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    function onSubmitComment() {
        onCreateNewComment(comment);
        onDiscard();
    }

    return (
        <div className="nc-container">
            <div className="nc-header">
                <Stack 
                    direction={'row'} 
                    gap={1} 
                    justifyContent={'space-between'}
                    alignItems={'center'}
                >
                    <p className="text nc-header-text">New Comment</p>
                    <Tooltip title='Delete comment'>
                        <IconButton 
                            size="small"
                            onClick={onDiscard}
                        >
                            <Clear/>
                        </IconButton>
                    </Tooltip>

                </Stack>
            </div>
            <textarea
                value={comment}
                onChange={(e)=> setComment(e.target.value)}
                className="nc-comment-textarea"
            >
            </textarea>
            <Tooltip
                title="Add comment"
            >
                <IconButton
                    onClick={onSubmitComment}
                    size="small"
                    sx={{
                        position:'absolute',
                        right:'10px',
                        bottom:'10px',
                        transition:'100ms linear transform',
                        "&:hover": {
                            transform:'rotate(-10deg)',
                        }

                    }}
                >
                    <SendSharp
                        color="lightgray"
                    />
                </IconButton>
            </Tooltip>
        </div>
    )
}