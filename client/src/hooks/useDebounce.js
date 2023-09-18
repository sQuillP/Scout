import { useEffect } from "react";
import { useState } from "react";




export default function useDebounce(term,delay) {

    const [debouncedTerm, setDebouncedTerm] = useState('');

    useEffect(()=> {
        const timer = setTimeout(()=> {
            setDebouncedTerm(term);
        },delay);
        return ()=> clearTimeout(timer);
    },[term]);


    return debouncedTerm;
}