import React, { useContext, useState } from 'react';
import '../../Style/style.css';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import env from '../../env';
import { Mycontext } from '../../Config/context';
import { Loading } from '../Asset';
import ResponsiveDialog from '../Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { TextField } from '@mui/material';

const ScanStudentEntry = (props) => {
    const ctx = useContext(Mycontext);
    const [scanned, setscan] = useState(false);
    const [studentdata, setdata] = useState({});
    const [open, setopen] = useState(false);
    const [manually, setmanually] = useState('scan');
    const [studentid, setid] = useState('');

    const trackentry = async (data) => {
        await axios({
            method: 'post',
            url: env.api + 's-entry',
            headers: {
                Authorization: `Bearer ${ctx.user.token.accessToken}`
            },
            data: { url: data }
        })
            .then((res) => {
                setdata(res.data);
                setopen(true);
                document.body.style.backgroundColor = 'white';
            })
            .catch((err) => {
                setscan(false);
                toast.error(err.response?.data?.message, { duration: 2000 });
            });
    };
    const onNewScanResult = async (data) => {
        setscan(true);

        if (data) {
            if (props.type === 'scanentry') {
                await trackentry(data);
            } else {
                axios({
                    method: 'post',
                    url: env.api + 'r-pb',
                    headers: {
                        Authorization: `Bearer ${ctx.user.token.accessToken}`
                    },
                    data: {
                        borrow_id: data,
                        operation: 'pickup'
                    }
                })
                    .then((res) => {
                        setdata(res.data);
                        setopen(true);
                        document.body.style.backgroundColor = 'white';
                    })
                    .catch((err) => {
                        setscan(false);
                        toast.error('INVALID QRCODE', { duration: 2000 });
                    });
            }
        }
    };
    const handleError = (err) => {};
    const handleChange = (e) => setmanually(e.target.value);
    const handleSubmit = (e) => {
        setscan(true);
        e.preventDefault();
        trackentry(studentid).then(() => {
            e.target.reset();
            setscan(false);
        });
    };

    return (
        <div className="scanentry_container">
            <div className="scan_instruction">
                {props.type !== 'scanp-r' ? (
                    <>
                        <h1>Scan Student Entry</h1>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="demo-multiple-name-label">Type</InputLabel>
                            <Select labelId="demo-multiple-name-label" id="demo-multiple-name" value={manually} onChange={handleChange} label="Type" input={<OutlinedInput label="Type" />}>
                                <MenuItem value={'scan'}>Scan</MenuItem>
                                <MenuItem value={'input'}>Manually</MenuItem>
                            </Select>
                        </FormControl>
                        {manually === 'scan' && <h2>{scanned ? 'Student ID Scanned' : 'Place StudentID QR In The Red Box'}</h2>}
                    </>
                ) : (
                    <>
                        <h1>Scan Pickup QR CODE</h1>
                        <h2>{scanned ? 'QR CODE Scanned' : 'Place The Pickup QR CODE In The Red Box'}</h2>
                    </>
                )}
            </div>
            {manually === 'scan' ? (
                scanned ? (
                    <Loading />
                ) : (
                    <div className="qrcode_reader">
                        <QrScanner onDecode={onNewScanResult} onError={handleError} />
                    </div>
                )
            ) : (
                <form className="track_manually" onSubmit={handleSubmit}>
                    {scanned && <Loading />}
                    <TextField type="text" placeholder="Student ID" onChange={(e) => setid(e.target.value)} required fullWidth />
                    <button className="track_btn" type="submit">
                        {' '}
                        ENTER{' '}
                    </button>
                </form>
            )}
            <ResponsiveDialog open={open} type={props.type} data={studentdata} setscan={setscan} setopen={setopen} />
        </div>
    );
};

export default ScanStudentEntry;
