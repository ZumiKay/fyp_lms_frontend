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
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import InputAdornment from '@mui/material/InputAdornment';
import { setimage } from './Asset';
import { useNavigate } from 'react-router-dom';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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
                                    <td>{props.data?.borrow_date}</td>
                                </tr>
                                <tr>
                                    <th>Expect Return Date</th>
                                    <td>{props.data?.expect_return_date}</td>
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
    const [userData, setdata] = useState({});
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
            fetchdata('register-HD').then(() => {
                toast.success("Headdepartment Registered" , {duration: 2000});
                e.target.reset()
            }).catch((err) => {
                if (err.response.status === 400) {
                    toast.error('Please Check All Required Informations', { duration: 2000 });
                } else if (err.response.status === 401) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error('Opps! Something Wrong');
                }
            } )
        } else {
            fetchdata('createbook')
                .then(() => {
                    ctx.setbook((prev) => [...prev, userData]);
                    toast.success('Book Created', { duration: 2000 });
                    e.target.reset();
                })
                .catch((err) => {
                    if (err.response.status === 400) {
                        toast.error('Please Check All Required Input');
                    } else {
                        toast.error('Opps! Something Broke');
                    }
                });
        }
    };
    const handleChange = (e) => {
        setdata({ ...userData, [e.target.id]: e.target.value });
    };

    const handleClose = () => {
        setOpen(false);
        ctx.setMenu({ ...ctx.openMenu, [props.type]: false });
    };

    return (
        <div>
            <Dialog open={ctx.openMenu[props.type]} onClose={handleClose}>
                <DialogTitle>
                    {' '}
                    {props.type === 'studentlist' ? `${props.action === 'create' ? 'Register Student' : 'Edit Student'}` : props.type === 'HD' ? 'REGISTER HEADDEPARTMENT' :  `${props.action === 'create' ? 'Register Book' : 'Edit Book'}`}{' '}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <DialogContentText>Please Fill in with relevant information</DialogContentText>

                        {props.type === 'studentlist' ? (
                            <>
                                {' '}
                                <TextField autoFocus margin="dense" id="firstname" label="Firstname" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" id="lastname" label="Lastname" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" id="email" label="Email" type="email" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" id="studentID" label="StudentID" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" id="department" label="Department" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" id="phone_number" label="Phone Number" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="dateofbirth"
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
                                <TextField autoFocus margin="dense" id="firstname" label="FIRSTNAME" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" id="lastname" label="LASTNAME" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" id="ID" label="ID CARD" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" id="department" label="DEPARTEMENT" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" id="email" label="EMAIL" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" id="phone_number" label="PHONENUMBER" type="text" fullWidth variant="standard" required onChange={handleChange} />
                            </>
                        ) : (
                            <>
                                <TextField autoFocus margin="dense" id="ISBN" label="ISBN CODE" type="text" fullWidth variant="standard" onChange={handleChange} required />
                                <TextField autoFocus margin="dense" id="cover_img" label="Book Cover (Please Input URL of Image)" type="text" fullWidth variant="standard" onChange={handleChange} />
                                <TextField autoFocus margin="dense" id="title" label="Title" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" id="author" label="Author" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="categories"
                                    label="Categories"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    placeholder="Action & Logic"
                                    required
                                    onChange={handleChange}
                                />
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="publisher_date"
                                    label="PublisherDate"
                                    type="date"
                                    fullWidth
                                    variant="standard"
                                    required
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField autoFocus margin="dense" id="description" label="Description" type="text" fullWidth variant="standard" onChange={handleChange} />
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
        } else {
            setpassword({ ...password, [e.target.id]: e.target.value });
        }
    };
    const handleClose = () => {
        if (props.type === 'password') {
            ctx.setMenu({ ...ctx.openMenu, openchangepwd: false });
        } else {
            ctx.setMenu({ ...ctx.openMenu, opendelete: false });
        }
    };
    const handleDelete = (e, id) => {
        e.preventDefault();
        if (props.type === 'studentlist') {
            if (id !== '') {
                axios({
                    method: 'post',
                    url: env.api + `deletestudent`,
                    data: { id: props.data },
                    headers: { ...env.header }
                }).then(() => window.location.reload());
            } else {
                toast.error('Please input ID', { duration: 2000 });
            }
        } else if (props.type === 'borrowedbook') {
            axios({
                method: 'post',
                url: env.api + 'delete_borrow',
                headers: {
                    Authorization: `Bearer ${ctx.user.token.accessToken}`
                },
                data: { id: props.data }
            }).then(() => window.location.reload());
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
                open={props.type === 'password' ? ctx.openMenu.openchangepwd : ctx.openMenu.opendelete}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.type === 'studentlist'
                        ? `Are you sure to delete ${props.data?.length} students (All student related data will be deleted)`
                        : props.type === 'borrowedbook' || props.type === 'returnbook'
                        ? `Are you sure`
                        : 'Change Password'}
                </DialogTitle>
                <form onSubmit={(e) => handleDelete(e, student)}>
                    <DialogContent>
                        {props.type !== 'password' ? (
                            <></>
                        ) : (
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
                            {props.type === 'password' ? 'Change' : 'Delete'}
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
    const [count, setcount] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        console.log(props.data);
    }, []);
    const totalCountAndIndividualCounts = props.data?.reduce(
        (result, obj) => {
            const bookCount = obj.Books?.length;
            return {
                totalCount: result.totalCount + bookCount
            };
        },
        { totalCount: 0 }
    );

    const handleClose = () => {
        props.setopen({ ...props.open, [`${props.type[0]}${props.index}`]: false });
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
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Total Books:{' '}
                                {props.type === 'Borrowed Book' ? props.data?.length : props.type === `Borrowed Book for ${props.name}` ? totalCountAndIndividualCounts.totalCount : props.data?.length}
                            </Typography>
                        )}
                    </Toolbar>
                </AppBar>
                <List>
                    {props.type === 'Borrowed Book'
                        ? props.data.map((book) => (
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
                        : props.type === `Borrowed Book for ${props.name}`
                        ? props.data?.map((i) => {
                              console.log(i);
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
                        : props.data?.map((entry) => (
                              <>
                                  <ListItem>
                                      <p className="entry">{new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                      <i style={{ color: 'red' }} class="fa-solid fa-arrow-right"></i>

                                      <p className="entry"> {entry.entry_date}</p>
                                  </ListItem>
                                  <Divider />
                              </>
                          ))}
                </List>
            </Dialog>
        </div>
    );
}
