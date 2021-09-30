import React, { useState } from 'react';
import {InputGroup, FormControl} from 'react-bootstrap';
import {RiUserFill, RiLockPasswordFill} from 'react-icons/ri';
import {MdContactPhone} from 'react-icons/md';
import {IoMailSharp} from 'react-icons/io5'
import {Link, useHistory} from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { ToastContainer, toast } from 'react-toastify';

import style from './style.module.css';



function Signup(props) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        phone: ""
    });
    const history = useHistory();

    const signup = async(event) => {
        event.preventDefault();
        console.log(JSON.stringify(formData));
        try {
            await Auth.signUp({username: formData.username, password: formData.password, attributes: {email: formData.email}});
            history.push("/confirm-signup");
            
        } catch (err) {
            console.log('error => ', err);
            // toast.dark("err.message", {
            //     position: "top-right",
            //     autoClose: 5000,
            //     hideProgressBar: false,
            //     closeOnClick: true,
            //     pauseOnHover: true,
            //     draggable: true,
            //     progress: undefined,
            // });
        }
        
    }

    const handleChangeSignup = (event) => {

        setFormData(inputs => ({...inputs, [event.target.name]: event.target.value}));
        
    }

    return (
        <div className={style["signup-page"]}>
            <div className={style["container"]}>
                <div className={style["screen"]}>
                    <h3 className={style["form-heading"]}>Sign Up</h3>
                    <form onSubmit={signup} className={style["form-css"]}>
                        
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
                            <InputGroup.Text id="basic-addon3"><IoMailSharp style={{color: "#f08080"}} /></InputGroup.Text>
                            <FormControl
                            placeholder="Email"
                            aria-label="Email"
                            aria-describedby="basic-addon3"
                            name="email"
                            value={formData.email}
                            onChange={handleChangeSignup}
                            required
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon2"><RiLockPasswordFill style={{color: "#f08080"}} /></InputGroup.Text>
                            <FormControl
                            type="password"
                            placeholder="Password"
                            aria-label="Password"
                            aria-describedby="basic-addon2"
                            name="password"
                            value={formData.password}
                            onChange={handleChangeSignup}
                            required
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon4"><MdContactPhone style={{color: "#f08080"}} /></InputGroup.Text>
                            <FormControl
                            placeholder="Phone"
                            aria-label="Phone"
                            aria-describedby="basic-addon4"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChangeSignup}
                            
                            />
                        </InputGroup>
                        
                        <button type="submit" className={style["signup-btn"]}>Sign Up</button>
                        <div className={style["go-to-login"]}>Already Have An Account ? <Link to="/login"> Log In</Link></div>
                    </form>
                </div>
            </div>
            {/* <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            /> */}
        </div>
    );
}

export default Signup;