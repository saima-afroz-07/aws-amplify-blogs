import React, { useState } from 'react';
import {InputGroup, FormControl} from 'react-bootstrap';
import {RiUserFill, RiLockPasswordFill} from 'react-icons/ri';
import {Link, useHistory} from 'react-router-dom';
import {Auth} from 'aws-amplify';

import style from './style.module.css';


function Login(props) {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
    const history = useHistory();

    const login = async(event) => {
        event.preventDefault();
        try{
            await Auth.signIn({username: formData.username, password: formData.password});
            history.push("/");
        } catch(err){
            console.log("error => ", err)
        }

    }
    const handleChangeLogin = (event) => {
        setFormData(inputs => ({...inputs, [event.target.name]: event.target.value}))
    }

    

    return (
        <div className={style["login-page"]}>
            <div className={style["container"]}>
                <div className={style["screen"]}>
                    <h3 className={style["form-heading"]}>Login</h3>
                    <form onSubmit={login} className={style["form-css"]}>
                        
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><RiUserFill style={{color: "#f08080"}} /></InputGroup.Text>
                            <FormControl
                            placeholder="Username"
                            aria-describedby="basic-addon1"
                            name="username"
                            value={formData.username}
                            onChange={handleChangeLogin}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon2"><RiLockPasswordFill style={{color: "#f08080"}} /></InputGroup.Text>
                            <FormControl
                            type="password"
                            placeholder="Password"
                            aria-describedby="basic-addon2"
                            name="password"
                            value={formData.password}
                            onChange={handleChangeLogin}
                            />
                        </InputGroup>
                        <div className={style["fp-css"]}>
                            <Link to="/reset-password">Forgot Your Password ?</Link>
                        </div>
                        <button type="submit" className={style["login-btn"]}>Login</button>
                        <div className={style["go-to-signup"]}>Don't Have An Account ? <Link to="/signup"> Create An Account</Link></div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;