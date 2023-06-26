import React, { useContext, useEffect, useState } from 'react';
import '../../Style/style.scss';
import DataTable from '../DataTable';
import axios from 'axios';
import { Mycontext } from '../../Config/context';
import env, { createData } from '../../env';
import { Loading } from '../Asset';

function countVisitsByTimeRange(dates) {
    const now = new Date();
    const past1months = new Date()
    past1months.setMonth(now.getMonth() - 1)
    const past6Months = new Date();
    past6Months.setMonth(now.getMonth() - 6);

    
    let visitsBy6months = 0;

    let result;
    dates.forEach(({ createdAt }) => {
        const entryDate = new Date(createdAt);
       
        if (entryDate >= past6Months && entryDate >= past1months &&entryDate <= now) {
            visitsBy6months++;
        }
    });

    if (visitsBy6months > 0) {
        result = `${visitsBy6months} time(s) for the past years`;
    } else {
        result = 'No Entry';
    }

    return result;
}

const ListofStudentPage = () => {
    const ctx = useContext(Mycontext);
    const [studentdata, setstudent] = useState([]);
    const [loading , setloading] = useState(false)
    const getStudent = () => {
        setloading(true);
        let students = [];
        axios({
            method: 'get',
            url: env.api + 'getstudent',
            headers: { Authorization: `Bearer ${ctx.user.token.accessToken}` }
        }).then((res) => {
            
            res.data.map((i) => students.push(createData(i.studentID, i.firstname + ' ' + i.lastname, i.department, i.email, i.phonenumber, countVisitsByTimeRange(i.library_entry), i.borrow_book)));
            ctx.setstudent(students);
            setstudent(res.data);
            setloading(false);
        });
    };
    
    useEffect(() => {
        getStudent();
        
    }, []);
    return (
        <div className="studentlist_container">
           {loading && <Loading />}
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
