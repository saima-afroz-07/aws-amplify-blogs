import React, { useState } from 'react';
import {InputGroup, FormControl} from 'react-bootstrap';
import {RiUserFill} from 'react-icons/ri';
import {BsFillShieldLockFill} from 'react-icons/bs';
import {Link, useHistory} from 'react-router-dom';
import { Auth } from 'aws-amplify';

import style from './style.module.css';




function ConfirmSignup(props) {
    const [formData, setFormData] = useState({
        username: "",
        code: "",
    });
    const history = useHistory();

    const ConfirmSignup = async(event) => {
        console.log(formData)
        event.preventDefault();
        try {
            await Auth.confirmSignUp(formData.username, formData.code)
            history.push("/");
        } catch(err) {
            console.log("error => ", err)
        }
    }

    const handleChangeSignup = (event) => {
        setFormData(input => ({...input, [event.target.name]: event.target.value}))
    }

    const resendCode = async() => {
        console.log(formData.username)
        try {
            await Auth.resendSignUp(formData.username);
        } catch(err) {
            console.log(err);
        }
        
    }

    return (
        <div className={style["signup-page"]}>
            <div className={style["container"]}>
                <div className={style["screen"]}>
                    <h3 className={style["form-heading"]}>Confirm Sign Up</h3>
                    <form onSubmit={ConfirmSignup} className={style["form-css"]}>
                        
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1"><RiUserFill style={{color: "#f08080"}} /></InputGroup.Text>
                            <FormControl
                            placeholder="Username"
                            aria-describedby="basic-addon1"
                            name="username"
                            value={formData.username}
                            onChange={handleChangeSignup}
                            required
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon3"><BsFillShieldLockFill style={{color: "#f08080"}} /></InputGroup.Text>
                            <FormControl
                            placeholder="Confirmation Code"
                            aria-label="code"
                            aria-describedby="basic-addon3"
                            name="code"
                            value={formData.code}
                            onChange={handleChangeSignup}
                            required
                            />
                        </InputGroup>
                        <div>Lost your code ? <button type="button" onClick={resendCode} className={style["resend-btn"]}>Resend Code</button></div>
                        
                        <button type="submit" className={style["signup-btn"]}>Confirm</button>
                        <div className={style["go-to-signup"]}><Link to="/signup">Back to Sign Up ? </Link></div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ConfirmSignup;