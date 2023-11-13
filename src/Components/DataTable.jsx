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
import { Loading, setimage } from './Asset';
import { convertToPascalCase } from '../env';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

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
    { id: 'borrowid', label: 'BorrowID', minWidth: 150 },
    { id: 'student', label: 'Borrower', minWidth: 150 },
    { id: 'bookdetail', label: 'Books', minWidth: 170 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'borrowdate', label: 'Borrow Date', minWidth: 170 },
    { id: 'expectreturndate', label: 'Expect Return Date', minWidth: 170 },
    { id: 'qrcode', label: 'QR CODE', minWidth: 150 }
];

export default function DataTable(props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const ctx = React.useContext(Mycontext);
    const [selected, setSelected] = React.useState([]);
    const [filterdata, setfilter] = React.useState({
        selectfiltered: [],
        searchfilter: []
    });
    const [filtervalue, setvalue] = React.useState({
        search: '',
        status: ''
    }); 
    const [status , setstatus] = React.useState('')
    const [openfullscreen, setfullscreen] = React.useState({});
    const isSelected = (name) => selected.indexOf(name) !== -1;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = props.type === 'studentlist' ? props.data.map((i) => i.studentID) : props.type === 'borrowedbook' ? props.data.map((i) => i.borrowid) : props.data.map((i) => i.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
    const formatdate = (value) => {
        return `${new Date(value).toLocaleDateString('en')}, ${new Date(value).getHours()}:${new Date(value).getMinutes()}:${new Date(value).getSeconds()}`;
    };
    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected?.length - 1) {
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
    const handleSearch = React.useCallback(() => {
        const allbook = props.data || [];
        let filter = [];

        switch (props.type) {
            case 'studentlist':
                filter = allbook.filter((stu) => {
                    const department = stu.department?.replace(/\s+/g, '');
                    const lowercasedSearch = filtervalue.search.toLowerCase();

                    return (
                        stu.studentID.includes(lowercasedSearch) ||
                        stu.fullname?.replace(/\s+/g, '')?.toLowerCase().includes(lowercasedSearch) ||
                        stu.email?.replace(/\s+/g, '').includes(lowercasedSearch) ||
                        stu.phoneNumber?.toString().includes(lowercasedSearch) ||
                        department?.toLowerCase().includes(lowercasedSearch)
                    );
                });
                break;

            case 'borrowedbook':
                filter = allbook.filter((book) => {
                    const lowercasedSearch = filtervalue.search.toLowerCase();
                    const fullName = book.student?.lastname + book.student?.firstname;

                    if (ctx.user.user.role === 'librarian') {
                        return (
                            book.borrowid.includes(lowercasedSearch) ||
                            book.student?.studentID.includes(lowercasedSearch) ||
                            formatdate(book.borrowdate)?.replace(/\s+/g, '').includes(lowercasedSearch) ||
                            book.returndate?.replace(/\s+/g, '').toLowerCase().includes(lowercasedSearch) ||
                            formatdate(book.expectreturndate)?.replace(/\s+/g, '').includes(lowercasedSearch) ||
                            fullName?.replace(/\s+/g, '').toLowerCase().includes(lowercasedSearch) ||
                            book.student?.phonenumber?.toString().includes(lowercasedSearch) ||
                            book.status?.replace(/\s+/g, '').toLowerCase().includes(lowercasedSearch)
                        );
                    } else if (ctx.user.user.role === 'student') {
                        return (
                            book.borrowid?.includes(lowercasedSearch) ||
                            formatdate(book.borrowdate)?.replace(/\s+/g, '').includes(lowercasedSearch) ||
                            formatdate(book.returndate)?.replace(/\s+/g, '').includes(lowercasedSearch) ||
                            formatdate(book.expectreturndate)?.replace(/\s+/g, '').includes(lowercasedSearch) ||
                            book.status?.replace(/\s+/g, '').toLowerCase().includes(lowercasedSearch)
                        );
                    }
                    return false;
                }).filter((book) => {
                    if(book.status?.replace(/\s+/g, '').toLowerCase().includes(filtervalue.status.replace(/\s+/g, '').toLowerCase())) {
                        return true
                    }
                    return false
                });
                break;

            default:
                filter = allbook
                    .filter((book) => {
                        const lowercasedSearch = filtervalue.search.toLowerCase();
                        return (
                            book.ISBN[0]?.identifier?.includes(lowercasedSearch) ||
                            book.title?.replace(/\s+/g, '')?.toLowerCase().includes(lowercasedSearch) ||
                            book.categories[0]?.replace(/\s+/g, '')?.toLowerCase().includes(lowercasedSearch)
                        );
                    })
                    .filter((book) => {
                        const lowercasedStatus = filtervalue.status.toLowerCase();
                        return filtervalue.status === '' || book.status.toLowerCase().includes(lowercasedStatus);
                    });
                break;
        }

        setfilter({ ...filterdata, searchfilter: filter });
    }, [filtervalue.search, filtervalue.status, props.data, props.type, ctx.user.user.role]);

    const handleChange = (e) => {
        const value = e.target.value.replace(/\s+/g, '').toLowerCase();
        setvalue({ ...filtervalue, search: value });
    };

    const handleSelect = (e) => {
        const value = e.target.value;
        setvalue({ ...filtervalue, status: value });
        setstatus(value)
    };

    React.useEffect(() => {
        handleSearch();
    }, [filtervalue.search, filtervalue.status, props.data]);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }} className="datatable_container">
            <TableContainer sx={{ maxHeight: 0.77 * window.innerHeight }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead className="datatable_header">
                        <TableRow>
                            <TableCell colSpan={2}><h3 className='total text-lg font-black w-full'>Total: {props.data?.length}</h3></TableCell>

                            <TableCell align="center" colSpan={2} className="datatable_header_1">
                                
                                <input type="text" className="search_input" placeholder="Search" onChange={handleChange} />
                            </TableCell>
                            {(props.type === 'booklist' || props.type === 'borrowedbook') && (
                                <TableCell colSpan={1} className="datatable_header_2">
                                    <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                                    <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
                                   { props.type === 'booklist' ? <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" label="Status" value={filtervalue.status} onChange={handleSelect}>
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="available">Available</MenuItem>
                                     <MenuItem value={'unavailable'}>Unavailable</MenuItem>
                                            
                                    </Select> : <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" label="Status" value={filtervalue.status} onChange={handleSelect}>
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="topickup">To Pickup</MenuItem>
                                     <MenuItem value={'pickedup'}>Pickedup</MenuItem>
                                     <MenuItem value={'returned'}>Returned</MenuItem>
                                     
                                            
                                    </Select>}
                                    </FormControl>
                                </TableCell>
                            )}
                            <TableCell align="center" colSpan={5}>
                                {props.type === 'studentlist' ? (
                                    <>
                                        {' '}
                                        <button onClick={() => ctx.setMenu({ [props.type]: true, action: 'create' })} className="table-btn">
                                            REGISTER STUDENT
                                        </button>
                                        {/* <button onClick={() => ctx.setMenu({[props.type]: true, action: 'createdp'})} className="table-btn">
                                            CREATE DEPARTMENT
                                        </button>
                                        <button onClick={() => ctx.setMenu({[props.type]: true, action: 'deteledp'})} className="table-btn delete">
                                            DELETE DEPARTMENT
                                        </button> */}
                                        {selected.length > 0 && (
                                            <button onClick={() => ctx.setMenu({ ...ctx.openMenu, opendelete: true })} className="table-btn delete">
                                                DELETE STUDENT
                                            </button>
                                        )}
                                    </>
                                ) : props.type === 'booklist' ? (
                                    <>
                                        <button onClick={() => ctx.setMenu({ [props.type]: true, action: 'create' })} className="table-btn">
                                            CREATE BOOK
                                        </button>
                                        {selected.length === 1 && (
                                            <button onClick={() => ctx.setMenu({ [props.type]: true, action: 'edit' })} className="table-btn edit">
                                                EDIT BOOK
                                            </button>
                                        )}
                                        {selected.length > 0 && (
                                            <button onClick={() => ctx.setMenu({ ...ctx.openMenu, opendelete: true })} className="table-btn delete">
                                                DELETE BOOK
                                            </button>
                                        )}
                                    </>
                                ) : props.type === 'borrowedbook' && selected.length > 0 ? (
                                    <>
                                        <button onClick={() => ctx.setMenu({ ...ctx.openMenu, opendelete: true })} className="table-btn delete">
                                            Detete
                                        </button>
                                        {/* {(ctx.user.user.role === 'librarian' && selected.length === 1) && (
                                            <>
                                            <button style={{ marginLeft: '20px' }} onClick={handleReturn} className="table-btn">
                                                RETURN BOOK
                                            </button>
                                               
                                            </>
                                        )} */}
                                    </>
                                ) : (
                                    <></>
                                )}
                                {ctx.user.user.role === 'librarian' && props.type === 'borrowedbook' && selected.length === 0 && (
                                    <button style={{ marginLeft: '20px' }} onClick={() => ctx.setMenu({ ...ctx.openMenu, returnbook: true })} className="table-btn">
                                        RETURN BOOK
                                    </button>
                                )}
                                {ctx.openMenu.returnbook && <FormDialog type={'returnbook'} borrowedbook={props.data} />}
                                {ctx.openMenu[props.type] && <FormDialog type={props.type} action={ctx.openMenu.action} selectedbook={selected} />}
                                <DeleteDialog data={selected} type={props.type} />
                            </TableCell>
                            {/* <TableCell align="center" colSpan={1}>
                                <p className="total font-black"> Total: {props.data?.length}</p>
                            </TableCell> */}
                        </TableRow>

                        <TableRow>
                            <TableCell padding="checkbox" style={{ zIndex: '8', top: 70, backgroundColor: '#D6EBF2' }}>
                                {ctx.user.user.role === 'librarian' && (
                                    <Checkbox
                                        color="primary"
                                        indeterminate={selected.length > 0 && selected.length < props.data?.length}
                                        checked={props.data?.length > 0 && selected.length === props.data?.length}
                                        onChange={handleSelectAllClick}
                                        inputProps={{
                                            'aria-label': 'select all data'
                                        }}
                                    />
                                )}
                            </TableCell>

                            {(props.type === 'booklist' ? bookcolumns : props.type === 'borrowedbook' ? borrowbookcolumns : columns).map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ top: 70, minWidth: column.minWidth, fontWeight: '800', backgroundColor: '#D6EBF2', fontSize: 'medium' , border: '0'}}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filterdata.searchfilter?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                            const isItemSelected = isSelected(props.type === 'studentlist' ? row.studentID : props.type === 'borrowedbook' ? row.borrowid : row.id);
                            const labelId = `enhanced-table-checkbox-${index}`;
                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={props.type === 'studentlist' ? row.studentID : props.type === 'borrowedbook' ? row.borrowid : row.id}
                                    selected={isItemSelected}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell padding="checkbox">
                                        {!row.status || (row.status === 'PickedUp' && ctx.user.user.role === 'librarian') || row.status === 'To Pickup' || props.type === 'booklist' ? (
                                            <Checkbox
                                                color="primary"
                                                onClick={(event) => handleClick(event, props.type === 'studentlist' ? row.studentID : props.type === 'borrowedbook' ? row.borrowid : row.id)}
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId
                                                }}
                                            />
                                        ) : (
                                            ctx.user.user.role === 'librarian' && (
                                                <Checkbox
                                                    color="primary"
                                                    onClick={(event) => handleClick(event, props.type === 'studentlist' ? row.studentID : props.type === 'borrowedbook' ? row.borrowid : row.id)}
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId
                                                    }}
                                                />
                                            )
                                        )}
                                    </TableCell>
                                    {(props.type === 'booklist' ? bookcolumns : props.type === 'borrowedbook' ? borrowbookcolumns : columns).map((column) => {
                                        const value = column.id !== 'ISBN' && row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align} width={1000} style={{border: 0}}>
                                                {column.id === 'bookdetail' ? (
                                                    <>
                                                        <button onClick={() => setfullscreen({ ...openfullscreen, [`Borrowed${index}`]: true })} className="table-btn">
                                                            VIEW BOOKS
                                                        </button>
                                                        <FullScreenDialog index={index} open={openfullscreen[`Borrowed${index}`]} type={`Borrowed Book`} data={value} setopen={setfullscreen} />
                                                    </>
                                                ) : column.id === 'qrcode' ? (
                                                    value !== '' ? (
                                                        <img src={value} alt="qrcode"></img>
                                                    ) : (
                                                        ''
                                                    )
                                                ) : column.id === 'cover_img' ? (
                                                    column.id === 'cover_img' && <img style={{ width: '200px', height: '250px', objectFit: 'contain' }} src={value} alt="cover" />
                                                ) : column.id === 'student' && ctx.user.user.role === 'librarian' ? (
                                                    <>
                                                        <h2>
                                                            {value.lastname} {value.firstname}
                                                        </h2>
                                                        <h2> ID: {value.studentID}</h2>
                                                        <h2>TEL:{value.phonenumber}</h2>
                                                    </>
                                                ) : column.id === 'libraryentry' ? (
                                                    <>
                                                        <button onClick={() => setfullscreen({ ...openfullscreen, [`Library${index}`]: true })} className="table-btn">
                                                            {value}
                                                        </button>
                                                        <FullScreenDialog
                                                            setopen={setfullscreen}
                                                            index={index}
                                                            open={openfullscreen[`Library${index}`]}
                                                            type={`Library Entry for ${row.fullname}`}
                                                            data={props.entry?.find(({ studentID }) => studentID === row.studentID)?.library_entry}
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
                                                            length={value?.length}
                                                        />
                                                    </>
                                                ) : column.id === 'borrowdate' || column.id === 'expectreturndate' ? (
                                                    value !== null ? (
                                                        `${new Date(value).toLocaleDateString('en')}, ${new Date(value).getHours()}:${new Date(value).getMinutes()}:${new Date(value).getSeconds()}`
                                                    ) : (
                                                        ''
                                                    )
                                                ) : column.id === 'status' ? (
                                                    <p
                                                        className="status"
                                                        style={
                                                            value === 'To Pickup'
                                                                ? { backgroundColor: '#4682B4' }
                                                                : value === 'PickedUp'
                                                                ? { backgroundColor: 'palevioletred' }
                                                                : value === 'available' || value.includes('Returned')
                                                                ? { backgroundColor: 'lightseagreen' }
                                                                : { backgroundColor: 'black' }
                                                        }
                                                    >
                                                        {value}
                                                    </p>
                                                ) : (
                                                    value
                                                )}
                                                {column.id === 'ISBN' && row.ISBN[0]?.identifier}
                                            </TableCell>
                                        );
                                    })}
                                    {ctx.loading[props.type] && <Loading />}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={props.data?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    style={{ position: 'fixed', bottom: '0', right: '0', backgroundColor: '#D6EBF2', borderTopLeftRadius: '10px' }}
                />
            </TableContainer>
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

