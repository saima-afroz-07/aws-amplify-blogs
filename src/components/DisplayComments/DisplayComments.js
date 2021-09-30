import React, { useEffect, useState } from 'react';
import {API, graphqlOperation} from '@aws-amplify/api';
import {Card, Dropdown} from 'react-bootstrap';
import {HiDotsHorizontal} from 'react-icons/hi';


import style from './style.module.css'
import { getPost } from '../../graphql/queries';
import { onCreateComment, onDeleteComment, onUpdateComment } from '../../graphql/subscriptions';
import { deleteComment, updateComment } from '../../graphql/mutations';
import EditForm from '../EditForm/EditForm';



function DisplayComments({id}) {

    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [show, setShow] = useState(false);

    const [formData, setFormData] = useState({
        postID: "", 
        content: "", 
        id: ""
    })

    const getComments = async() => {
        const input = {
            id: id
        }
        const result = await API.graphql(graphqlOperation(getPost, input));
        console.log(result.data.getPost.comments.items);

        setComments(result.data.getPost.comments.items);
    }

    const handleDeleteComment = async (commentID) => {
        const input ={
            id: commentID
        }

        await API.graphql(graphqlOperation(deleteComment, {input}))
    }

    const handleClose = () => setShow(false);

    const handleShow = (commentItem) => {
      setShow(true);
      console.log('edit started', commentItem);
      setFormData({
        id: commentItem.id,
        content: commentItem.content,
        postID: commentItem.postID
      });

    };

    const handleChangeComment = (event) => {
        setFormData({
          [event.target.name]: event.target.value,
          id: formData.id,
          postID: formData.postID
        })
    }
  
    const onHandleUpdateComment = async(event) => {
        event.preventDefault();
          const input = {
            id: formData.id,
            content: formData.content,
            postID: formData.postID
        }
        console.log(input);
  
          await API.graphql(graphqlOperation(updateComment, {input}));
  
        handleClose();
  
    }

    useEffect(() => {
        getComments();
    }, [])

    useEffect(() => {
        const createCommentListener = API.graphql(graphqlOperation(onCreateComment)).subscribe({
            next: postData => {
                const newComment = postData.value.data.onCreateComment;
                const updatedComment = [...comments, newComment]
                setComments(updatedComment);
            }
        })

        const deleteCommentListener = API.graphql(graphqlOperation(onDeleteComment)).subscribe({
            next: postData => {
                const deletedComment = postData.value.data.onDeleteComment;
                const updatedComments = comments.filter(comment => comment.id !== deletedComment.id)
                setComments(updatedComments);
            }
        })

        const updateCommentListener = API.graphql(graphqlOperation(onUpdateComment)).subscribe({
            next: postData => {
                const myComments = comments;
                const updateComment = postData.value.data.onUpdateComment;
                const index = myComments.findIndex(comment => comment.id === updateComment.id);
                const updatedComments = [ ...myComments.slice(0, index), updateComment, ...myComments.slice(1+index)];
                setComments(updatedComments);
            }

        })
        return () => {
           createCommentListener.unsubscribe(); 
           deleteCommentListener.unsubscribe();
           updateCommentListener.unsubscribe();
        }
    }, [comments])


    return (
        <>
          {comments.map(item => {
              return <Card className={style['card-css']} key={item.id}>
                        <Card.Body>
                            <Dropdown className={"d-inline mx-2", style['dropdown-css']}>
                                <Dropdown.Toggle className={style['dd-toggle-btn']} id="dropdown-autoclose-true">
                                <HiDotsHorizontal />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                <Dropdown.Item href="#"><button className={style['edit-btn']} onClick={() => {handleShow(item)}}>Edit</button></Dropdown.Item>
                                <Dropdown.Item  href="#"><button className={style['delete-btn']} onClick={() => {handleDeleteComment(item.id)}} >Delete</button></Dropdown.Item>
                                <EditForm
                                    show={show}
                                    onHide={handleClose}
                                    formData={formData}
                                    handleChangeItem={handleChangeComment}
                                    handleClose={handleClose}
                                    onHandleUpdateItem={onHandleUpdateComment}
                                    title="Comment"
                                    name='content'
                                    value={formData.content}
                                />
                                </Dropdown.Menu>
                            </Dropdown>
                            <Card.Text>
                            {item.content}
                            </Card.Text>
                        </Card.Body>
                    </Card>
          })}  
        </>
    );
}

export default DisplayComments;