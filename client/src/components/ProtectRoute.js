import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import decode from 'jwt-decode'


/**
 * @description - protect a route from being accessed from a non-authenticated user.
 * @returns 
 */
export default function ProtectRoute({children}) {

    const {tokenExp} = useSelector((store)=> store.auth);

    
    //this needs to be run on the initial render since redux does not have a valid token


    //run a validation of the token before redux is able to do anything
    function _validateToken() {
        const fetchedToken = localStorage.getItem('token');
        if(fetchedToken === null) return false;
        try {
            const decodedToken= decode(fetchedToken);
            if(new Date(decodedToken.exp*1000).getTime() < Date.now()){
                localStorage.removeItem('token');
                return false;
            }
            return true;

        } catch(error) {
            return false;
        }
    }


    return (
        //check if token is expired
        (tokenExp !== null && Date.now() < tokenExp) ||  _validateToken() === true? (
            <>
                {children}
            </>
        ) : (
            <Navigate to={'/auth/login'}/>
        )
    )
}