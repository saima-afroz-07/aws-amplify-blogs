import {API, graphqlOperation} from '@aws-amplify/api';
import React, { useEffect, useState } from 'react';
import {FormControl, InputGroup, Button} from 'react-bootstrap';
import {AiOutlineEdit} from 'react-icons/ai';
import { createComment } from '../../graphql/mutations';

import style from './style.module.css'


function CreateComments({id}) {

    const [formData, setFormData] = useState({
        content: ""
    })

    const handleChangeComment = event => {
        setFormData({
            [event.target.name]: event.target.value
        })
    }
    const handleAddComment = async(event) => {
        event.preventDefault();
        const input = {
            content: formData.content,
            postID: id
        }

        await API.graphql(graphqlOperation(createComment, {input}));

        setFormData({content: ""})
    }
   

    return (
        <>
         <form className={style['form-css']} onSubmit={handleAddComment}>
            <InputGroup className={style['input-css']}>
                <InputGroup.Text id="basic-addon1"><AiOutlineEdit /></InputGroup.Text>
                <FormControl
                placeholder="Please Enter Post"
                name="content"
                aria-describedby="basic-addon1"
                required
                value={formData.content}
                onChange={handleChangeComment}
                />
                <Button type="submit" className={style['btn']} variant="outline-secondary" id="button-addon2">
                Add Comment
                </Button>
            </InputGroup>
            </form>   
        </>
    );
}

export default CreateComments;