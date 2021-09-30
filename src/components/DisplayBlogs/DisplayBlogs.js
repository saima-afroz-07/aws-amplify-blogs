import React, { useEffect, useState } from 'react';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import {Card, Button, Dropdown} from 'react-bootstrap';
import {Link, useHistory} from 'react-router-dom'
import {HiDotsVertical} from 'react-icons/hi'

import {listBlogs} from '../../graphql/queries';
import {onCreateBlog, onDeleteBlog, onUpdateBlog} from '../../graphql/subscriptions'
import style from './style.module.css'
import CreateBlogs from '../CreateBlogs/CreateBlogs';
import { deleteBlog, updateBlog } from '../../graphql/mutations';
import EditForm from '../EditForm/EditForm';

function DisplayBlogs(props) {
    const [blogs, setBlogs] = useState([]);
    const [show, setShow] = useState(false);
    const history = useHistory();

    const [formData, setFormData] = useState({
      id: "",
      name: ""
    })

    const handleClose = () => setShow(false);

    const handleShow = (BlogItem) => {
      setShow(true);
      console.log('edit started', BlogItem.name, BlogItem.id);
      setFormData({
        id: BlogItem.id,
        name: BlogItem.name
      });

    };

    

    const getBlogs = async () => {
        const result = await API.graphql(graphqlOperation(listBlogs));
        setBlogs(result.data.listBlogs.items);
        // console.log(result.data.listBlogs.items);
    }

    const handleDeleteBlog = async (BlogID) => {
        const input = {
            id: BlogID
        }
        // console.log(BlogID)

        await API.graphql(graphqlOperation(deleteBlog, {input}));
    }

    const handleChangeBlog = (event) => {
      setFormData({
        [event.target.name]: event.target.value,
        id: formData.id
      })
    }

    const onHandleUpdateBlog = async(event) => {
      event.preventDefault();
        const input = {
          id: formData.id,
          name: formData.name
        }
        console.log(input);

        await API.graphql(graphqlOperation(updateBlog, {input}));

        handleClose();

    }

    const logout = async() => {
      try {
        await Auth.signOut();
        history.push('/login')
      } catch (err) {
        console.log('error => ', err)
      }
      
    }
    

    useEffect(() => {
        getBlogs();
    }, [])

    useEffect(() => {

        Auth.currentUserInfo().then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })

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
        });

        const updateBlogListener = API.graphql(graphqlOperation(onUpdateBlog)).subscribe({
          next: postData => {
            const myBlogs = blogs;
            const updateBlog = postData.value.data.onUpdateBlog;
            const index = myBlogs.findIndex(blog => blog.id === updateBlog.id);
            const updatedBlogs = [...myBlogs.slice(0, index), updateBlog, ...myBlogs.slice(index + 1)];
            console.log(updatedBlogs);
            setBlogs(updatedBlogs);
          }
        })
        

        return() => {
            createBlogListener.unsubscribe();
            deleteBlogListener.unsubscribe();
            updateBlogListener.unsubscribe();
        }

    }, [blogs])

    return (
        <div className={style['home-page-css']}>
            <CreateBlogs />
            <h2>Blogs</h2>
            <button className={style["logout-btn"]} onClick={logout}>Logout</button>
            <div className={style['card-section']}>
            {blogs.map(item => {
                return (
                <Card key={item.id} className={style['card-css']} >
                     <Dropdown className={"d-inline mx-2", style['dropdown-css']}>
                        <Dropdown.Toggle className={style['dd-toggle-btn']} id="dropdown-autoclose-true">
                        <HiDotsVertical />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                        <Dropdown.Item href="#"><button className={style['edit-btn']} onClick={() => {handleShow(item)}}>Edit</button></Dropdown.Item>
                        <Dropdown.Item  href="#"><button className={style['delete-btn']} onClick={() => {handleDeleteBlog(item.id)}} >Delete</button></Dropdown.Item>
                        <EditForm
                            show={show}
                            onHide={handleClose}
                            formData={formData}
                            handleChangeItem={handleChangeBlog}
                            handleClose={handleClose}
                            onHandleUpdateItem={onHandleUpdateBlog}
                            title="Blog"
                            name='name'
                            value={formData.name}
                        />
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

// function MyVerticallyCenteredModal({show, handleClose, formData, handleChangeBlog, onHandleUpdateBlog}) {
//     return (
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header >
//           <Modal.Title>Modal heading</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <h5>Edit Blog's Title</h5>
//           <InputGroup className={style['input-css']}>
//               <InputGroup.Text id="basic-addon1"><AiOutlineEdit /></InputGroup.Text>
//               <FormControl
//               placeholder="Please Enter Blog's Name"
//               name="name"
//               aria-describedby="basic-addon1"
//               required
//               value={formData.name}
//               onChange={handleChangeBlog}
//               />
//               {/* <Button type="submit"  className={style['btn']} variant="outline-secondary" id="button-addon2">
//               Update
//               </Button> */}
//           </InputGroup>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button onClick={onHandleUpdateBlog} variant="primary">
//             Save
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     );
//   }

export default DisplayBlogs;
