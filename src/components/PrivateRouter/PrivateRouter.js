import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import {useHistory} from 'react-router-dom'

//this to make route a private route. 
function PrivateRouter({component: Component, ...rest}) {
    const history = useHistory();
    const [tempUser, setTempUser] = useState({});

    Auth.currentUserInfo().then(res => {
        setTempUser(res.username);
        console.log(res);
      }).catch(err => {
        console.log("error => ",err);
        history.push("/login");
      })
    
    return (
        <Route
            {...rest}
            render={props => {
               return tempUser ? <Component {...props}/> : <Redirect to="/login"/>
            }}
        ></Route>
    );
}

export default PrivateRouter;