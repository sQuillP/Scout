import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Modal, Avatar, Chip } from '@mui/material';
import { useState } from 'react';
import useDebounce from '../../../hooks/useDebounce';
import "../styles/ProjectModalContent.css"
import SearchResult from './SearchResult';


const dummy_search_results = [
    {
        email:'will@gmail.com',
        fullName:'William Pattison',
        id:'abc123'
    },
    {
        email:'will@gmail.com',
        fullName:'William Pattison',
        id:'abc1233'
    },
    {
        email:'will@gmail.com',
        fullName:'William Pattison',
        id:'abc12333'
    },
    {
        email:'will@gmail.com',
        fullName:'William Pattison',
        id:'abc123333'
    },
]



export default function ProjectModalContent(){

    /* State for searching DB using API */
    const [searchUserTerm, setSearchUserTerm] = useState('');
    const debouncedTerm = useDebounce(searchUserTerm,1000);


    /* User data that comes from the api request */
    const [userResults,setUserResults] = useState([]);

    /* Form info to send to API */
    const [projectName,setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    /* UI stateful logic */
    const [showSearchResults, setShowSearchResults] = useState(false);
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


    function handleSubmit(e) {
        e.preventDefault();
        //make api request to create the project
    }

    /**
     * configure a project with initial payload with users and their permissions on the project
     * */    

    return (
            <form onSubmit={handleSubmit} className="pm-form-section">
                <IconButton sx={{width:'30px', height:'30px', position:'absolute',right:'5px',top:'5px'}}>
                    <CloseIcon/>
                </IconButton>
                <div className="pm-title">
                    <p className="text">Create New Project</p>
                </div>
                <div className="pm-content">
                    <div className="pm-field">
                        <label htmlFor="pm-title">Project Name <span style={{color:'red'}}>*</span></label>
                        <div className="icon-wrapper">
                            <input 
                                className='pm-field pm-input'
                                type="text" 
                                value={projectName}
                                onChange={(e)=> setProjectName(e.target.value)}
                            />
                            <i className="input-icon fa-solid fa-heading"></i>
                        </div>
                    </div>
                </div>
                <div className="pm-content">
                    <div className="pm-intro">
                        <p className="text">Members List</p>
                    </div>
                </div>
                <div className="pm-content">
                    <div className="pm-intro">
                        <p className="text">Add Members to project</p>
                    </div>
                    <div className="pm-field">
                        <div className="icon-wrapper">
                            <input type="text" className='pm-field user-search' onChange={handleSearchTerm}/>
                            <i className="input-icon fa-solid fa-user-plus"></i>
                        </div>
                        <div className="results-field">
                            {showSearchResults && dummy_search_results.map((result)=> {
                                return (
                                    <SearchResult 
                                        key={result.id} 
                                        onClick={()=> setShowSearchResults(false) }
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="pm-content">

                </div>
            </form>
    )
}