import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import '../Style/style.css';
import { TextField } from '@mui/material';
import { Mycontext } from '../Config/context';
import NativeSelect from '@mui/material/NativeSelect';
import axios from 'axios';
import env, { createData } from '../env';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { toast } from 'react-hot-toast';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import InputAdornment from '@mui/material/InputAdornment';

import { useNavigate } from 'react-router-dom';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { saveAs } from 'file-saver';
import Cookies from 'js-cookie';

export default function ResponsiveDialog(props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const handleClose = () => {
        props.setopen(false);
        props.setscan(false);
        document.body.style.backgroundColor = '#e7e5e5';
    };

    return (
        <div>
            <Dialog fullScreen={fullScreen} open={props.open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">{props.type === 'scanentry' ? 'Student Detail' : 'Borrow Detail'}</DialogTitle>
                <DialogContent>
                    {props.type === 'scanentry' ? (
                        <DialogContentText className="student_modal">
                            <img src={props.data?.profile} className="student_img" alt="profile" srcset="" />
                            <table className="studentDetail_table">
                                <tr>
                                    <th>Student ID</th>
                                    <td>{props.data?.ID}</td>
                                </tr>
                                <tr>
                                    <th>Student Name</th>
                                    <td>{props.data?.name}</td>
                                </tr>
                                <tr>
                                    <th>Faculty</th>
                                    <td>{props.data?.faculty}</td>
                                </tr>
                                <tr>
                                    <th>Department</th>
                                    <td>{props.data?.deparment}</td>
                                </tr>
                                <tr>
                                    <th></th>
                                </tr>
                            </table>
                        </DialogContentText>
                    ) : (
                        <DialogContentText className="student_modal">
                            <table className="studentDetail_table">
                                <tr>
                                    <th>Borrow ID</th>
                                    <td>{props.data?.borrow_id}</td>
                                </tr>
                                <tr>
                                    <th>Borrow Date</th>
                                    <td>{new Date(props.data?.borrow_date).toLocaleDateString('en')}, {new Date(props.data?.borrow_date).getHours()}:{new Date(props.data?.borrow_date).getMinutes()}:{new Date(props.data?.borrow_date).getSeconds()}</td>
                                </tr>
                                <tr>
                                    <th>Expect Return Date</th>
                                    <td>{new Date(props.data?.expect_return_date).toLocaleDateString('en')}, {new Date(props.data?.expect_return_date).getHours()}:{new Date(props.data?.expect_return_date).getMinutes()}:{new Date(props.data?.expect_return_date).getSeconds()}</td>
                                </tr>
                                <tr>
                                    <th>Student</th>
                                    <td>
                                        {props.data?.student?.fullname} (ID: {props.data?.student?.ID})
                                    </td>
                                </tr>
                                <tr>
                                    <th>Department</th>
                                    <td>{props.data?.student?.department}</td>
                                </tr>
                                <tr>
                                    <th>All Books</th>
                                </tr>
                                <tr>
                                    <td className="book_row">
                                        {props.data?.Books?.map((i) => (
                                            <div className="borrowed_book">
                                                <img onClick={() => navigate(`/book/${i.title}`)} src={i.cover_img} alt="cover" />
                                                <p>{i.title}</p>
                                                <p>{i.categories}</p>
                                                <p>ISBN: {i.ISBN[0].identifier}</p>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            </table>
                        </DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export function FormDialog(props) {
    const [open, setOpen] = React.useState(false);
    const ctx = useContext(Mycontext);
    const [userData, setdata] = useState({
        department: '',
        status: 'available'
    });
    const [departments, setdep] = useState('');
    const [department, setdepartment] = useState([]);
    const fetchdata = (end) => {
        return axios({
            method: 'post',
            url: env.api + end,
            headers: {
                Authorization: `Bearer ${ctx.user.token.accessToken}`
            },
            data: userData
        });
    };
    useEffect(() => {
        if (props.action === 'edit') {
            const findBook = ctx.book.allbooks.find(({ id }) => id === props.selectedbook[0]);
            setdata(findBook);
            console.log(findBook);
        }
    }, [ctx.book.allbooks, props.action, props.selectedbook]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (props.type === 'studentlist') {
            fetchdata('register-student')
                .then(() => {
                    toast.success('Student Registered', { duration: 2000 });
                    ctx.setstudent((prev) => [
                        ...prev,
                        createData(userData.studentID, userData.firstname + ' ' + userData.lastname, userData.department, userData.email, userData.phone_number, '0 For This Week')
                    ]);
                    e.target.reset();
                })
                .catch((err) => {
                    if (err.response.status === 400) {
                        toast.error('Please Check All Required Informations', { duration: 2000 });
                    } else if (err.response.status === 401) {
                        toast.error(err.response.data.message);
                    } else {
                        toast.error('Opps! Something Wrong');
                    }
                });
        } else if (props.type === 'HD') {
            fetchdata('register-HD')
                .then(() => {
                    toast.success('Headdepartment Registered', { duration: 2000 });
                    e.target.reset();
                })
                .catch((err) => {
                    if (err.response.status === 400) {
                        toast.error('Please Check All Required Informations', { duration: 2000 });
                    } else if (err.response.status === 401) {
                        toast.error(err.response.data.message);
                    } else {
                        toast.error('Opps! Something Wrong');
                    }
                });
        } else if (props.type === 'department') {
            fetchdata('createdepartment')
                .then(() => {
                    toast.success('Department Created', { duration: 2000 });
                    e.target.reset();
                })
                .catch(() => toast.error('Error Occured', { duration: 2000 }));
        } else if (props.type === 'Createbook' || props.type === 'Editbook') {
            if (props.action === 'create') {
                axios({
                    method: 'post',
                    url: env.api + `${props.action === 'create' ? 'createbook' : 'editbook'}`,
                    headers: {
                        Authorization: `Bearer ${ctx.user.token.accessToken}`
                    },
                    data: {
                        ISBN: userData.ISBN,
                        cover_img: userData.cover_img,
                        title: userData.title,
                        author: userData.author,
                        categories: userData.categories,
                        publisher_date: userData.publisher_date,
                        description: userData.description,
                        status: 'available',
                        id: userData.id
                    }
                })
                    .then(() => {
                        toast.success('Book Created', { duration: 2000 });
                        ctx.setbook((prev) => ({ ...prev, allbooks: [...prev.allbooks, userData] }));
                        e.target.reset();
                    })
                    .catch((err) => {
                        if (err.response.status === 400) {
                            toast.error('Please Check All Required Input');
                        } else {
                            toast.error('Opps! Something Broke');
                        }
                    });
            } else {
                axios({
                    method: 'post',
                    url: env.api + 'editbook',
                    headers: {
                        Authorization: `Bearer ${ctx.user.token.accessToken}`
                    },
                    data: {
                        ISBN: userData.ISBN,
                        cover_img: userData.cover_img,
                        title: userData.title,
                        author: userData.author,
                        categories: userData.categories,
                        publisher_date: userData.publisher_date,
                        description: userData.description,
                        id: userData.id
                    }
                })
                    .then(() => {
                        toast.success('Book Updated', { duration: 2000 });
                    })
                    .catch((err) => {
                        if (err.response.status === 400) {
                            toast.error('Please Check All Required Input');
                        } else {
                            toast.error('Opps! Something Broke');
                        }
                    });
            }
        }
    };
    const handleChange = (event) => {
        if (event.target.name === 'ISBN') {
            setdata({ ...userData, [event.target.name]: [{ type: 'other', identifier: event.target.value }] });
        }  else if (event.target.name === 'author' ||event.target.name === 'categories' ) {
            setdata({ ...userData, [event.target.name]: [event.target.value] });
        } 
        else {
            setdata({ ...userData, [event.target.name]: event.target.value });
        }
    };

    const handleClose = () => {
        setOpen(false);
        ctx.setMenu({ ...ctx.openMenu, [props.type]: false });
    };
    const getdepartment = () => {
        axios({
            method: 'get',
            url: env.api + 'getdepartment',
            headers: {
                Authorization: `Bearer ${ctx.user.token.accessToken}`
            }
        }).then((res) => setdepartment(res.data));
    };

    useEffect(() => {
        getdepartment();
    }, []);

    return (
        <div>
            <Dialog open={ctx.openMenu[props.type]} onClose={handleClose}>
                <DialogTitle>
                    {' '}
                    {props.type === 'studentlist'
                        ? `${props.action === 'create' ? 'Register Student' : 'Edit Student'}`
                        : props.type === 'HD'
                        ? 'REGISTER HEADDEPARTMENT'
                        : `${props.action === 'create' ? 'Register Book' : props.type === 'department' ? 'CREATE DEPARTMENT' : 'Edit Book'}`}{' '}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <DialogContentText>Please Fill in with relevant information</DialogContentText>

                        {props.type === 'studentlist' ? (
                            <>
                                {' '}
                                <TextField autoFocus margin="dense" name="firstname" label="Firstname" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" name="lastname" label="Lastname" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" name="email" label="Email" type="email" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" name="studentID" label="StudentID" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <FormControl variant="standard" className="select" fullWidth>
                                    <InputLabel id="demo-simple-select-label">Department</InputLabel>
                                    <Select id="department" value={userData.department} name="department" label="department" onChange={handleChange}>
                                        {department?.map((i) => (
                                            <MenuItem value={i.department}>{i.department}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField autoFocus margin="dense" name="phone_number" label="Phone Number" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    name="dateofbirth"
                                    label="DateofBirth (Optional)"
                                    type="date"
                                    fullWidth
                                    variant="standard"
                                    InputLabelProps={{ shrink: true }}
                                    onChange={handleChange}
                                />
                            </>
                        ) : props.type === 'HD' ? (
                            <>
                                <TextField autoFocus margin="dense" name="firstname" label="FIRSTNAME" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" name="lastname" label="LASTNAME" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" name="ID" label="ID CARD" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <FormControl variant="standard" className="select" fullWidth>
                                    <InputLabel id="demo-simple-select-label">Department</InputLabel>
                                    <Select labelId="demo-simple-select-label" name="department" value={userData.department} label="department" onChange={handleChange}>
                                        {department?.map((i) => (
                                            <MenuItem value={i.department}>{i.department}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField autoFocus margin="dense" name="email" label="EMAIL" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" name="phone_number" label="PHONENUMBER" type="text" fullWidth variant="standard" required onChange={handleChange} />
                            </>
                        ) : props.type === 'department' ? (
                            <>
                                <TextField autoFocus margin="dense" name="faculty" label="FACULTY" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" name="department" label="DEPARTMENT" type="text" fullWidth variant="standard" required onChange={handleChange} />
                            </>
                        ) : (
                            <>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    name="ISBN"
                                    value={props.action === 'edit' && userData?.ISBN !== undefined ? userData.ISBN[0].identifier : null}
                                    label="ISBN CODE"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={handleChange}
                                    required
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    name="cover_img"
                                    value={props.action === 'edit' ? userData?.cover_img : null}
                                    label="Book Cover (Please Input URL of Image)"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={handleChange}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    name="title"
                                    value={props.action === 'edit' ? userData?.title : null}
                                    label="Title"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    required
                                    onChange={handleChange}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    name="author"
                                    value={props.action === 'edit' && userData?.author !== undefined ? userData.author : null}
                                    label="Author"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    required
                                    onChange={handleChange}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    name="categories"
                                    label="Categories"
                                    type="text"
                                    value={props.action === 'edit' && userData?.categories !== undefined ? userData.categories : null}
                                    fullWidth
                                    variant="standard"
                                    placeholder="Action & Logic"
                                    required
                                    onChange={handleChange}
                                />
                                {props.action !== 'edit' && (
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        name="publisher_date"
                                        label="PublisherDate"
                                        type="date"
                                        fullWidth
                                        variant="standard"
                                        required
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                )}

                                <TextField
                                    autoFocus
                                    margin="dense"
                                    name="description"
                                    value={props.action === 'edit' ? userData?.description : null}
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={handleChange}
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Register</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export function DeleteDialog(props) {
    const ctx = useContext(Mycontext);

    const [student, setstudent] = useState('');
    const [libraiandata , setlibrarian] = useState({
        id: ctx.user.user.id,
        fullname: '' ,
        oldpwd: '',
        newpwd: '',
        ID: '',
        
    })
    const [showPassword, setShowPassword] = useState({
        pwd1: false,
        pwd2: false
    });

    const [password, setpassword] = useState({
        id: ctx.user.user.ID
    });
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (e, type) => {
        if (type === 'student') {
            setstudent(e.target.value);
        } else if (type === 'librarian') {
            setlibrarian({...libraiandata , [e.target.id]:e.target.value})
        }
        else {
            setpassword({ ...password, [e.target.id]: e.target.value });
        }
    };
    const handleClose = () => {
        if (props.type === 'password') {
            ctx.setMenu({ ...ctx.openMenu, openchangepwd: false });
        } else if (props.type === 'editlibrarian') {
            ctx.setMenu({...ctx.openMenu , editlibrarian: false})
        } else {
            ctx.setMenu({ ...ctx.openMenu, opendelete: false });
        }
    };
    const handleDelete = (e, id) => {
        e.preventDefault();
        if (props.type === 'studentlist') {
            axios({
                method: 'post',
                url: env.api + `deletestudent`,
                data: { id: props.data },
                headers: {
                    Authorization: `Bearer ${ctx.user.token.accessToken}`
                }
            })
                .then(() => window.location.reload())
                .catch(() => toast.error('Something Wrong', { duration: 2000 }));
        } else if (props.type === 'borrowedbook') {
            axios({
                method: 'post',
                url: env.api + 'delete_borrow',
                headers: {
                    Authorization: `Bearer ${ctx.user.token.accessToken}`
                },
                data: { id: props.data }
            }).then(() => window.location.reload());
        } else if (props.type === 'booklist') {
            axios({
                method: 'post',
                url: env.api + 'deletebook',
                headers: {
                    Authorization: `Bearer ${ctx.user.token.accessToken}`
                },
                data: {
                    id: props.data
                }
            }).then(() => window.location.reload());
        } else if (props.type === 'editlibrarian') {
            axios({
                method: "POST" ,
                url: env.api + "editlibrarian" ,
                headers: {
                    Authorization: `Bearer ${ctx.user.token.accessToken}`
                },
                data : libraiandata
            }).then(() => {
                toast.success("Change Successfully" , {duration: 2000})
                if (libraiandata.ID !== '' && libraiandata.fullname !== '') {
                    ctx.user.user.fullname = libraiandata.fullname
                    ctx.user.user.ID = libraiandata.ID
                    Cookies.set('user', JSON.stringify(ctx.user), { expires: 7 });
                }
                else if(libraiandata.fullname !== '') {
                    ctx.user.user.fullname = libraiandata.fullname
                    Cookies.set('user', JSON.stringify(ctx.user), { expires: 7 });
                } else if (libraiandata.ID !== '') {
                    ctx.user.user.ID = libraiandata.ID
                    Cookies.set('user', JSON.stringify(ctx.user), { expires: 7 });
                } 
                e.target.reset()
            }).catch((err) => {
                toast.error("Something Wrong" , {duration:2000})
            })
        } else {
            axios({
                method: 'post',
                url: env.api + 'updatepwd',
                headers: {
                    Authorization: `Bearer ${ctx.user.token.accessToken}`
                },
                data: password
            })
                .then((res) => {
                    toast.success(res.data.message, { duration: 2000 });
                    e.target.reset();
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(err.response.data.message, { duration: 2000 });
                });
        }
    };

    return (
        <div>
            <Dialog
                open={props.type === 'password' ? ctx.openMenu.openchangepwd : props.type === 'editlibrarian' ? ctx.openMenu.editlibrarian : ctx.openMenu.opendelete}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.type === 'studentlist'
                        ? `Are you sure to delete ${props.data?.length} students (All student related data will be deleted)`
                        : props.type === 'borrowedbook' || props.type === 'returnbook' || props.type === 'booklist'
                        ? `Are you sure`
                        : props.type === 'editlibrarian' ? 'Change Librarian Informations' : 'Change Password'}
                </DialogTitle>
                <form onSubmit={(e) => handleDelete(e, student)}>
                    <DialogContent>
                        {
                        props.type === 'editlibrarian' ? (
                            <>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="fullname"
                                    label="NEW FULLNAME"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => handleChange(e , 'librarian')}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="ID"
                                    label="NEW ID CARD"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    onChange={(e) => handleChange(e , 'librarian')}
                                />
                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Old Password</InputLabel>
                                    <OutlinedInput
                                        id="oldpwd"
                                        name="pwd1"
                                        type={showPassword.pwd1 ? 'text' : 'password'}
                                        onChange={(e) => handleChange(e , 'librarian')}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword({ ...showPassword, pwd1: !showPassword.pwd1 })}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword.pwd1 ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                        
                                    />
                                </FormControl>
                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                                    <OutlinedInput
                                        id="newpwd"
                                        type={showPassword.pwd2 ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    id="pwd2"
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword({ ...showPassword, pwd2: !showPassword.pwd2 })}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword.pwd2 ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        onChange={(e) => handleChange(e , 'librarian')}
                                        label="Password"
                                        
                                    />
                                </FormControl>

                            </>
                        )
                        :
                        props.type !== 'password' ? (
                            <></>
                        ) 
                        : 
                        (
                            <>
                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Old Password</InputLabel>
                                    <OutlinedInput
                                        id="oldpwd"
                                        name="pwd1"
                                        type={showPassword.pwd1 ? 'text' : 'password'}
                                        onChange={(e) => handleChange(e, 'pwd')}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword({ ...showPassword, pwd1: !showPassword.pwd1 })}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword.pwd1 ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                        required
                                    />
                                </FormControl>
                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                                    <OutlinedInput
                                        id="newpwd"
                                        type={showPassword.pwd2 ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    id="pwd2"
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword({ ...showPassword, pwd2: !showPassword.pwd2 })}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword.pwd2 ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        onChange={(e) => handleChange(e, 'pwd')}
                                        label="Password"
                                        required
                                    />
                                </FormControl>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" autoFocus>
                            {props.type === 'password' ? 'Change' : props.type === 'editlibrarian' ? 'Confirm' : 'Delete'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function FullScreenDialog(props) {
    const ctx = useContext(Mycontext);
    const [exportdata, setexport] = useState({});
    const [department, setdep] = useState([]);
    const [filter, setfilter] = useState('');
    const navigate = useNavigate();

    const totalCountAndIndividualCounts = props.data
        ?.filter(({ return_date }) => return_date !== null)
        .reduce(
            (result, obj) => {
                const bookCount = obj.Books?.length;
                return {
                    totalCount: result?.totalCount + bookCount
                };
            },
            { totalCount: 0 }
        );
    useEffect(() => {
        getDepartment();
    }, []);
    const getDepartment = () => {
        axios({
            method: 'get',
            url: env.api + 'getdepartment',
            headers: {
                Authorization: `Bearer ${ctx.user.token.accessToken}`
            }
        }).then((res) => setdep(res.data));
    };

    const handleClose = () => {
        if (props.type === 'Create Report') {
            props.setopen(false);
        } else {
            props.setopen({ ...props.open, [`${props.type[0]}${props.index}`]: false });
        }
    };
    function filterDatesByWeeksOrMonths(dates, duration, unit, type) {
        const now = new Date();
        if (type === 'entry') {
            return dates.filter(({ createdAt }) => {
                const date = new Date(createdAt);
                const diffInTime = now.getTime() - date.getTime();

                if (unit === 'weeks') {
                    const diffInWeeks = Math.floor(diffInTime / (1000 * 60 * 60 * 24 * 7));
                    return diffInWeeks <= duration;
                } else if (unit === 'months') {
                    const diffInMonths = now.getMonth() - date.getMonth() + 12 * (now.getFullYear() - date.getFullYear());
                    return diffInMonths <= duration;
                }

                return false;
            });
        } else {
            return dates.filter(({ borrow_date }) => {
                const date = new Date(borrow_date);
                const diffInTime = now.getTime() - date.getTime();

                if (unit === 'weeks') {
                    const diffInWeeks = Math.floor(diffInTime / (1000 * 60 * 60 * 24 * 7));
                    return diffInWeeks <= duration;
                } else if (unit === 'months') {
                    const diffInMonths = now.getMonth() - date.getMonth() + 12 * (now.getFullYear() - date.getFullYear());
                    return diffInMonths <= duration;
                }

                return false;
            });
        }
    }
    const handleChange = (event) => {
        setexport({ ...exportdata, [event.target.name]: event.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        axios({
            method: 'post',
            url: env.api + 'exportpdf',
            headers: {
                Authorization: `Bearer ${ctx.user.token.accessToken}`
            },
            responseType: 'blob',
            data: exportdata
        })
            .then((res) => {
                if (exportdata.filetype === 'pdf') {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${exportdata.name}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                } else {
                    const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    saveAs(blob, `${exportdata.name}.xlsx`);
                }
                e.target.reset();
                toast.success('Export Successfully', { duration: 2000 });
            })
            .catch(() => toast.error('Something Wrong', { duration: 2000 }));
    };

    return (
        <div key={props.index}>
            <Dialog fullScreen open={props.open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar sx={{ position: 'relative', backgroundColor: 'black' }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {props.type}
                        </Typography>
                        {props.type.includes('Borrowed') && (
                            <>
                                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                    Total Books:{' '}
                                    {props.type === 'Borrowed Book'
                                        ? props.data?.length
                                        : props.type === `Borrowed Book for ${props.name}`
                                        ? totalCountAndIndividualCounts?.totalCount
                                        : props.data?.length}
                                </Typography>
                                {props.type.includes('Borrowed Book for') && (
                                    <Typography sx={{ ml: 2, flex: 0.5 }} variant="h6" component="div">
                                        <FormControl fullWidth>
                                            <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                                Filter Entry
                                            </InputLabel>
                                            <NativeSelect
                                                value={filter}
                                                defaultValue={'All'}
                                                onChange={(e) => setfilter(e.target.value)}
                                                inputProps={{
                                                    name: 'age',
                                                    id: 'uncontrolled-native'
                                                }}
                                                style={{ backgroundColor: 'white' }}
                                            >
                                                <option value={''}>All</option>
                                                <option value={'2 weeks'}>past 2 weeks</option>
                                                <option value={'1 months'}>past 1 months</option>
                                                <option value={'3 months'}>past 3 months</option>
                                                <option value={'6 months'}>past 6 months</option>
                                            </NativeSelect>
                                        </FormControl>
                                    </Typography>
                                )}
                            </>
                        )}
                        {props.type.includes('Library Entry') && (
                            <>
                                <Typography sx={{ ml: 2, flex: 0.5 }} variant="h6" component="div">
                                    <FormControl fullWidth>
                                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                            Filter Entry
                                        </InputLabel>
                                        <NativeSelect
                                            value={filter}
                                            defaultValue={'All'}
                                            onChange={(e) => setfilter(e.target.value)}
                                            inputProps={{
                                                name: 'age',
                                                id: 'uncontrolled-native'
                                            }}
                                            style={{ backgroundColor: 'white' }}
                                        >
                                            <option value={''}>All</option>
                                            <option value={'2 weeks'}>past 2 weeks</option>
                                            <option value={'1 months'}>past 1 months</option>
                                            <option value={'3 months'}>past 3 months</option>
                                            <option value={'6 months'}>past 6 months</option>
                                        </NativeSelect>
                                    </FormControl>
                                </Typography>
                                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                    Total Entry: {props.data?.length}
                                </Typography>
                            </>
                        )}
                    </Toolbar>
                </AppBar>
                <List>
                    {props.type === 'Borrowed Book' ? (
                        props.data.map((book) => (
                            <>
                                <ListItem>
                                    <div className="check_book_container">
                                        <img onClick={() => navigate('/book/' + book.title)} src={book.cover_img} alt="cover" />
                                        <div className="book_detail">
                                            <p style={{ fontWeight: '800' }}>{book.title}</p>
                                            <p>{book.categories}</p>
                                            <p>{book.author}</p>
                                            <p>ISBN: {book.ISBN[0].identifier}</p>
                                        </div>
                                    </div>
                                </ListItem>
                                <Divider />
                            </>
                        ))
                    ) : props.type === `Borrowed Book for ${props.name}` ? (
                        (filter !== '' ? filterDatesByWeeksOrMonths(props.data, filter.split(' ')[0], filter.split(' ')[1], 'borrow') : props.data)
                            ?.filter(({ status }) => status !== 'To Pickup')
                            .map((i) => {
                                return i.Books.map((Books) => (
                                    <>
                                        <ListItem>
                                            <div className="check_book_container">
                                                <img onClick={() => navigate('/book/' + Books.title)} src={Books.cover_img} alt="cover" />
                                                <div className="book_detail">
                                                    <p style={{ fontWeight: '800' }}>{Books.title}</p>
                                                    <p>{Books.categories}</p>
                                                    <p>{Books.author}</p>
                                                    <p>ISBN: {Books.ISBN[0].identifier}</p>
                                                    <p>BorrowDate: {new Date(i.borrow_date).toLocaleDateString('en')}</p>
                                                    <p>ReturnDate: {i.return_date && new Date(i.return_date).toLocaleDateString('en')}</p>
                                                </div>
                                            </div>
                                        </ListItem>
                                        <Divider />
                                    </>
                                ));
                            })
                    ) : props.type === 'Create Report' ? (
                        <>
                            <form className="report_form" onSubmit={handleSubmit}>
                                <TextField autoFocus margin="dense" name="name" label="NAME OF REPORT" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <FormControl className="select" fullWidth>
                                    <InputLabel id="demo-simple-select-label">Department</InputLabel>
                                    <Select labelId="demo-simple-select-label" name="department" value={exportdata.department} label="Age" onChange={handleChange}>
                                        {department.map((i) => (
                                            <MenuItem value={i.department}>{i.department}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className="select" fullWidth>
                                    <InputLabel id="demo-simple-select-label">Information</InputLabel>
                                    <Select labelId="demo-simple-select-label" name="information" value={exportdata.information} label="Age" onChange={handleChange}>
                                        <MenuItem value={'entry'}>Library Entry only</MenuItem>
                                        <MenuItem value={'entry&borrow'}>Library Entry and Borrowed Book</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl className="select" fullWidth>
                                    <InputLabel id="demo-simple-select-label">Information Type</InputLabel>
                                    <Select labelId="demo-simple-select-label" name="informationtype" value={exportdata.informationtype} label="Age" onChange={handleChange}>
                                        <MenuItem value={'short'}>Summarize Information</MenuItem>
                                        <MenuItem value={'detail'}>Full Information</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl className="select" fullWidth>
                                    <InputLabel id="demo-simple-select-label">Information Date</InputLabel>
                                    <Select labelId="demo-simple-select-label" name="informationdate" value={exportdata.informationdate} label="Age" onChange={handleChange}>
                                        <MenuItem value={'tweek'}>For Current Week</MenuItem>
                                        <MenuItem value={'2week'}>For Past 2 Weeks</MenuItem>
                                        <MenuItem value={'1month'}>For Past 1 month</MenuItem>
                                        <MenuItem value={'3month'}>For Past 3 months</MenuItem>
                                        <MenuItem value={'6month'}>For Past 6 months</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl className="select" fullWidth>
                                    <InputLabel id="demo-simple-select-label">File type</InputLabel>
                                    <Select labelId="demo-simple-select-label" name="filetype" value={exportdata.filetype} label="Age" onChange={handleChange}>
                                        <MenuItem value={'excel'}>Excel</MenuItem>
                                        <MenuItem value={'pdf'}>PDF</MenuItem>
                                    </Select>
                                </FormControl>

                                <button type="submit">Generate Report</button>
                            </form>
                        </>
                    ) : (
                        (filter !== '' ? filterDatesByWeeksOrMonths(props.data, filter.split(' ')[0], filter.split(' ')[1], 'entry') : props.data)?.map((entry) => (
                            <>
                                <ListItem>
                                    <p className="entry">{new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <i style={{ color: 'red' }} class="fa-solid fa-arrow-right"></i>

                                    <p className="entry"> {entry.entry_date}</p>
                                </ListItem>
                                <Divider />
                            </>
                        ))
                    )}
                </List>
            </Dialog>
        </div>
    );
}
