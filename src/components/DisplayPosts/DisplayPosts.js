import {API, graphqlOperation} from '@aws-amplify/api';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {getBlog} from '../../graphql/queries';
import CreatePost from '../CreatePost/CreatePost';
import {Card, Dropdown} from 'react-bootstrap';
import {HiDotsHorizontal} from 'react-icons/hi';

import style from './style.module.css'
import { onCreatePost, onDeletePost } from '../../graphql/subscriptions';
import { deletePost } from '../../graphql/mutations';
import CreateComments from '../CreateComments/CreateComments';
import DisplayComments from '../DisplayComments/DisplayComments';

function DisplayPosts(props) {
    let { id } = useParams();
    const [posts, setPosts] = useState([]);
    // console.log(posts);


    const getPosts = async() => {
        const input = {
            id: id
        }
        const result = await API.graphql(graphqlOperation(getBlog, input));
        // let BlogsList = result.data.listBlogs.items;
        // BlogsList = BlogsList.filter(item => item.id === id);
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

        
        
        return () => {
            createPostListener.unsubscribe();
            deletePostListener.unsubscribe();
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
                                <Dropdown.Item href="#">Edit</Dropdown.Item>
                                <Dropdown.Item  href="#"><button className={style['delete-btn']} onClick={() => {handleDeletePost(item.id)}} >Delete</button></Dropdown.Item>
                                {/* <MyVerticallyCenteredModal
                                    show={modalShow}
                                    onHide={() => setModalShow(false)}
                                /> */}
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