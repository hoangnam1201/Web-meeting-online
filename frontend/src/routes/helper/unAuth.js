import React from 'react'
import { useCookies } from 'react-cookie'
import { Route } from 'react-router';
import { Redirect } from 'react-router-dom';

const UserAuth = ({ children, ...rest }) => {
    const [cookie] = useCookies(['u_auth']);

    return (
        <Route {...rest} render={() => !cookie.u_auth ? children : <Redirect to='/user/my-event' />} />
    )
}

export default UserAuth
