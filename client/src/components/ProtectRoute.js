import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import decode from 'jwt-decode'
import { useMemo } from "react";

export default function ProtectRoute({children}) {

    const { authToken, loading} = useSelector((store)=> store.auth);

    console.log('protect route ',authToken)
    
    //this needs to be run on the initial render since redux does not have a valid token
    const validToken = useMemo(()=> _validateToken(),[]);


    function _validateToken() {
        console.log('valid token called')
        const fetchedToken = localStorage.getItem('token');
        if(fetchedToken === null) return false;
        const decodedToken= decode(fetchedToken);
        if(new Date(decodedToken.exp).getTime() < Date.now())
            return false;
        
        return true;
    }


    return (
        authToken !== null || validToken !== false? (
            <>
                {children}
            </>
        ) : (
            <Navigate to={'/auth/login'}/>
        )
    )
}