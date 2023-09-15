import { 
    Paper,
    Stack,
    Autocomplete,
    TextField,
    Typography,
    FormControlLabel,
    FormControl,
    FormLabel,
    Button,
    IconButton,
    Tooltip
} from "@mui/material";
import { useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment'
import { useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { Close } from "@mui/icons-material";
import moment from "moment";


/**
 * @description - ge
 * @param {function} getFilterData - callback to send the form data to the parent when ready 
 * @returns 
 */
export default function CommentFilters({getFilterData, onCollapse,}){


    const project = useSelector((store)=> store.project.currentProject);


    const originalFields = {
        startDate: null,
        endDate: null, 
        user: null,
    }


    const [filterError, setFilterError] = useState("");


    const [filterData, setFilterData] = useState(originalFields);


    function handleFilterChange(filter, data) {

        console.log(filter,data);
        const updatedData = {...filterData,[filter]:data};
        setFilterData(updatedData);
    }

    function onSubmitQuery() {
        console.log('submitting')
        if(filterData.startDate !== null && filterData.endDate !== null) {
            if(filterData.startDate.isAfter(filterData.endDate)){
                console.log('Not going to submit');
                setFilterError("Error: Start date must be less than end date.");
                return;
            }
        }
        getFilterData(filterData);
        onCollapse();
    }


    function onClearFields() {
        setFilterData(originalFields);
        setFilterError("")
        getFilterData({...originalFields})
    }


    return (
        <Paper elevation={0} sx={{padding:'20px', position:'relative'}}>
            <Tooltip 
                sx={{position:'absolute', right: 0, top:'10px'}}
                title="Close Filters">
                <IconButton size="small" onClick={onCollapse}>
                    <Close/>
                </IconButton>
            </Tooltip>
            <Typography marginBottom={'20px'} fontSize={'1.2rem'} variant="body2">Filter Comments</Typography>
            <Stack direction='column' gap={2}  flexWrap={'wrap'}>

                    <Autocomplete
                        options={project.members}

                        getOptionLabel={option => option.firstName + " " + option.lastName}
                        renderInput={(props) => <TextField {...props} label='Filter by User' />}
                        onChange={(e, newVal)=> handleFilterChange('user',newVal)}
                        value={filterData.user}
                        size="small"
                    />
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <Stack 
                            direction={'row'} 
                            justifyContent={'flex-start'} 
                            alignItems={'center'}
                            flexWrap={'wrap'}
                            gap={1}
                        >
                        <DatePicker
                            label='Start Date'
                            slotProps={{textField:{size:'small', sx:{width:'210px'}}}}
                            value={filterData['startDate']}
                            onChange={(newVal)=> handleFilterChange('startDate', newVal)}
                        />
                        <FormLabel>To</FormLabel>
                        <DatePicker
                            label="End Date"
                            slotProps={{textField:{size:'small', sx:{width:'210px'}}}}
                            value={filterData['endDate']}
                            onChange={(newVal)=> handleFilterChange('endDate', newVal)}
                        />
                        </Stack>
                    </LocalizationProvider>
                   { !!filterError && <Typography fontSize={'1.0rem'} textAlign={'center'} sx={{color:'salmon'}} margin={0} variant="body2">{filterError}</Typography>}
                    <Stack 
                        gap={1} 
                        direction={'row'} 
                        flexWrap={'wrap'}
                        justifyContent={'flex-end'}
                        marginTop={'15px 0'}
                    >
                        <Button
                            variant='contained'
                            sx={{textTransform:'none'}}
                            size="small"
                            color="error"
                            onClick={onClearFields}
                        >
                            Clear Fields
                        </Button>
                        <Button
                            size="small"
                            variant="contained"
                            sx={{textTransform:'none'}}
                            onClick={onSubmitQuery}
                        >
                            Apply Filters
                        </Button>

                    </Stack>
            </Stack>
        </Paper>
    );
}