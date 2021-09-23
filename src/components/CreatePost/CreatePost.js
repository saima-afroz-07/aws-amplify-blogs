import { createPost } from '../../graphql/mutations';
import {API, graphqlOperation} from '@aws-amplify/api';
import React, { useEffect, useState } from 'react';
import {FormControl, InputGroup, Button} from 'react-bootstrap';
import {AiOutlineEdit} from 'react-icons/ai';

import style from './style.module.css'


function CreatePost({id}) {
    const [formData, setFormData] = useState({
        title: "",
        
    })

    const handleChangePost = event => {
        setFormData({
            [event.target.name]: event.target.value
        })
    }
    const handleAddPost = async(event) => {
        event.preventDefault();
        const input = {
            title: formData.title,
            blogID: id
        }

        await API.graphql(graphqlOperation(createPost, {input}));

        setFormData({title: ""})
    }
    return (
        <>
            <h1>Create Posts</h1>
            <form className={style['form-css']} onSubmit={handleAddPost}>
            <InputGroup className={style['input-css']}>
                <InputGroup.Text id="basic-addon1"><AiOutlineEdit /></InputGroup.Text>
                <FormControl
                placeholder="Please Enter Post"
                name="title"
                aria-describedby="basic-addon1"
                required
                value={formData.title}
                onChange={handleChangePost}
                />
                <Button type="submit" className={style['btn']} variant="outline-secondary" id="button-addon2">
                Create
                </Button>
            </InputGroup>
            </form>
        </>
    );
}

export default CreatePost;