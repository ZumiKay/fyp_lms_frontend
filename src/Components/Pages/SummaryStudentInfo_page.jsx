import React, { useContext, useEffect, useState } from 'react';
import '../../Style/style.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import { Mycontext } from '../../Config/context';
import env from '../../env';
import { Loading } from '../Asset';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};



const SummaryStudentInfopage = () => {
    const [filterdate, setfilterdate] = useState([]);
    const [datesrange, setrange] = useState([]);
    const [loading, setloading] = useState(false);
    const [student, setstudent] = useState([]);
    const [department, setdeparment] = useState('all');
    const [filtereddata, setdata] = useState([]);
    const [filterrange , setfilterange] = useState([])
    const [dep, setdep] = useState([]);
    const ctx = useContext(Mycontext);

    const countEntriesAndBorrowedBooksBySemesterAndSelected = (library_entry, borrowedbook, seleteddaterange) => {
        let result = {};

        seleteddaterange.forEach((i) => {
            const entry_date = filterDatesArrayByRange(library_entry, i.filter.start, i.filter.end);
            const borrow_id = filterDatesArrayByRange(borrowedbook, i.filter.start, i.filter.end);
            const filteredentry = filterByUniqueDate(entry_date);
            const filteredborrowed = filterByUniqueDate(borrow_id);
            
            result = {
                ...result,
                [i.name]: {
                    entry: {
                        total: countNonEmptySubArrays(filteredentry),
                        monthly: countMonthsInRange(filteredentry, i.filter.start, i.filter.end)
                    },
                    borrowedbook: {
                        total: countNonEmptySubArrays(filteredborrowed),
                        monthly: countMonthsInRange(filteredborrowed, i.filter.start, i.filter.end)
                    }
                }
            };
        });

        return result;
    };
    function countNonEmptySubArrays(datesArray) {
        let count = 0;
        datesArray.map((i) => {
            if (i.length > 0) {
               count += 1
                
            }
        });
        return count;
    }
    function filterDatesArrayByRange(datesArray, startDate, endDate) {
        return datesArray
          .map((subArray) =>
            subArray
              .filter((date) => {
                const currentDate = new Date(date);
                return currentDate >= startDate && currentDate <= endDate;
              })
              .sort((a, b) => new Date(a) - new Date(b))
          )
          .filter((subArray) => subArray.length > 0);
      }

    function filterByUniqueDate(datesArray) {
        const filteredDates = [];

        datesArray.forEach((dates) => {
            const uniqueDates = dates.reduce((result, date) => {
                // Check if the current date is already in the result array
                const hasDuplicate = result.some((existingDate) => {
                    return new Date(date).toDateString() === new Date(existingDate).toDateString();
                });

                // Add the current date to the result array if it's not a duplicate
                if (!hasDuplicate) {
                    result.push(date);
                }

                return result;
            }, []);

            filteredDates.push(uniqueDates);
        });

        return filteredDates;
    }


    function countMonthsInRange(datesArray, startDate, endDate) {
        const result = {};
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        const startYear = new Date(startDate).getFullYear();
        const startMonth = new Date(startDate).getMonth();
        const endYear = new Date(endDate).getFullYear();
        const endMonth = new Date(endDate).getMonth();
    
        for (let year = startYear; year <= endYear; year++) {
            const isStartYear = year === startYear;
            const isEndYear = year === endYear;
            const start = isStartYear ? startMonth : 0;
            const end = isEndYear ? endMonth : 11;
    
            for (let month = start; month <= end; month++) {
                const monthName = monthNames[month];
                result[monthName] = { monthCount: 0, weekly: {} };
                for (let week = 1; week <= 4; week++) {
                    result[monthName].weekly[week] = 0;
                }
            }
        }
        datesArray.forEach((subarray) => {
            if (Array.isArray(subarray)) {
                const subarrayStartDate = new Date(subarray[0]);
                const subarrayEndDate = new Date(subarray[subarray.length - 1]);
                const year = subarrayStartDate.getFullYear();
                const month = subarrayStartDate.getMonth();
                const monthenddate = subarrayEndDate.getMonth()
    
                // Check if the subarray's start and end dates are within the specified range
                const isWithinRange = (
                    (year > startYear || (year === startYear && month >= startMonth))
                    && (year < endYear || (year === endYear && month <= endMonth))
                    && (subarrayStartDate >= startDate && subarrayEndDate <= endDate)
                );
    
                if (isWithinRange) {
                    const monthName = monthNames[month];
                    const lastmonthname = monthNames[monthenddate]
                    if (result.hasOwnProperty(monthName)) {
                        result[monthName].monthCount++;
                        
                        // Get the unique weeks within the subarray
                        const uniqueWeeks = new Set();
                        subarray.forEach((date) => {
                            const week = Math.ceil(new Date(date).getDate() / 7);
                            uniqueWeeks.add(week);
                        });
    
                        // Update the weekly count for each week in the month
                        uniqueWeeks.forEach((week) => {
                            if (result[monthName].weekly.hasOwnProperty(week)) {
                                result[monthName].weekly[week]++;
                            }
                        });
                    }
                    if (result.hasOwnProperty(lastmonthname) && monthenddate !== month) {
                        result[lastmonthname].monthCount++;
                        
                        // Get the unique weeks within the subarray
                        const uniqueWeeks = new Set();
                        subarray.forEach((date) => {
                            const week = Math.ceil(new Date(date).getDate() / 7);
                            uniqueWeeks.add(week);
                        });
    
                        // Update the weekly count for each week in the month
                        uniqueWeeks.forEach((week) => {
                            if (result[lastmonthname].weekly.hasOwnProperty(week)) {
                                result[lastmonthname].weekly[week]++;
                            }
                        });
                    }
                }
            }
        });
    
        return result;
    }
    const handlefilterrange = (event) => {
        const {
            target: { value }
        } = event;
        let values;
        values = typeof value === 'string' ? value.split(',') : value;
        let alldate = generateSemesterArray();
        let seleteddaterange = [];
        alldate.filter((i) => values.includes(i.name)).map((j) => seleteddaterange.push(j));
        
        setfilterange(seleteddaterange)
        
        setfilterdate(values);
    }

    const handleChange = (event) => {
        
        
        event.preventDefault()
        let library_entry = [];
        let borrowedbook = [];
        if(department === 'all') {
        student.forEach((i) => {
            let entry = i.library_entry.map((j) => j.entry_date);
            let borrow = i.borrow_book.map((k) => k.borrow_date);
            library_entry.push(entry);
            borrowedbook.push(borrow);
        });
         } else {
            student.filter((d) => d.department === department).forEach((i) => {
                let entry = i.library_entry.map((j) => j.entry_date);
                let borrow = i.borrow_book.map((k) => k.borrow_date);
                library_entry.push(entry);
                borrowedbook.push(borrow);
            });
         }
        const result = countEntriesAndBorrowedBooksBySemesterAndSelected(library_entry, borrowedbook, filterrange);
        setdata(result);
        let result1 = [];
        filterrange.map((i) => {
            result1.push(createDatas(i.name, result[i.name].entry.total, result[i.name].borrowedbook.total, result[i.name].entry.monthly, result[i.name].borrowedbook.monthly));
        });
        setdata(result1)
       
        
    };
    const handleDepartment = (e) => {
        setdeparment(e.target.value)
       
    }
    function generateSemesterArray() {
        const currentYear = new Date().getFullYear();
        const startYear = 2019;
        const semestersPerYear = 3;

        const semesterFilters = [
            { startMonth: 10, endMonth: 2 },
            { startMonth: 2, endMonth: 7 },
            { startMonth: 7, endMonth: 9 }
        ];

        const semesters = [];

        for (let year = startYear; year <= currentYear; year++) {
            for (let semester = 0; semester < semestersPerYear; semester++) {
                const semesterCode = `${year}-${year + 1}/${semester + 1}`;
                const filter = semesterFilters[semester];
                const startYearOffset = semester === 0 ? 0 : 1;
                const filterValue = {
                    start: new Date(year + startYearOffset, filter.startMonth),
                    end: new Date(year + 1, filter.endMonth)
                };
                semesters.push({ name: semesterCode, filter: filterValue });
            }
        }

        return semesters;
    }

    useEffect(() => {
        let datearray = generateSemesterArray();

        setrange(datearray);

        const getstudent = () => {
            setloading(true);
            axios({
                method: 'get',
                url: env.api + 'getstudent',
                headers: { Authorization: `Bearer ${ctx.user.token.accessToken}` }
            }).then((res) => {
                setloading(false);
                setstudent(res.data);
            });
        };
        const getdepartment = () => {
            axios({
                method: 'get',
                url: env.api + 'getdepartment',
                headers: { Authorization: `Bearer ${ctx.user.token.accessToken}` }
            }).then((res) => {
                setdep(res.data);
            });
        };
        getdepartment();
        getstudent();
    }, []);
    return (
        <div className="summary_container">
            {loading && <Loading/>}
            <h1 className="title">Summary Student Information</h1>
            <div className="filter_input">
                <FormControl sx={{ m: 1, width: '100%' }}>
                    <InputLabel id="demo-multiple-checkbox-label">Filter</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={filterdate}
                        onChange={handlefilterrange}
                        input={<OutlinedInput label="Filter" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                    >
                        {datesrange.map((name) => (
                            <MenuItem key={name} value={name.name}>
                                <Checkbox checked={filterdate.indexOf(name.name) > -1} />
                                <ListItemText primary={name.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <FormControl style={{ width: '70%' }}>
                <InputLabel id="demo-simple-select-label">Deparment</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={department} label="Department" onChange={handleDepartment}>
                    <MenuItem value={'all'}>All</MenuItem>
                    {dep.map((i) => (
                        <MenuItem value={i.department}>{i.department}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <button className='confirm-btn' onClick={(e) => handleChange(e)}>SEARCH</button>
            <div className="information_container">
                <CollapsibleTable data={filtereddata} />
            </div>
        </div>
    );
};

export default SummaryStudentInfopage;

function createDatas(Date, library_entry, borrowedbook, library_entry_detail, borrowedbook_detail) {
    return {
        Date,
        library_entry,
        borrowedbook,
        library_entry_detail,
        borrowedbook_detail
    };
}
function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [opendropdown, setopendropdown] = useState({
        open1: false
    });

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: '10px solid white' , paddingTop:"20px" , backgroundColor:"#4682B4"  , fontWeight:"900" , fontSize:"medium"} }}>
                <TableCell>
                    <IconButton aria-label="expand row" style={{color:"white"}} size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" style={{color:"white"}}>
                    {row.Date}
                </TableCell>
                <TableCell style={{color:"white"}} align="right">{row.library_entry}</TableCell>
                <TableCell style={{color:"white"}} align="right">{row.borrowedbook}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h5" gutterBottom component="div">
                                LIBRARY ENTRY FOR {row.Date}
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell align="left">Monthly</TableCell>
                                        <TableCell align="left">Total</TableCell>
                                       
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(row.library_entry_detail).map(([index , details]) => (
                                        <>
                                        <TableRow key={index}>
                                        <TableCell>
                                            <IconButton aria-label="expand row" size="small" onClick={() => setopendropdown({ ...opendropdown, [index]: !opendropdown[index] })}>
                                                {opendropdown[index] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {index}
                                        </TableCell>
                                        <TableCell align="left">{details.monthCount}</TableCell>
                                        
                                    </TableRow>
                                    <Collapse in={opendropdown[index]} timeout="auto" unmountOnExit>
                                    <Box sx={{ margin: 1 }}>
                                        <Table size="small" aria-label="purchases">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">Week 1</TableCell>
                                                    <TableCell align="center">Week 2</TableCell>
                                                    <TableCell align="center">Week 3</TableCell>
                                                    <TableCell align="center">Week 4</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                {Object.entries(details.weekly).map(([week, count]) => (
                                                        <TableCell align="center" key={week}>{count}</TableCell>
                                                ))}
                                                   
                                                    
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Box>
                                   
                                </Collapse>
                                </>
                                    ))}
                                    
                                </TableBody>
                            </Table>
                        </Box>
                        
                        
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h5" gutterBottom component="div">
                                BORROWED BOOK FOR {row.Date}
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                    <TableCell></TableCell>
                                        <TableCell align="left">Monthly</TableCell>
                                        <TableCell align="left">Total</TableCell>
                                      
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {Object.entries(row.borrowedbook_detail).map(([index , details]) => (
                                        <>
                                        <TableRow key={index}>
                                        <TableCell>
                                            <IconButton aria-label="expand row" size="small" onClick={() => setopendropdown({ ...opendropdown, [`${index}1`]: !opendropdown[`${index}1`] })}>
                                                {opendropdown[`${index}1`] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {index}
                                        </TableCell>
                                        <TableCell align="left">{details.monthCount}</TableCell>
                                        
                                    </TableRow>
                                    <Collapse in={opendropdown[`${index}1`]} timeout="auto" unmountOnExit>
                                    <Box sx={{ margin: 1 }}>
                                        <Table size="small" aria-label="purchases">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">Week 1</TableCell>
                                                    <TableCell align="center">Week 2</TableCell>
                                                    <TableCell align="center">Week 3</TableCell>
                                                    <TableCell align="center">Week 4</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                {Object.entries(details.weekly).map(([week, count]) => (
                                                        <TableCell align="center" key={week}>{count}</TableCell>
                                                ))}
                                                   
                                                    
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Box>
                                   
                                </Collapse>
                                </>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
            
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


function CollapsibleTable(props) {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>DATE</TableCell>
                        <TableCell align="right">LIBRARY ENTRY</TableCell>
                        <TableCell align="right">BORROWED BOOK</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props?.data.map((row) => (
                        <Row row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
