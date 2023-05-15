import React, { useContext, useEffect, useState } from 'react';
import '../../Style/style.scss';
import DataTable from '../DataTable';
import axios from 'axios';
import { Mycontext } from '../../Config/context';
import env, { createData } from '../../env';



function countVisitsByTimeRange(dates) {
    const now = new Date();
    const past1weeks = 7 * 24 * 60 * 60 * 1000;
    const past2weeks = 2 * 7 * 24 * 60 * 60 * 1000;
    const past4Weeks = 4 * 7 * 24 * 60 * 60 * 1000;
    const past3Months = 3 * 30 * 24 * 60 * 60 * 1000;
    const past6Months = 6 * 30 * 24 * 60 * 60 * 1000;
    const pastYears = 1 * 365 * 24 * 60 * 60 * 1000;

    let visitsBy2Weeks = 0;
    let visitsBy4Weeks = 0;
    let visitsBy3months = 0;
    let visitsBy6months = 0;
    let visitsByLastYears = 0;
    let visitsBy1week = 0;
    let visitthisweek = 0;
    let result;
    dates.forEach(({entry_date}) => {
        const timeDiff = now.getTime() - new Date(entry_date).getTime();
        if (timeDiff < past2weeks) {
            visitsBy2Weeks++;
        } else if (timeDiff < past4Weeks) {
            visitsBy4Weeks++;
        } else if (timeDiff < past3Months) {
            visitsBy3months++;
        } else if (timeDiff < past6Months) {
            visitsBy6months++;
        } else if (timeDiff < pastYears) {
            visitsByLastYears++;
        } else if (timeDiff < past1weeks) {
            visitsBy1week++;
        } else {
            visitthisweek++;
        }
    });
    if (visitsBy1week > 0) {
        result = `${visitsBy1week} For the past week'`;
    } else if (visitsBy2Weeks > 0) {
        result =`${visitsBy2Weeks} For the past 2 weeks`;
    } else if (visitsBy4Weeks > 0) {
        result = `${visitsBy4Weeks} For the past 1 month`;
    } else if (visitsBy3months > 0) {
        result = `${visitsBy3months} For the past 3 months`;
    } else if (visitsBy6months > 0) {
        result =`${visitsBy6months} For the past 6 months`;
    } else if (visitsByLastYears > 0) {
        result = `${visitsByLastYears} For the past year`;
    } else {
        result = `${visitthisweek} For this week`;
    }

    return result;
}

const ListofStudentPage = () => {
    const ctx = useContext(Mycontext);
    const [studentdata, setstudent] = useState([]);
 

    const getStudent = async () => {
        let students = [];
        const res = await axios({
            method: 'get',
            url: env.api + 'getstudent',
            headers: { Authorization: `Bearer ${ctx.user.token.accessToken}` }
        });
        res.data?.map((i) => students.push(createData(i.studentID, i.firstname + ' ' + i.lastname , i.department, i.email, i.phonenumber, countVisitsByTimeRange(i.library_entry) , i.borrow_book)));
        ctx.setstudent(students)
        setstudent(res.data);
    };
    useEffect(() => {
        getStudent();
    }, []);
    return (
        <div className="studentlist_container">
            <div className="header_sec">
                <h1>List of Students</h1>
            </div>
            <div className="table_data">
                <DataTable data={ctx.student} entry={studentdata} type={'studentlist'} />
            </div>
        </div>
    );
};

export default ListofStudentPage;
