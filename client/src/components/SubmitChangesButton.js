import {
    Publish,

} from '@mui/icons-material';

import {
    CircularProgress
} from '@mui/material';


/**
 * @description Render a button that appears in the bottom right of screen to prompt user to save any changes they 
 * make to an object.
 */
export default function SubmitChangesButton({showButton, disabled, showProgress, onClick}){

    return (
        showButton === true && (
            <div className={`vt-submit-changes-container`}>
                <button
                    className={`vt-submit-changes  ${ disabled ?'vt-submit-disabled':''}`}
                    onClick={onClick}
                    disabled={disabled}
                >
                    Publish Changes
                    <Publish
                        style={{marginLeft:'10px'}}
                    />
                </button>
                {
                    showProgress && (
                        <CircularProgress
                            color="success"
                            size={'1.5rem'}
                            sx={{
                                position:'absolute',
                                top:'-2px',
                                left:'40%',
                                margin:'10px 0 0 10px',
                            }}
                        />
                    )
                }
            </div>
        )
    )
}