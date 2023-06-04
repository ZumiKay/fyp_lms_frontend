import '../Style/style.css';
import loadingimg from '../Image/loading.png'
export const setimage = {
    Loading: 'https://firebasestorage.googleapis.com/v0/b/fyp-9ae4d.appspot.com/o/PARAGON%20U%20LIBRARY%20(1).png?alt=media&token=4786dd01-c2c1-4ba5-95c4-22f3066ca386',
    Logo: 'https://firebasestorage.googleapis.com/v0/b/fyp-9ae4d.appspot.com/o/PARAGON%20U%20LIBRARY-4.png?alt=media&token=76c99524-963d-4783-9d08-4f9d98bd5ab1',
    Menu: 'https://firebasestorage.googleapis.com/v0/b/fyp-9ae4d.appspot.com/o/menu-1-svgrepo-com%202.svg?alt=media&token=f714b633-1d1c-44d7-930f-1f81427dd837',
    Bell: 'https://firebasestorage.googleapis.com/v0/b/fyp-9ae4d.appspot.com/o/notification-3%201.svg?alt=media&token=0b3c6764-1854-4ba1-9ebc-1073334b5f57',
    Search: 'https://firebasestorage.googleapis.com/v0/b/fyp-9ae4d.appspot.com/o/search%201.svg?alt=media&token=2709e552-854e-4b37-9924-d33d1e787c7c',
    Default: 'https://firebasestorage.googleapis.com/v0/b/fyp-9ae4d.appspot.com/o/default-image%20(1).jpg?alt=media&token=80f3bc8d-d7be-46db-b899-11b2323d55aa'
};
export const setOfColor = [
    '#FFD12A',
    '#4F86F7',
    '#C95A49',
    '#BD8260',
    '#FFFF31',
    '#44D7A8',
    '#A6E7FF',
    '#6F2DA8',
    '#DA614E',
    '#253529',
    '#FFFF38',
    '#1A1110',
    '#DB91EF',
    '#B2F302',
    '#FFE4CD',
    '#214FC6',
    '#FF8866',
    '#FFD0B9',
    '#45A27D',
    '#FF5050',
    '#FFCFF1',
    '#738276',
    '#CEC8EF',
    '#FC5A8D',
    '#FF878D'
];

export const Loading = () => {
    return (
        <div className="loading_container ">
            <img src={loadingimg} alt="loading" className="loading cycle ld ld-spin" />
        </div>
    );
};
