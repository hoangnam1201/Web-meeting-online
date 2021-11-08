import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { Route } from 'react-router';
import SigninToContinue from './../../components/SigninToContinute'

const UserAuth = ({ children, ...rest }) => {
    const [cookie] = useCookies(['u_auth']);
    return (
        <Route
            {...rest}
            render={() => (cookie.u_auth ? children : <SigninToContinue />)} />
    )
}

export default UserAuth
