import {API, graphqlOperation} from '@aws-amplify/api';
import React, { useState } from 'react';
import {FormControl, InputGroup, Button} from 'react-bootstrap';
import {AiOutlineEdit} from 'react-icons/ai';

import {createBlog} from '../../graphql/mutations';
import style from './style.module.css'

function CreateBlogs(props) {
    const [formData, setFormData] = useState({
        name: ""
    })

    const handleChangeBlog = event => {
        setFormData({
            [event.target.name]: event.target.value
        })
    }
    const handleAddBlog = async(event) => {
        event.preventDefault();
        const input = {
            name: formData.name
        }

        await API.graphql(graphqlOperation(createBlog, {input}));

        setFormData({name: ""})
    }
   

    return (
        <>
            <h1>Create Blogs</h1>
            <form className={style['form-css']} onSubmit={handleAddBlog}>
            <InputGroup className={style['input-css']}>
                <InputGroup.Text id="basic-addon1"><AiOutlineEdit /></InputGroup.Text>
                <FormControl
                placeholder="Please Enter Blog's Name"
                name="name"
                aria-describedby="basic-addon1"
                required
                value={formData.name}
                onChange={handleChangeBlog}
                />
                <Button type="submit" className={style['btn']} variant="outline-secondary" id="button-addon2">
                Create
                </Button>
            </InputGroup>
            </form>
        </>
    );
}

export default CreateBlogs;