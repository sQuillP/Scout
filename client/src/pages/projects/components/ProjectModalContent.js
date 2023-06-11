import CloseIcon from '@mui/icons-material/Close';
import { 
    IconButton, 
    Modal, 
    Avatar, 
    Chip,
    Tooltip,

} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import useDebounce from '../../../hooks/useDebounce';
import "../styles/ProjectModalContent.css"
import SearchResult from './SearchResult';
import MembersTable from './MembersTable';


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
    {
        email:'will@gmail.com',
        fullName:'William Pattison',
        id:'abc1223333'
    },
    {
        email:'will@gmail.com',
        fullName:'William Pattison',
        id:'abc12223333'
    },
    {
        email:'will@gmail.com',
        fullName:'William Pattison',
        id:'abc122223333'
    },
    {
        email:'will@gmail.com',
        fullName:'William Pattison',
        id:'abc1222223333'
    },
]


const MAX_CHAR_COUNT = 1500;

export default function ProjectModalContent({onCloseModal}){

    /* State for searching DB using API */
    const [searchUserTerm, setSearchUserTerm] = useState('');
    const debouncedTerm = useDebounce(searchUserTerm,1000);


    /* User data that comes from the api request */
    const [userResults,setUserResults] = useState([]);

    /* Form info to send to API */
    const [projectName,setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');


const [projectMembers, setProjectMembers] = useState([]);

    /* UI stateful logic */
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [errors, setErrors] = useState({});
    const [charCount, setCharCount] = useState(0);

    const searchResultsRef = useRef();

    useEffect(()=> {
        if(!!debouncedTerm.trim())
            setShowSearchResults(true);

        return ()=> null;
    },[debouncedTerm]);


    function handleSearchTerm(event) {
        setSearchUserTerm(event.target.value);

    }

    function handleSearchResultClick(data) {

        const isExistingMember = !!projectMembers.find((member)=> {
            return member.id === data.id
        });

        if(isExistingMember === false)
            setProjectMembers([...projectMembers,data]);


        setShowSearchResults(false);
    }

    function handleSubmit(e) {
        e.preventDefault();
    }


    function handleDescriptionChange(e) {
        if(charCount > MAX_CHAR_COUNT) return;
        setProjectDescription(e.target.value);
        setCharCount(e.target.value.length);
    }

    function handleDismissResults(e) {
        if(!searchResultsRef.current) return;

        if(!searchResultsRef.current.contains(e.target)){
            setShowSearchResults(false);
        }
    }

    /**
     * configure a project with initial payload with users and their permissions on the project
     * */    

    return (
        <form onClick={handleDismissResults} onSubmit={handleSubmit} className='pm-form-section'>
            <Tooltip title='close'>
                <IconButton
                    onClick={onCloseModal}
                    sx={{width:'30px', height:'30px', position:'absolute', right:'5px', top:'5px'}}>
                    <CloseIcon/>
                </IconButton>
            </Tooltip>
            <div className="pm-title">
                <p className="text">Create New Project</p>
            </div>


            <div className="pm-section">
                <div className="pm-field-wrapper">
                    <div className="input-wrapper">
                        <label htmlFor="_pm-title">Project Name <span style={{color:'red'}}>*</span></label>
                        <input 
                            id='_pm-title'
                            type="text" 
                            className='pm-field pm-input'
                            value={projectName}
                            onChange={(e)=> setProjectName(e.target.value)}
                        />
                        <i className="input-icon pm-name-icon fa-solid fa-heading"></i>
                    </div>
                </div>
            </div>


            <div className="pm-section">
                <div className="pm-intro">
                    <p className="text">Add Members to project</p>
                </div>
                <div className="pm-field-wrapper">
                    <div className="input-wrapper">
                        <input 
                            type="text" 
                            className="pm-field user-search" 
                            onChange={handleSearchTerm}
                            value={searchUserTerm}
                        />
                        <i className="input-icon pm-add-user-icon fa-solid fa-user-plus"></i>
                    </div>
                    {showSearchResults && (
                        <div ref={searchResultsRef} className="pm-results">
                            <div className="results-title">
                                <p className="text">33 results found</p>
                            </div>
                            <div className="results-list">
                                {dummy_search_results.map((result)=> {
                                    return (
                                        <div
                                            key={result.id}
                                            onClick={()=> handleSearchResultClick(result)}
                                        >
                                            <SearchResult/>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="pm-section">
                <div className="pm-intro">
                    <p className="text">Members List</p>
                </div>
                {!!projectMembers.length? 
                    <MembersTable data={projectMembers}/> : (
                        <div className="pm-no-members">
                            <p className="text">No Members Added</p>
                        </div>
                )}
            </div>
            <div className="pm-section">
                <div className="pm-intro">
                    <p className="text">Project Description</p>
                </div>
                <div className="pm-field-wrapper textarea-wrapper">
                    <label htmlFor="_pm-textarea">Describe the project in your own words <span style={{color:'red'}}>*</span></label>
                    <textarea 
                            onChange={handleDescriptionChange} 
                            placeholder='Tip: a good description talks about the entirety/purpose of the project' 
                            autoComplete='off' 
                            id='_pm-textarea'
                            className='pm-field'
                        ></textarea>
                    <span className="word-counter">{charCount}/{MAX_CHAR_COUNT}</span>
                </div>
            </div>
            <div className="pm-section pm-create">
                <button className="pm-submit-btn"
                    type='submit'
                >
                    Create project
                    <i 
                        style={{color:'white',marginLeft:'5px', fontSize: '1.1rem'}}
                        className="fa-solid fa-circle-plus"></i>
                </button>
            </div>
        </form>
    );
}