import {API, graphqlOperation} from '@aws-amplify/api';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {getBlog} from '../../graphql/queries';
import CreatePost from '../CreatePost/CreatePost';
import {Card, Dropdown} from 'react-bootstrap';
import {HiDotsHorizontal} from 'react-icons/hi';

import style from './style.module.css'
import { onCreatePost, onDeletePost, onUpdatePost } from '../../graphql/subscriptions';
import { deletePost, updatePost } from '../../graphql/mutations';
import CreateComments from '../CreateComments/CreateComments';
import DisplayComments from '../DisplayComments/DisplayComments';
import EditForm from '../EditForm/EditForm';

function DisplayPosts(props) {
    let { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [show, setShow] = useState(false);

    const [formData, setFormData] = useState({
        blogID: "", 
        title: "", 
        id: ""
    })


    const getPosts = async() => {
        const input = {
            id: id
        }
        const result = await API.graphql(graphqlOperation(getBlog, input));
        console.log(result.data.getBlog);
        setPosts(result.data.getBlog.posts.items);
    }

    const handleDeletePost = async (postID) => {
        console.log('deleted')
        const input = {
            id: postID
        }

        await API.graphql(graphqlOperation(deletePost, {input}))
    }

    const handleClose = () => setShow(false);

    const handleShow = (postItem) => {
      setShow(true);
      console.log('edit started', postItem);
      setFormData({
        id: postItem.id,
        title: postItem.title,
        blogID: postItem.blogID
      });

    };

    const handleChangePost = (event) => {
        setFormData({
          [event.target.name]: event.target.value,
          id: formData.id,
          blogID: formData.blogID
        })
    }
  
    const onHandleUpdatePost = async(event) => {
        event.preventDefault();
          const input = {
            id: formData.id,
            title: formData.title,
            blogID: formData.blogID
          }
          console.log(input);
  
          await API.graphql(graphqlOperation(updatePost, {input}));
  
          handleClose();
  
    }

    useEffect(() => {
        getPosts();
    }, [])

    useEffect(() => {

        const createPostListener = API.graphql(graphqlOperation(onCreatePost)).subscribe({
            next: postData => {
                const newPost = postData.value.data.onCreatePost;
                const updatedPost = [ ...posts, newPost]
                setPosts(updatedPost);
            }
        })

        const deletePostListener = API.graphql(graphqlOperation(onDeletePost)).subscribe({
            next: postData => {
                const deletedPost = postData.value.data.onDeletePost;
                const updatedPost = posts.filter(post => post.id !== deletedPost.id)
                setPosts(updatedPost);
            }
        })

        const updatePostListener = API.graphql(graphqlOperation(onUpdatePost)).subscribe({
            next: postData => {
                const myPosts = posts;
                const updatePost = postData.value.data.onUpdatePost;
                const index = myPosts.findIndex(post => post.id === updatePost.id);
                const updatedPosts = [...myPosts.slice(0, index), updatePost, ...myPosts.slice(index+1)];

                setPosts(updatedPosts);

            }
        })

        
        
        return () => {
            createPostListener.unsubscribe();
            deletePostListener.unsubscribe();
            updatePostListener.unsubscribe();
        }
    }, [posts])
    return (
        <div>
            
            <CreatePost id={id}/>
            <h3>Posts</h3>
            {posts.map (item => {
                return <div key={item.id}>
                    <Card className={style['card-css']}>
                        <Card.Header>
                            <h5>John Doe</h5>
                            <Dropdown className={"d-inline mx-2", style['dropdown-css']}>
                                <Dropdown.Toggle className={style['dd-toggle-btn']} id="dropdown-autoclose-true">
                                <HiDotsHorizontal />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                <Dropdown.Item href="#"><button className={style['edit-btn']} onClick={() => {handleShow(item)}}>Edit</button></Dropdown.Item>
                                <Dropdown.Item  href="#"><button className={style['delete-btn']} onClick={() => {handleDeletePost(item.id)}} >Delete</button></Dropdown.Item>
                                <EditForm
                                    show={show}
                                    onHide={handleClose}
                                    formData={formData}
                                    handleChangeItem={handleChangePost}
                                    handleClose={handleClose}
                                    onHandleUpdateItem={onHandleUpdatePost}
                                    title="Post"
                                    name='title'
                                    value={formData.title}
                                />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Card.Header>
                        <Card.Body>
                            <blockquote className="blockquote mb-0">
                            <p>
                                {' '}
                                {item.title}
                                {' '}
                            </p>
                            <footer className="blockquote-footer">
                                {new Date(item.createdAt).toDateString()}
                            </footer>
                            </blockquote>
                        </Card.Body>
                        <Card.Footer className="text-muted">
                            <h5>Comments</h5>
                            <CreateComments id={item.id}/>
                            <DisplayComments id={item.id}/>
                        </Card.Footer>
                    </Card>
                </div>
            })}
        </div>
    );
}

export default DisplayPosts;