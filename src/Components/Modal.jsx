import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import '../Style/style.css';
import { TextField } from '@mui/material';
import { Mycontext } from '../Config/context';
import axios from 'axios';
import env, { createBorrowedDatas, createData } from '../env';
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
import { Loading } from './Asset';
import { QrScanner } from '@yudiel/react-qr-scanner';

export default function ResponsiveDialog(props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const handleClose = () => {
        props.setopen(false);
        props.setscan(false);
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
                                    <td>{props.data?.department}</td>
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
                                    <td>
                                        {new Date(props.data?.borrow_date).toLocaleDateString('en')}, {new Date(props.data?.borrow_date).getHours()}:{new Date(props.data?.borrow_date).getMinutes()}:
                                        {new Date(props.data?.borrow_date).getSeconds()}
                                    </td>
                                </tr>
                                <tr>
                                    <th>Expect Return Date</th>
                                    <td>
                                        {new Date(props.data?.expect_return_date).toLocaleDateString('en')}, {new Date(props.data?.expect_return_date).getHours()}:
                                        {new Date(props.data?.expect_return_date).getMinutes()}:{new Date(props.data?.expect_return_date).getSeconds()}
                                    </td>
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
    const ctx = useContext(Mycontext);
    const [scan, setscan] = useState(false);
    const [scan1, setscan1] = useState(false);
    const [type, settype] = useState('scan');
    const [borrowbooked, setborrowbooked] = useState([]);
    const [manually, setmuanlly] = useState('scan');
    const [id, setid] = useState('');
    const [returned, setreturned] = useState([]);
    const [returnedall, setreturnall] = useState([]);
    const ref = useRef(null);
    const [userData, setdata] = useState({
        department: '',
        status: 'available',
        firstname: '',
        lastname: '',
        studentID: '',
        dateofbirth: '',
        email: '',
        phone_number: '',
        faculty: 'No Faculty'
    });

    const fetchdata = (end, data) => {
        return axios({
            method: 'post',
            url: env.api + end,
            headers: {
                Authorization: `Bearer ${ctx.user.token.accessToken}`
            },
            data: data
        });
    };
    useEffect(() => {
        ctx.setloading({ ...ctx.loading, formdialog: false });
        if (props.action === 'edit') {
            const findBook = ctx.book.allbooks.find(({ id }) => id === props.selectedbook[0]);
            setdata(findBook);
        }
    }, [ctx.book.allbooks, props.action, props.selectedbook]);
    const regiterstudent = (e = '', data) => {
        fetchdata('register-student', data)
            .then(() => {
                ctx.setloading({ ...ctx.loading, formdialog: false });
                toast.success('Student Registered', { duration: 2000 });
                ctx.setstudent((prev) => [
                    ...prev,
                    createData(userData.studentID, userData.firstname + ' ' + userData.lastname, userData.department, userData.email, userData.phone_number, 'No Entry')
                ]);
                if (e !== '') {
                    e.target.reset();
                }
                setdata({
                    department: '',
                    firstname: '',
                    lastname: '',
                    studentID: '',
                    dateofbirth: '',
                    email: '',
                    phone_number: ''
                });
            })
            .catch((err) => {
                ctx.setloading({ ...ctx.loading, formdialog: false });

                if (err.response.status === 400) {
                    toast.error('Please Check All Required Informations', { duration: 2000 });
                } else if (err.response.status === 401) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error(err.response.data.message);
                }
            });
    };

    const handleSubmit = (e) => {
        ctx.setloading({ ...ctx.loading, formdialog: true });
        e.preventDefault();
        if (props.type === 'studentlist') {
            if (props.action === 'create') {
                regiterstudent(e, userData);
            } else if (props.action === 'createdp') {
                fetchdata('createdepartment', userData)
                    .then(() => {
                        ctx.setloading({ ...ctx.loading, formdialog: false });
                        toast.success('Department Created', { duration: 2000 });
                        e.target.reset();
                    })
                    .catch(() => {
                        ctx.setloading({ ...ctx.loading, formdialog: false });
                        toast.error('Error Occured', { duration: 2000 });
                    });
            } else if (props.action === 'deteledp') {
                fetchdata('deletedepartment', userData).then(() => {
                    ctx.setloading({ ...ctx.loading, formdialog: false });
                    window.location.reload();
                });
            }
        } else if (props.type === 'HD') {
            fetchdata('register-HD', userData)
                .then(() => {
                    ctx.setloading({ ...ctx.loading, formdialog: false });
                    toast.success('Headdepartment Registered', { duration: 2000 });
                    e.target.reset();
                })
                .catch((err) => {
                    ctx.setloading({ ...ctx.loading, formdialog: false });
                    if (err.response.status === 400) {
                        toast.error('Please Check All Required Informations', { duration: 2000 });
                    } else if (err.response.status === 401) {
                        toast.error(err.response.data.message);
                    } else {
                        toast.error('Opps! Something Wrong');
                    }
                });
        } else if (props.type === 'booklist') {
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
                        ctx.setloading({ ...ctx.loading, formdialog: false });
                        toast.success('Book Created', { duration: 2000 });
                        ctx.setbook((prev) => ({ ...prev, allbooks: [...prev.allbooks, userData] }));
                        e.target.reset();
                    })
                    .catch((err) => {
                        ctx.setloading({ ...ctx.loading, formdialog: false });
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
                        ctx.setloading({ ...ctx.loading, formdialog: false });
                        e.target.reset();
                        ctx.setbook((prev) => ({ ...prev, allbooks: [...prev.allbooks, userData] }));
                        toast.success('Book Updated', { duration: 2000 });
                    })
                    .catch((err) => {
                        ctx.setloading({ ...ctx.loading, formdialog: false });
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
        } else if (event.target.name === 'author' || event.target.name === 'categories') {
            setdata({ ...userData, [event.target.name]: [event.target.value] });
        } else {
            setdata({ ...userData, [event.target.name]: event.target.value });
        }
    };

    const handleClose = () => {
        ctx.setMenu({ ...ctx.openMenu, [props.type]: false });
    };
    const fetchstudent = async (url) => {
        let data = {};
        const id = url.replace('https://my.paragoniu.edu.kh/qr?student_id=', '');

        const response = await axios({
            method: 'post',
            url: env.api + 'getstudentapi',
            data: {
                id: id
            },
            headers: {
                Authorization: `Bearer ${ctx.user.token.accessToken}`
            }
        });
        const info = response.data;

        if (info) {
            ctx.setloading({ ...ctx.loading, formdialog: false });
            data = {
                firstname: info.name.split(' ')[0],
                lastname: info.name.split(' ')[1],
                studentID: info.id_number,
                dateofbirth: null,
                department: info.department.replace('Department of ', ''),
                faculty: info.faculty,
                phone_number: null
            };
        }

        setdata(data);
        settype('!scan');
    };
    const Options = () => {
        return (
            <FormControl sx={{ m: 1, width: 300}}>
                <InputLabel id="demo-multiple-checkbox-label">TYPE</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    value={type}
                    onChange={(e) => {
                        settype(e.target.value);
                        setscan(false);
                    }}
                    input={<OutlinedInput label="TYPE" />}
                    fullWidth
                >
                    <MenuItem value="scan">SCAN</MenuItem>
                    <MenuItem value="!scan">MANUALLY</MenuItem>
                </Select>
            </FormControl>
        );
    };

    const onNewScanResult = (data) => {
        ctx.setloading({ ...ctx.loading, formdialog: true });
        if (props.type === 'studentlist' && props.action === 'create') {
            if (data.includes('https://my.paragoniu.edu.kh/qr?student_id=')) {
                setscan(true);
                fetchstudent(data);
            } else {
                setscan(true);
                toast.error('INVALID QR CODE', { duration: 2000 });
                ctx.setloading({ ...ctx.loading, formdialog: false });
            }
        } else if (props.type === 'returnbook' && !scan1) {
            let id = '';
            if (data.includes('https://my.paragoniu.edu.kh/qr?student_id=')) {
                id = data.replace('https://my.paragoniu.edu.kh/qr?student_id=', '');
            } else {
                id = data;
            }
            getborrow(id);
            setscan1(true);
        }
    };
    const getborrow = (id) => {
        axios({
            method: 'get',
            url: env.api + 'getborrow_book',
            headers: {
                Authorization: `Bearer ${ctx.user.token.accessToken}`
            }
        }).then((res) => {
            const data = res.data;
            let borrowbook = [];
            data?.map((i) => borrowbook.push(createBorrowedDatas(i.borrow_id, i.student, i.Books, i.status, i.borrow_date, i.return_date, i.expect_return_date, i.qrcode)));
            borrowbook = borrowbook.filter((i) => i.student.studentID === id && i.status !== 'To Pickup');
            if (borrowbook.length === 0) {
                toast.error('No Borrowed Books Found', { duration: 2000 });
            }
            setborrowbooked(borrowbook);
            ctx.setloading({ ...ctx.loading, formdialog: false });
        });
    };
    const handleError = (err) => {};

    const handlereturn = (e, borrowid, ISBN) => {
        const borrowdata = [...borrowbooked];
        e.preventDefault();
        const data = {
            borrowid,
            ISBN
        };

        let bookdata = borrowdata.map((i) => {
            if (i.borrowid === borrowid) {
                i.bookdetail.map((j) => {
                    if (j.ISBN === data.ISBN) {
                        j.status = 'available';
                        setreturned((prev) => [...prev, j.id]);
                    }
                });
            }
            return i;
        });

        setborrowbooked(bookdata);
    };
    useEffect(() => {}, []);
    const handleConfirm = (e) => {
        ctx.setloading({ ...ctx.loading, formdialog: true });
        e.preventDefault();

        axios({
            method: 'POST',
            url: env.api + 'ir',
            headers: {
                Authorization: `Bearer ${ctx.user.token.accessToken}`
            },
            data: {
                borrowbooked: borrowbooked
            }
        })
            .then((res) => {
                ctx.setloading({ ...ctx.loading, formdialog: false });
                toast.success('Return Successfully', { duration: 2000 });
                const data = res.data;
                let borrowbook = [];
                data?.map((i) => borrowbook.push(createBorrowedDatas(i.borrow_id, i.student, i.Books, i.status, i.borrow_date, i.return_date, i.expect_return_date, i.qrcode)));
                ctx.setborrowedrequest(borrowbook);
            })
            .catch((err) => {
                ctx.setloading({ ...ctx.loading, formdialog: false });
                toast.error(err.response.data.message, { duration: 2000 });
            });
    };

    return (
        <div ref={ref}>
            <Dialog open={ctx.openMenu[props.type]} onClose={handleClose}>
                <DialogTitle>
                    {' '}
                    {props.type === 'studentlist' ? (
                        props.action === 'create' ? (
                            'REGISTER STUDENT'
                        ) : props.action === 'createdp' ? (
                            <>
                                <h1>CREATE DEPARTMENT</h1>
                            </>
                        ) : (
                            <h1>DETELET DEPARTMENT</h1>
                        )
                    ) : props.type === 'HD' ? (
                        'REGISTER HEADDEPARTMENT'
                    ) : (
                        `${props.action === 'create' ? 'Register Book' : props.type === 'department' ? 'CREATE DEPARTMENT' : props.type === 'returnbook' ? 'Scan To Return' : 'Edit Book'}`
                    )}{' '}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    {ctx.loading.formdialog && <Loading />}
                    <DialogContent>
                        {props.type === 'studentlist' && props.action === 'create' ? (
                            <>
                                <div style={{position:'relative' , left:"50%" ,transform:"translate(-33%,0)"}}>
                                <Options />
                                </div>

                                {type === '!scan' ? (
                                    <>
                                        <DialogContentText>Please Fill in with relevant information</DialogContentText>{' '}
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            value={userData.firstname}
                                            name="firstname"
                                            label="Firstname"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            required
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            value={userData.lastname}
                                            name="lastname"
                                            label="Lastname"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            required
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            value={userData.email}
                                            name="email"
                                            label="Email"
                                            type="email"
                                            fullWidth
                                            variant="standard"
                                            required
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            value={userData.studentID}
                                            name="studentID"
                                            label="StudentID"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            required
                                            onChange={handleChange}
                                        />
                                        <FormControl variant="standard" className="select" fullWidth>
                                            <InputLabel id="demo-simple-select-label">Department</InputLabel>
                                            <Select id="department" value={userData.department} name="department" label="department" onChange={handleChange}>
                                                {ctx.dep?.map((i) => (
                                                    <MenuItem value={i?.department}>{i?.department}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            value={userData.phone_number}
                                            name="phone_number"
                                            label="Phone Number (optional)"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            onChange={handleChange}
                                        />
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
                                ) : (
                                    <>
                                        {!scan && (
                                            <div className="qrcode_reader" style={{ width: '500px' }}>
                                                <QrScanner onDecode={onNewScanResult} onError={handleError} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        ) : props.type === 'HD' ? (
                            <>
                                <TextField autoFocus margin="dense" name="firstname" label="FIRSTNAME" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" name="lastname" label="LASTNAME" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" name="ID" label="ID CARD" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <FormControl variant="standard" className="select" fullWidth>
                                    <InputLabel id="demo-simple-select-label">Department</InputLabel>
                                    <Select labelId="demo-simple-select-label" name="department" value={userData.department} label="department" onChange={handleChange}>
                                        {ctx.dep?.map((i) => (
                                            <MenuItem value={i?.department}>{i?.department}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField autoFocus margin="dense" name="email" label="EMAIL" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" name="phone_number" label="PHONENUMBER" type="text" fullWidth variant="standard" required onChange={handleChange} />
                            </>
                        ) : props.type === 'studentlist' && props.action === 'createdp' ? (
                            <>
                                <TextField autoFocus margin="dense" name="faculty" label="FACULTY" type="text" fullWidth variant="standard" required onChange={handleChange} />
                                <TextField autoFocus margin="dense" name="department" label="DEPARTMENT" type="text" fullWidth variant="standard" required onChange={handleChange} />
                            </>
                        ) : props.type === 'studentlist' && props.action === 'deteledp' ? (
                            <>
                                <FormControl variant="standard" className="select" fullWidth>
                                    <InputLabel id="demo-simple-select-label">DEPARTMENT</InputLabel>
                                    <Select labelId="demo-simple-select-label" name="department" value={userData.department} label="department" onChange={handleChange}>
                                        {ctx.dep?.map((i) => (
                                            <MenuItem value={i?.department}>{i?.department}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        ) : props.type === 'returnbook' ? (
                            <>
                                {!scan1 ? (
                                    <>
                                        <FormControl sx={{ m: 1, width: 300 }}>
                                            <InputLabel id="demo-multiple-name-label">Type</InputLabel>
                                            <Select
                                                labelId="demo-multiple-name-label"
                                                id="demo-multiple-name"
                                                value={manually}
                                                onChange={(e) => setmuanlly(e.target.value)}
                                                label="Type"
                                                input={<OutlinedInput label="Type" />}
                                            >
                                                <MenuItem value={'scan'}>Scan</MenuItem>
                                                <MenuItem value={'input'}>Manually</MenuItem>
                                            </Select>
                                        </FormControl>
                                        {manually === 'input' ? (
                                            <form className="return_manually">
                                                {scan1 && <Loading />}
                                                <TextField type="text" placeholder="Student ID" name="studentid" onChange={(e) => setid(e.target.value)} required fullWidth />
                                                <Button
                                                    type="action"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        onNewScanResult(id);
                                                    }}
                                                    className="enter-btn"
                                                    variant="contained"
                                                >
                                                    ENTER
                                                </Button>
                                            </form>
                                        ) : (
                                            <>
                                                <h1 style={{ fontSize: 'medium', fontWeight: '700', color: 'red' }}>Please place student ID QR Code In the RED BOX</h1>
                                                <div className="qrcode_reader" style={{ width: '500px' }}>
                                                    <QrScanner onDecode={onNewScanResult} onError={handleError} />
                                                </div>{' '}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {' '}
                                        {borrowbooked
                                            ?.filter((f) => !f.bookdetail.every(({ status }) => status === 'available'))
                                            .map((i, index) => (
                                                <div key={index} className="returnbook_table">
                                                    <div className="detail_section">
                                                        <h3>Borrow ID: </h3>

                                                        <h3>StudentID: </h3>

                                                        <h3>Fullname: </h3>
                                                        <h3>Borrow Date: </h3>
                                                        <h3>Expect Return Date: </h3>
                                                        <h3>Total Books: </h3>
                                                    </div>
                                                    <div className="info_section">
                                                        <h3>{i.borrowid}</h3>
                                                        <h3>{i.student.studentID}</h3>
                                                        <h3>{i.student.firstname + ' ' + i.student.lastname}</h3>
                                                        <h3>
                                                            {new Date(i.borrowdate).toLocaleDateString('en')}, {new Date(i.borrowdate).getHours()}:{new Date(i.borrowdate).getMinutes()}:
                                                            {new Date(i.borrowdate).getSeconds()}
                                                        </h3>
                                                        <h3>
                                                            {new Date(i.expectreturndate).toLocaleDateString('en')}, {new Date(i.expectreturndate).getHours()}:
                                                            {new Date(i.expectreturndate).getMinutes()}:{new Date(i.expectreturndate).getSeconds()}
                                                        </h3>
                                                        <h3 style={{ marginLeft: '100px', marginBottom: '50px' }}>{i.bookdetail.length}</h3>
                                                        <div className="book_row">
                                                            {i.bookdetail
                                                                .filter(({ status }) => status !== 'available')
                                                                .map((j) => (
                                                                    <div className="book_card">
                                                                        <img src={j.cover_img} alt="book_cover" />
                                                                        <div className="bookcard_detail">
                                                                            <h3>ISBN: {j?.ISBN[0]?.identifier}</h3>
                                                                            <h3>Title : {j.title}</h3>

                                                                            <button className="return-btn" onClick={(e) => handlereturn(e, i.borrowid, j.ISBN)}>
                                                                                Return
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </>
                                )}
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
                                    InputLabelProps={{ shrink: true }}
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
                                    InputLabelProps={{ shrink: true }}
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
                                    InputLabelProps={{ shrink: true }}
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
                                    InputLabelProps={{ shrink: true }}
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
                                    InputLabelProps={{ shrink: true }}
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
                                    InputLabelProps={{ shrink: true }}
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        {props.type === 'booklist' &&  <Button type='submit'>
                                CONFIRM
                            </Button>}
                        {scan && (
                            <Button
                                onClick={() => {
                                    settype('scan');
                                    setscan(false);
                                }}
                            >
                                Restart
                            </Button>
                        )}
                        {type === '!scan' && <Button type="submit">{props.action === 'deteledp' ? 'DELETE' : 'REGSITER'}</Button>}
                        {props.action === 'deteledp' && <Button type="submit">DELETE</Button>}
                        {scan1 && (
                            <Button
                                type="submit"
                                onClick={() => {
                                    setscan1(false);
                                    setreturned([]);
                                }}
                            >
                                BACK
                            </Button>
                        )}
                        {(returned.length > 0 || returnedall.length > 0) && (
                            <>
                                <Button onClick={handleConfirm} type="submit">
                                    CONFIRM
                                </Button>
                                <Button
                                    type="submit"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        let resetbook;
                                        if (returned.length > 0) {
                                            resetbook = borrowbooked.map((i) => {
                                                i.bookdetail.map((j) => {
                                                    returned.map((k) => {
                                                        if (k === j.id) {
                                                            j.status = 'unavailable';
                                                        }
                                                    });
                                                });
                                                return i;
                                            });
                                            setreturned([]);
                                        } else if (returnedall.length > 0) {
                                            resetbook = borrowbooked?.map((i) => {
                                                returnedall.map((j) => {
                                                    if (i.borrowid === j) {
                                                        i.bookdetail.map((k) => (k.status = 'unvailable'));
                                                    }
                                                });
                                                return i;
                                            });
                                            setreturnall([]);
                                        }
                                        setborrowbooked(resetbook);
                                    }}
                                >
                                    RESET
                                </Button>
                            </>
                        )}
                        {props.type === 'studentlist' && props.action === 'createdp' && <Button type="submit">ADD</Button>}
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export function DeleteDialog(props) {
    const ctx = useContext(Mycontext);

    const [student, setstudent] = useState('');
    const [libraiandata, setlibrarian] = useState({
        id: ctx.user.user.id,
        fullname: '',
        oldpwd: '',
        newpwd: '',
        ID: ''
    });
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
            setlibrarian({ ...libraiandata, [e.target.id]: e.target.value });
        } else {
            setpassword({ ...password, [e.target.id]: e.target.value });
        }
    };
    const handleClose = () => {
        if (props.type === 'password') {
            ctx.setMenu({ ...ctx.openMenu, openchangepwd: false });
        } else if (props.type === 'editlibrarian') {
            ctx.setMenu({ ...ctx.openMenu, editlibrarian: false });
        } else {
            ctx.setMenu({ ...ctx.openMenu, opendelete: false });
        }
    };
    const handleDelete = (e, id) => {
        e.preventDefault();
        ctx.setloading({ ...ctx.loading, delete: true });
        if (props.type === 'studentlist') {
            axios({
                method: 'post',
                url: env.api + `deletestudent`,
                data: { id: props.data },
                headers: {
                    Authorization: `Bearer ${ctx.user.token.accessToken}`
                }
            })
                .then(() => {
                    ctx.setloading({ ...ctx.loading, delete: false });
                    window.location.reload();
                })
                .catch(() => {
                    ctx.setloading({ ...ctx.loading, delete: false });
                    toast.error('Something Wrong', { duration: 2000 });
                });
        } else if (props.type === 'borrowedbook') {
            axios({
                method: 'post',
                url: env.api + 'delete_borrow',
                headers: {
                    Authorization: `Bearer ${ctx.user.token.accessToken}`
                },
                data: { id: props.data }
            })
                .then(() => {
                    ctx.setloading({ ...ctx.loading, delete: false });
                    window.location.reload();
                })
                .catch(() => {
                    ctx.setloading({ ...ctx.loading, delete: false });
                    toast.error('Something Wrong', { duration: 2000 });
                });
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
            })
                .then(() => {
                    ctx.setloading({ ...ctx.loading, delete: false });
                    window.location.reload();
                })
                .catch(() => {
                    ctx.setloading({ ...ctx.loading, delete: false });
                    toast.error('Something Wrong', { duration: 2000 });
                });
        } else if (props.type === 'editlibrarian') {
            axios({
                method: 'POST',
                url: env.api + 'editlibrarian',
                headers: {
                    Authorization: `Bearer ${ctx.user.token.accessToken}`
                },
                data: libraiandata
            })
                .then(() => {
                    ctx.setloading({ ...ctx.loading, delete: false });
                    toast.success('Change Successfully', { duration: 2000 });
                    if (libraiandata.ID !== '' && libraiandata.fullname !== '') {
                        ctx.user.user.fullname = libraiandata.fullname;
                        ctx.user.user.ID = libraiandata.ID;
                        Cookies.set('user', JSON.stringify(ctx.user), { expires: 7 });
                    } else if (libraiandata.fullname !== '') {
                        ctx.user.user.fullname = libraiandata.fullname;
                        Cookies.set('user', JSON.stringify(ctx.user), { expires: 7 });
                    } else if (libraiandata.ID !== '') {
                        ctx.user.user.ID = libraiandata.ID;
                        Cookies.set('user', JSON.stringify(ctx.user), { expires: 7 });
                    }
                    e.target.reset();
                })
                .catch((err) => {
                    ctx.setloading({ ...ctx.loading, delete: false });
                    toast.error('Something Wrong', { duration: 2000 });
                });
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
                    ctx.setloading({ ...ctx.loading, delete: false });
                    toast.success(res.data.message, { duration: 2000 });
                    e.target.reset();
                })
                .catch((err) => {
                    ctx.setloading({ ...ctx.loading, delete: false });
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
                        : props.type === 'editlibrarian'
                        ? 'Change Librarian Informations'
                        : 'Change Password'}
                </DialogTitle>
                <form onSubmit={(e) => handleDelete(e, student)}>
                    {ctx.loading.delete && <Loading />}
                    <DialogContent>
                        {props.type === 'editlibrarian' ? (
                            <>
                                <TextField autoFocus margin="dense" id="fullname" label="NEW FULLNAME" type="text" fullWidth variant="standard" onChange={(e) => handleChange(e, 'librarian')} />
                                <TextField autoFocus margin="dense" id="ID" label="NEW ID CARD" type="text" fullWidth variant="standard" onChange={(e) => handleChange(e, 'librarian')} />
                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Old Password</InputLabel>
                                    <OutlinedInput
                                        id="oldpwd"
                                        name="pwd1"
                                        type={showPassword.pwd1 ? 'text' : 'password'}
                                        onChange={(e) => handleChange(e, 'librarian')}
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
                                        onChange={(e) => handleChange(e, 'librarian')}
                                        label="Password"
                                    />
                                </FormControl>
                            </>
                        ) : props.type !== 'password' ? (
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
    const [filter, setfilter] = useState('');
    
    const navigate = useNavigate();

    const totalCountAndIndividualCounts = props?.data
        ?.filter(({ status }) => status !== 'To Pickup')
        .reduce(
            (result, obj) => {
                const bookCount = obj.Books?.length;
                return {
                    totalCount: result?.totalCount + bookCount
                };
            },
            { totalCount: 0 }
        );
    const handleClose = () => {
        if (props.type === 'Create Report') {
            props.setopen(false);
        } else {
            props.setopen({ ...props.open, [`${props.type[0]}${props.index}`]: false });
        }
    };
    function filterDatesByWeeksOrMonths(dates, duration, unit, type) {
        const today = new Date();
        let startDate;

        if (unit === 'weeks') {
            startDate = new Date(today.getTime() - duration * 7 * 24 * 60 * 60 * 1000);
        } else if (unit === 'months') {
            startDate = new Date(today.getTime());
            startDate.setMonth(startDate.getMonth() - duration);
        } else {
            return [];
        }

        return dates.filter(({ createdAt }) => new Date(createdAt) <= startDate);
    }
    const handleChange = (event) => {
        setexport({ ...exportdata, [event.target.name]: event.target.value });
    };
    const handleSubmit = (e) => {
        ctx.setloading({ ...ctx.loading, report: true });
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
                ctx.setloading({ ...ctx.loading, report: false });
                const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, `${exportdata.name}.xlsx`);
                e.target.reset();
                toast.success('Export Successfully', { duration: 2000 });
            })
            .catch((err) => {
                ctx.setloading({ ...ctx.loading, report: false });
                if (err.response.status === 500) {
                    toast.error('An Error Occured', { duration: 2000 });
                } else {
                    toast.error('Students not found', { duration: 2000 });
                }
            });
    };
    const returndateformat = (date) => {
        let d = new Date(date);
        let formated = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}, ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        return formated;
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
                       {props.type === (`Borrowed Book for ${props.name}`) ?   <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Total: {totalCountAndIndividualCounts?.totalCount}
                        </Typography> : props.type === 'Create Report' ? '' : <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Total: {props?.data?.length}
                        </Typography> }
                        
                    </Toolbar>
                   
                 
                    
                </AppBar>
                <List>
                    {props.type === 'Borrowed Book' ? (
                        props?.data?.map((book) => (
                            <>
                                <ListItem>
                                    <div className="check_book_container">
                                        <img onClick={() => navigate('/book/' + book.title)} src={book.cover_img} alt="cover" />
                                        <div className="book_detail">
                                            <p style={{ fontWeight: '800' }}>{book.title}</p>
                                            <p>{book.categories}</p>
                                            <p>{book.author}</p>
                                            <p>ISBN: {book.ISBN[0].identifier}</p>
                                            <p>Status: {book.return_status ? book.return_status : 'Not Yet Return'}</p>
                                            <p>Return Date: {book.return_date ? returndateformat(book.return_date) : 'No Return Date'}</p>
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
                                                    <p>Status: {Books.return_status ? Books.return_status : 'Not Yet Return'}</p>
                                                    <p>BorrowDate: {new Date(i.borrow_date).toLocaleDateString('en')}</p>
                                                    <p>Return Date: {Books.return_date ? returndateformat(Books.return_date) : 'No Return Date'}</p>
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
                                {ctx.loading.report && <Loading />}
                                <TextField autoFocus margin="dense" name="name" label="NAME OF REPORT" type="text" fullWidth variant="standard" required onChange={handleChange} />

                                <FormControl className="select" fullWidth>
                                    <InputLabel id="demo-simple-select-label">Department</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        name="department"
                                        value={exportdata.department}
                                        label="Age"
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Department" />}
                                    >
                                        <MenuItem value={'all'}>All</MenuItem>
                                        {ctx.dep.map((i) => (
                                            <MenuItem value={i.department}>{i.department}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl className="select" fullWidth>
                                    <InputLabel id="demo-simple-select-label">Information</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        name="information"
                                        value={exportdata.information}
                                        label="Age"
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Information" />}
                                    >
                                        <MenuItem value={'entry'}>Library Entry only</MenuItem>
                                        <MenuItem value={'entry&borrow'}>Library Entry and Borrowed Book</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl className="select" fullWidth>
                                    <InputLabel id="demo-simple-select-label">Information Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        name="informationtype"
                                        value={exportdata.informationtype}
                                        label="Age"
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Information Type" />}
                                    >
                                        <MenuItem value={'short'}>Summarize Information</MenuItem>
                                        <MenuItem value={'detail'}>Full Information</MenuItem>
                                    </Select>
                                </FormControl>
                    
                                <div className='date_range'>
                                <label htmlFor="">Start Date
                                <TextField type='date' name='startdate' onChange={handleChange} required fullWidth/>
                                </label>
                                <label htmlFor="">End Date
                                <TextField type='date' name='enddate' onChange={handleChange} required fullWidth/>
                                </label>
                                
                                </div>
                                

                                <button type="submit">Export Report</button>
                            </form>
                        </>
                    ) : (
                        (filter !== '' ? filterDatesByWeeksOrMonths(props.data, filter.split(' ')[0], filter.split(' ')[1], 'entry') : props.data)?.map((entry) => (
                            <>
                                <ListItem>
                                    <p className="entry">{new Date(entry.entry_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <i style={{ color: 'red' }} class="fa-solid fa-arrow-right"></i>

                                    <p className="entry">
                                        {' '}
                                        {new Date(entry.entry_date).getDate()}/{new Date(entry.entry_date).getMonth() + 1}/{new Date(entry.entry_date).getFullYear()}{' '}
                                        {new Date(entry.entry_date).getHours()}:{new Date(entry.entry_date).getMinutes().toString().padStart(2, '0')}:
                                        {new Date(entry.entry_date).getSeconds().toString().padStart(2, '0')}
                                    </p>
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
