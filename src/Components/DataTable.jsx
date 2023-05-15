import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import '../Style/style.css';
import { Mycontext } from '../Config/context';
import { DeleteDialog, FormDialog, FullScreenDialog } from './Modal';
import env from '../env';

const columns = [
    { id: 'studentID', label: 'ID', minWidth: 100 },
    { id: 'fullname', label: 'Fullname', minWidth: 100 },
    { id: 'department', label: 'Department', minWidth: 100 },
    { id: 'email', label: 'Email', minWidth: 100 },
    {
        id: 'phoneNumber',
        label: 'Phone Number',
        minWidth: 100,
        align: 'right'
    },
    {
        id: 'libraryentry',
        label: 'Library Visit',
        minWidth: 170,
        align: 'right'
    },
    {
        id: 'borrowedbook',
        label: 'Borrowed Book',
        minWidth: 170,
        align: 'right'
    }
];
const bookcolumns = [
    { id: 'cover_img', label: 'Cover', minWidth: 170 },
    { id: 'title', label: 'Title', minWidth: 80 },
    { id: 'ISBN', label: 'ISBN', minWidth: 80 },
    { id: 'categories', label: 'Categories', minWidth: 80 },
    { id: 'status', label: 'Status', minWidth: 80 }
];
const borrowbookcolumns = [
    { id: 'borrowid', label: 'BorrowID', minWidth: 170 },
    { id: 'student', label: 'Borrower', minWidth: 100 },
    { id: 'bookdetail', label: 'Books', minWidth: 170 },
    { id: 'status', label: 'Status', minWidth: 170 },
    { id: 'borrowdate', label: 'Borrow Date', minWidth: 170 },
    { id: 'returndate', label: 'Return Date', minWidth: 170 },
    { id: 'expectreturndate', label: 'Expect Return Date', minWidth: 170 },
    { id: 'qrcode', label: 'QR CODE', minWidth: 200 }
];

export default function DataTable(props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const ctx = React.useContext(Mycontext);
    const [selected, setSelected] = React.useState([]);
    const [searchvalue, setsearch] = React.useState('');
    const [filterdata, setfilter] = React.useState([]);
    const [openfullscreen, setfullscreen] = React.useState({});
    const isSelected = (name) => selected.indexOf(name) !== -1;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected =
                props.type === 'studentlist' ? props.data.map((i) => i.studentID) : props.type === 'borrowedbook' ? props.data.map((i) => i.borrowid) : props.data.map((i) => i.ISBN[0].identifier);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleSearch = () => {
        let filter = [];
        if (props.type === 'studentlist') {
            filter = props.data?.filter((stu) => {
                let deparment = stu.department.replace(/\s+/g, '');
                if (stu.studentID.includes(searchvalue)) {
                    return stu;
                } else if (stu.fullname.replace(/\s+/g, '').toLowerCase().includes(searchvalue)) {
                    return stu;
                } else if (stu.email.replace(/\s+/g, '').includes(searchvalue)) return stu;
                else if (stu.phoneNumber.toString().includes(searchvalue)) return stu;
                else if (deparment.toLowerCase().includes(searchvalue)) return stu;
            });
        }
        if (props.type === 'borrowedbook') {
            filter = props.data?.filter((book) => {
                let fullname = book.student?.lastname + book.student?.firstname;
                if (book.borrowid.includes(searchvalue)) {
                    return book;
                } else if (book.student.studentID.includes(searchvalue)) {
                    return book;
                } else if (book.borrowdate.toString().includes(searchvalue)) {
                    return book;
                } else if (book.returndate?.toString().includes(searchvalue)) {
                    return book;
                } else if (fullname.replace(/\s+/g, '').toLowerCase().includes(searchvalue)) return book;
                else if (book.student.phone_number.toString().includes(searchvalue)) return book;
            });
        }
        setfilter(filter);
    };

    React.useEffect(() => {
        handleSearch();
        console.log(searchvalue);
    }, [searchvalue]);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }} className="datatable_container">
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" colSpan={3}>
                                <input type="text" className="search_input" placeholder="Search" onChange={(e) => setsearch(e.target.value.replace(/\s+/g, '').toLowerCase())} />
                            </TableCell>
                            <TableCell align="center" colSpan={2}>
                                {props.type === 'studentlist' ? (
                                    <>
                                        {' '}
                                        <button onClick={() => ctx.setMenu({ ...ctx.openMenu, openform: true, action: 'create' })} className="table-btn">
                                            REGISTER STUDENT
                                        </button>
                                        {selected.length > 0 && (
                                            <button onClick={() => ctx.setMenu({ ...ctx.openMenu, opendelete: true })} className="table-btn delete">
                                                DELETE STUDENT
                                            </button>
                                        )}
                                    </>
                                ) : props.type === 'booklist' ? (
                                    <>
                                        <button onClick={() => ctx.setMenu({ ...ctx.openMenu, openform: true, action: 'create' })} className="table-btn">
                                            CREATE BOOK
                                        </button>
                                        <button onClick={() => ctx.setMenu({ ...ctx.openMenu, openform: true, action: 'edit' })} className="table-btn edit">
                                            EDIT BOOK
                                        </button>
                                        <button onClick={() => ctx.setMenu({ ...ctx.openMenu, opendelete: true })} className="table-btn delete">
                                            DELETE BOOK
                                        </button>
                                    </>
                                ) : props.type === 'borrowedbook' && selected.length > 0 ? (
                                    <>
                                        <button onClick={() => ctx.setMenu({ ...ctx.openMenu, opendelete: true })} className="table-btn delete">
                                            Detete {selected.length}
                                        </button>
                                        {ctx.user.user.role === 'librarian' && (
                                            <button style={{ marginLeft: '20px' }} className="table-btn">
                                                Return Book
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <></>
                                )}
                                <FormDialog type={props.type} action={ctx.openMenu.action} />
                                <DeleteDialog data={selected} type={props.type} />
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={selected.length > 0 && selected.length < props.data?.length}
                                    checked={props.data?.length > 0 && selected.length === props.data?.length}
                                    onChange={handleSelectAllClick}
                                    inputProps={{
                                        'aria-label': 'select all data'
                                    }}
                                />
                            </TableCell>
                            {(props.type === 'booklist' ? bookcolumns : props.type === 'borrowedbook' ? borrowbookcolumns : columns).map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ top: 57, minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(searchvalue === '' ? props.data : filterdata)?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                            const isItemSelected = isSelected(props.type === 'studentlist' ? row.studentID : props.type === 'borrowedbook' ? row.borrowid : row.ISBN[0].identifier);
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={props.type === 'studentlist' ? row.studentID : props.type === 'borrowedbook' ? row.borrowid : row.ISBN[0].identifier}
                                    selected={isItemSelected}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            onClick={(event) =>
                                                handleClick(event, props.type === 'studentlist' ? row.studentID : props.type === 'borrowedbook' ? row.borrowid : row.ISBN[0].identifier)
                                            }
                                            checked={isItemSelected}
                                            inputProps={{
                                                'aria-labelledby': labelId
                                            }}
                                        />
                                    </TableCell>
                                    {(props.type === 'booklist' ? bookcolumns : props.type === 'borrowedbook' ? borrowbookcolumns : columns).map((column) => {
                                        const value = column.id !== 'ISBN' && row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.id === 'bookdetail' ? (
                                                    <>
                                                        <button onClick={() => setfullscreen({ ...openfullscreen, [`Borrowed${index}`]: true })} className="table-btn">
                                                            VIEW BOOKS
                                                        </button>
                                                        <FullScreenDialog index={index} open={openfullscreen[`Borrowed${index}`]} type={`Borrowed Book`} data={value} setopen={setfullscreen} />
                                                    </>
                                                ) : column.id === 'qrcode' ? (
                                                    <img src={value} alt="qrcode"></img>
                                                ) : column.id === 'cover_img' ? (
                                                    column.id === 'cover_img' && <img src={value} alt="cover" />
                                                ) : column.id === 'student' && ctx.user.user.role === 'librarian' ? (
                                                    <>
                                                        <h2>
                                                            {value.lastname} {value.firstname}
                                                        </h2>
                                                        <h2> ID: {value.studentID}</h2>
                                                        <h2> PhoneNumber: {value.phone_number}</h2>
                                                    </>
                                                ) : column.id === 'libraryentry' ? (
                                                    <>
                                                        <p onClick={() => setfullscreen({ ...openfullscreen, [`Library${index}`]: true })}>{value}</p>
                                                        <FullScreenDialog
                                                            setopen={setfullscreen}
                                                            index={index}
                                                            open={openfullscreen[`Library${index}`]}
                                                            type={`Library Entry for ${row.fullname}`}
                                                            data={props.entry[index]?.library_entry}
                                                        />
                                                    </>
                                                ) : column.id === 'borrowedbook' ? (
                                                    <>
                                                        <button onClick={() => setfullscreen({ ...openfullscreen, [`Borrowed${index}`]: true })} className="table-btn edit">
                                                            BORROWED BOOK
                                                        </button>
                                                        <FullScreenDialog
                                                            setopen={setfullscreen}
                                                            index={index}
                                                            open={openfullscreen[`Borrowed${index}`]}
                                                            type={`Borrowed Book for ${row.fullname}`}
                                                            name={row.fullname}
                                                            data={value}
                                                        />
                                                    </>
                                                ) : (
                                                    value
                                                )}
                                                {column.id === 'ISBN' && row.ISBN[0]?.identifier}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={props.data?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export const BookContainer = (props) => {
    return (
        <div className="Tablebook_container">
            <img className="bookcover" src={props.book.cover_img} alt="" srcset="" />
            <div className="detail_sec">
                <p>Book title</p>
                <p>Categories</p>
                <p>Author</p>
            </div>
        </div>
    );
};
