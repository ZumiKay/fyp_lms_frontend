import React, { useContext, useEffect, useState } from 'react';
import '../../Style/style.scss';
import DataTable from '../DataTable';
import axios from 'axios';
import { Mycontext } from '../../Config/context';
import env, { createData } from '../../env';
import { Loading } from '../Asset';

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
   
    let result;
    dates.forEach(({ createdAt }) => {
        const entryDate = new Date(createdAt);
        const timeDiff = now.getTime() - entryDate.getTime();
        const secondsDiff = Math.floor(timeDiff / 1000);
        if (secondsDiff < past1weeks / 1000) {
            visitsBy1week++;
        } else if (secondsDiff < past2weeks / 1000) {
            visitsBy2Weeks++;
        } else if (secondsDiff < past4Weeks / 1000 && secondsDiff > past2weeks / 1000) {
            visitsBy4Weeks++;
        } else if (secondsDiff < past3Months / 1000 && secondsDiff > past4Weeks / 1000) {
            visitsBy3months++;
        } else if (secondsDiff < past6Months / 1000 && secondsDiff > past3Months / 1000) {
            visitsBy6months++;
        } else if (secondsDiff < pastYears / 1000 && secondsDiff > past6Months / 1000) {
            visitsByLastYears++;
        }
    });

    if (visitsBy1week > 0) {
        result = `${visitsBy1week} For the past week`;
    } else if (visitsBy2Weeks > 0) {
        result = `${visitsBy2Weeks} For the past 2 weeks`;
    } else if (visitsBy4Weeks > 0) {
        result = `${visitsBy4Weeks} For the past 1 month`;
    } else if (visitsBy3months > 0) {
        result = `${visitsBy3months} For the past 3 months`;
    } else if (visitsBy6months > 0) {
        result = `${visitsBy6months} For the past 6 months`;
    } else if (visitsByLastYears > 0) {
        result = `${visitsByLastYears} For the past year`;
    } else {
        result = 'No Entry'
    }

    return result;
}

const ListofStudentPage = () => {
    const ctx = useContext(Mycontext);
    const [studentdata, setstudent] = useState([]);

    const getStudent = () => {
        ctx.setloading({ ...ctx.loading, studentlist: true });
        let students = [];
        axios({
            method: 'get',
            url: env.api + 'getstudent',
            headers: { Authorization: `Bearer ${ctx.user.token.accessToken}` }
        }).then((res) => {
            ctx.setstudent(students);
            res.data.map((i) => students.push(createData(i.studentID, i.firstname + ' ' + i.lastname, i.department, i.email, i.phonenumber, countVisitsByTimeRange(i.library_entry), i.borrow_book)));
            setstudent(res.data);
            ctx.setloading({ ...ctx.loading, studentlist: false });
        });
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
                {ctx.loading.studentlist && <Loading/>}
                <DataTable data={ctx.student} entry={studentdata} type={'studentlist'} />
            </div>
        </div>
    );
};

export default ListofStudentPage;
