import React, { useEffect, useState } from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {Card, Button, Dropdown, Modal} from 'react-bootstrap';
import {Link, BrowserRouter as Router, Route} from 'react-router-dom'

import {listBlogs} from '../../graphql/queries';
import {onCreateBlog, onDeleteBlog} from '../../graphql/subscriptions'
import style from './style.module.css'
import CreateBlogs from '../CreateBlogs/CreateBlogs';
import {HiDotsVertical} from 'react-icons/hi'
import { deleteBlog } from '../../graphql/mutations';

function DisplayBlogs(props) {
    const [blogs, setBlogs] = useState([]);
    // const [modalShow, setModalShow] = useState(false);

    const getBlogs = async () => {
        const result = await API.graphql(graphqlOperation(listBlogs));
        setBlogs(result.data.listBlogs.items);
        // console.log(result.data.listBlogs.items);
    }

    const handleDeleteBlog = async (BlogID) => {
        // setModalShow(true);
        const input = {
            id: BlogID
        }
        // console.log(BlogID)

        await API.graphql(graphqlOperation(deleteBlog, {input}));
    }
    

    useEffect(() => {
        getBlogs();
    }, [])

    useEffect(() => {

        const createBlogListener = API.graphql(graphqlOperation(onCreateBlog)).subscribe({
            next: postData => {
                const newBlog = postData.value.data.onCreateBlog;
                // const prevBlogs = blogs.filter(blog => blog.id !== newBlog.id);
                // console.log(newBlog, blogs);
    
                const updateBlogs = [ ...blogs, newBlog];
    
                setBlogs(updateBlogs)
            }
        }) 
        
        const deleteBlogListener = API.graphql(graphqlOperation(onDeleteBlog)).subscribe({
            next: postData => {
                const deletedBlog = postData.value.data.onDeleteBlog;
                const updatedBlog = blogs.filter(blog => blog.id !== deletedBlog.id)
                setBlogs(updatedBlog)
                console.log(deleteBlog)
            }
        })
        

        return() => {
            createBlogListener.unsubscribe();
            deleteBlogListener.unsubscribe();
        }

    }, [blogs])

    return (
        <div className={style['home-page-css']}>
            <CreateBlogs />
            <h2>Blogs</h2>
            
            <div className={style['card-section']}>
            {blogs.map(item => {
                return (
                <Card key={item.id} className={style['card-css']} >
                     <Dropdown className={"d-inline mx-2", style['dropdown-css']}>
                        <Dropdown.Toggle className={style['dd-toggle-btn']} id="dropdown-autoclose-true">
                        <HiDotsVertical />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                        <Dropdown.Item href="#">Edit</Dropdown.Item>
                        <Dropdown.Item  href="#"><button className={style['delete-btn']} onClick={() => {handleDeleteBlog(item.id)}} >Delete</button></Dropdown.Item>
                        {/* <MyVerticallyCenteredModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                        /> */}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Subtitle className={"mb-2 text-muted ", style['card-subtitle-css']}>Created on: {new Date(item.createdAt).toDateString()}</Card.Subtitle>
                        <Card.Text></Card.Text>
                    </Card.Body>
                      <Link to={`/posts/${item.id}`}><Button className={style['btn']}>Open</Button></Link>
                    
                    
                </Card>
                )
            })}
            </div>
                    
                
        </div>
    );
}

function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Centered Modal</h4>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
            consectetur ac, vestibulum at eros.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default DisplayBlogs;
