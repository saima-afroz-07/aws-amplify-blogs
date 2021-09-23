import React, { useEffect, useState } from 'react';
import { getPost } from '../../graphql/queries';
import {API, graphqlOperation} from '@aws-amplify/api';
import {Card, Dropdown} from 'react-bootstrap';
import { onCreateComment, onDeleteComment } from '../../graphql/subscriptions';
import {HiDotsHorizontal} from 'react-icons/hi';


import style from './style.module.css'
import { deleteComment } from '../../graphql/mutations';



function DisplayComments({id}) {

    const [comments, setComments] = useState([]);

    const getComments = async() => {
        const input = {
            id: id
        }
        const result = await API.graphql(graphqlOperation(getPost, input));
        // let BlogsList = result.data.listBlogs.items;
        // BlogsList = BlogsList.filter(item => item.id === id);
        console.log(result.data.getPost.comments.items);

        setComments(result.data.getPost.comments.items);
    }

    const handleDeleteComment = async (commentID) => {
        const input ={
            id: commentID
        }

        await API.graphql(graphqlOperation(deleteComment, {input}))
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
        return () => {
           createCommentListener.unsubscribe(); 
           deleteCommentListener.unsubscribe();
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
                                <Dropdown.Item href="#">Edit</Dropdown.Item>
                                <Dropdown.Item  href="#"><button className={style['delete-btn']} onClick={() => {handleDeleteComment(item.id)}} >Delete</button></Dropdown.Item>
                                {/* <MyVerticallyCenteredModal
                                    show={modalShow}
                                    onHide={() => setModalShow(false)}
                                /> */}
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