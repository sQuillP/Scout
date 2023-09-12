import { useState, useRef, useEffect } from "react";
import "../styles/ProfileField.css";
import {
    Stack,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';

import {
    Close,
    Edit,

} from '@mui/icons-material';


export default function ProfileField({
    style,
    label,
    fieldLabel,
    formik,
    initialToggle
}) {

    const inputRef = useRef();
    const [edit, setEdit] = useState(false);
    const { handleChange, handleBlur, values, errors, touched} = formik;

    useEffect(()=> {
        setEdit(false);
    },[initialToggle]);

    useEffect(()=> {
        if(edit === true) {
            inputRef.current.focus();
        }
    },[edit])



    function onCancelEdit() {
        setEdit(false);
    }

    function onEnableEdit() {
        setEdit(true);
    }

    function formatValue(val) {
        if(fieldLabel === 'password' && val.length > 85) return '●'.repeat(85);
        if(fieldLabel === 'password') return '●'.repeat(val.length);
        if(val.length >85) return val.substring(0,85) + "...";

        return val;
    }
//●
    return (
        <div style={{...style}} className="vp-pf-container">
                <label htmlFor={fieldLabel}>{label}</label>
                {
                    edit === true ? (
                        <Stack gap={2} alignItems={'center'}  direction={'row'}>
                            <Stack width={'100%'} gap={0} direction={'column'}>
                               {fieldLabel ==='password' && <label htmlFor={fieldLabel}>Enter Password </label>}
                                <input 
                                    ref={inputRef}
                                    id={fieldLabel} 
                                    onChange={handleChange} 
                                    type={fieldLabel === 'password' ? 'password':'text'} 
                                    onBlur={handleBlur}
                                    value={fieldLabel === 'password'? values['password']: values[fieldLabel]}
                                    className="vp-pf-input"
                                />
                                {/* {
                                    fieldLabel==='password' && (
                                        <>
                                            <label htmlFor="_newpassword">New password</label>
                                            <input
                                                type="password"
                                                onChange={handleChange}
                                                id={'_newpassword'}
                                                onBlur={handleBlur}
                                                className="vp-pf-input"
                                                value={values['newPassword']}
                                            />
                                        </>
                                    )
                                } */}
                            </Stack>

                            <Tooltip title='Cancel Edit'>
                                <IconButton size="small" onClick={onCancelEdit}>
                                    <Close color="gray"/>
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        ):(
                            <Stack gap={1}  direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                                <Typography variant="body2">{formatValue(values[fieldLabel])}</Typography>
                                <Tooltip title='Edit Field'>
                                    <IconButton size="small" onClick={onEnableEdit}>
                                        <Edit color="gray"/>
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        )
                }
        </div>
    );
}