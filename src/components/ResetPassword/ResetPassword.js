import React, { useState } from 'react';
import {InputGroup, FormControl} from 'react-bootstrap';
import {RiUserFill, RiLockPasswordFill} from 'react-icons/ri';
import {BsFillShieldLockFill} from 'react-icons/bs';
import {Link, useHistory} from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { ToastContainer, toast } from 'react-toastify';

import style from './style.module.css';




function ResetPassword(props) {
    const history = useHistory();
    const [formData, setFormData] = useState({
        username: "",
        verificationCode: "",
        newPassword: ""
    });

    const resetPassword = async(event) => {
        event.preventDefault();
        try{
            await Auth.forgotPasswordSubmit(formData.username, formData.verificationCode, formData.newPassword);
            history.push("/login")
        } catch(err){
            console.log(err)
        }
        
    }

    const handleChangeReset = (event) => {
        setFormData(inputs => ({...inputs, [event.target.name]: event.target.value}))
    }

    const sendCode = async(event) => {
        event.preventDefault();
        try{
            await Auth.forgotPassword(formData.username);
        } catch(err) {
            console.log(err)
        }
    }


    return (
        <div className={style["signup-page"]}>
            <div className={style["container"]}>
                <div className={style["screen"]}>
                    <h3 className={style["form-heading"]}>Reset Password</h3>
                    <form onSubmit={resetPassword} className={style["form-css"]}>
                        
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><RiUserFill style={{color: "#f08080"}} /></InputGroup.Text>
                            <FormControl
                            placeholder="Username"
                            aria-describedby="basic-addon1"
                            name="username"
                            value={formData.username}
                            onChange={handleChangeReset}
                            required
                            />
                        </InputGroup>

                        <button type="button" className={style["send-code-btn"]} onClick={sendCode} >Send Code</button>

                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon2"><BsFillShieldLockFill style={{color: "#f08080"}} /></InputGroup.Text>
                            <FormControl
                            placeholder="verification Code"
                            aria-describedby="basic-addon2"
                            name="verificationCode"
                            value={formData.verificationCode}
                            onChange={handleChangeReset}
                            required
                            />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon3"><RiLockPasswordFill style={{color: "#f08080"}} /></InputGroup.Text>
                            <FormControl
                            type="password"
                            placeholder="New Password"
                            aria-describedby="basic-addon3"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChangeReset}
                            required
                            />
                        </InputGroup>
                        
                        <button type="submit" className={style["signup-btn"]}>Change Password</button>
                        <div className={style["go-to-login"]}>Already Have An Account ? <Link to="/login"> Log In</Link></div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;