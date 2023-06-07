import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Modal, Avatar } from '@mui/material';
import { useState } from 'react';
import useDebounce from '../../../hooks/useDebounce';

import "../styles/ProjectModalContent.css"
import SearchResult from './SearchResult';




export default function ProjectModalContent(){


    const [searchUserTerm, setSearchUserTerm] = useState('');
    const debouncedTerm = useDebounce(searchUserTerm,1000);
    const [userResults,setUserResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(true);
    const [errors, setErrors] = useState({});

    function handleSearchTerm(event) {
        setSearchUserTerm(event.target.value);
    }

    function handleSubmit(data) {
        //handle submission data
    }

    function handleResultClick() {
        

        setShowSearchResults(false);
    }

    

    return (
            <div className="pm-form-section">
                <IconButton sx={{width:'30px', height:'30px', position:'absolute',right:'5px',top:'5px'}}>
                    <CloseIcon/>
                </IconButton>
                <div className="pm-title">
                    <p className="text">Create New Project</p>
                </div>
                <div className="pm-content">
                    <div className="pm-field">
                        <label htmlFor="pm-title">Project Name</label>
                        <div className="icon-wrapper">
                            <input 
                                className='pm-field pm-input'
                                type="text" 
                            />
                            <i class="input-icon fa-solid fa-heading"></i>
                        </div>
                    </div>
                </div>
                <div className="pm-content">
                    <div className="pm-add-member">
                        <p className="text">Add Members to project</p>
                    </div>
                    <div className="pm-field">
                        <div className="icon-wrapper">
                            <input type="text" className='pm-field user-search' onChange={handleSearchTerm}/>
                            <i class="input-icon fa-solid fa-user-plus"></i>
                        </div>
                        <div className="results-field">
                            <SearchResult onClick={()=> setShowSearchResults(false) }/>
                            <SearchResult onClick={()=> setShowSearchResults(false) }/>
                            <SearchResult onClick={()=> setShowSearchResults(false) }/>
                            <SearchResult onClick={()=> setShowSearchResults(false) }/>
                        </div>
                    </div>
                </div>
            </div>
    )
}