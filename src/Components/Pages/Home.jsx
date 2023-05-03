import React, { useContext, useMemo, useState } from 'react';
import '../../Style/style.css';
import { Mycontext } from '../../Config/context';
import { Navigation, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';
import Pagination from '@mui/material/Pagination';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useEffect } from 'react';
import axios from 'axios';
import env from '../../env';
import { setOfColor, setimage } from '../Asset';
import usePagination from '../../Config/usePaginitaion';
import { Stack } from '@mui/material';

const Home = (props) => {
    const ctx = useContext(Mycontext);
    const [book_data, setbook] = useState({});
    const getbook = async () => {
      const res = await axios({
            method: 'get',
            url: env.api + 'getbook',
            headers: {
                Authorization: `Bearer ${ctx.user.token.accessToken}`
            }
        })
      const books = res.data;
      let allcategories = books.allcategories.filter((arr, index) => {
                return (
                        index ===
                        books.allcategories.findIndex((inner) => {
                            return inner.toString().toLowerCase() === arr.toString().toLowerCase();
                        })
                    );
                });
                setbook({
                    allcategories: allcategories,
                    allbooks: books.books
                });
         
    };
    useEffect(() => {
        getbook();
    }, []);

    return (
        <>
            <div style={ctx.openMenu.menu ? { marginLeft: '310px' } : {}} className="Home_page">
                <SliderContainer title={'Popular Book'} />
                <SliderContainer title={'Lastest Book'} />
                <h1 className="section_title">All Books</h1>
                <AllbookContainer book_data={book_data.allbooks ?? []} />
            </div>
            <FilterNavigation book={book_data.allcategories} />
        </>
    );
};

export default Home;

const SliderContainer = (props) => {
    return (
        <div className="slider_container">
            <h1 className="title">{props.title}</h1>
            <Swiper modules={[Navigation, A11y]} spaceBetween={50} slidesPerView={'auto'} className="slider">
                {[1, 2, 3, 4, 5].map((i) => (
                    <SwiperSlide className="swiper_slide">
                        <div className="book">
                            <img src={setimage.Default} alt="" className="book_cover" />
                            <div className="book_title">Book Title</div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

const AllbookContainer = ({ book_data }) => {
    const pageSize = 6;
    const [currentPage, setcurrentPage] = useState(1);
    const count = Math.ceil(book_data.length / pageSize);
    const slicedData = usePagination(book_data , pageSize);

    const handleChange = (e, p) => {
        setcurrentPage(p);
        slicedData.jump(p);
    };
   

    return (
        <div className="allbook_container">
            {slicedData.currentData().map((i) => (
                <div className="book_container">
                    <img src={i.cover_img && i.cover_img !== '' ? i.cover_img : setimage.Default} alt="cover" className="book_cover" />
                    <p className="book_title">{i.title}</p>
                </div>
            ))}

            <Pagination className="pagination_container" page={currentPage} size="large" count={count} onChange={handleChange} showFirstButton showLastButton />
        </div>
    );
};

const FilterNavigation = ({ book }) => {
    const [search,setsearch] = useState('')
   
    return (
        <div className="Filter_container">
            <input type="text" id="search_cate" onChange={(e) => setsearch(e.target.value.toLowerCase().replace(/\s+/g, ''))} placeholder="Search Categories" />
            {(book?.filter(i => i.some( j => j.toLowerCase().includes(search))))?.map((cate) => (
                <p key={book?.indexOf(cate)} style={{ backgroundColor: 'bluecoral' }} className="filter_option">
                    {' '}
                    {cate}{' '}
                </p>
            ))}
        </div>
    );
};
