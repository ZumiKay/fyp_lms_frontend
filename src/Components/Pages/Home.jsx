import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import { setimage } from '../Asset';
import usePagination from '../../Config/usePaginitaion';
import { Navigate, useNavigate } from 'react-router-dom';

const Home = ({ book_data }) => {
    const ctx = useContext(Mycontext);
    useEffect(() => {
        if(ctx.filter_cat !== '' ) {
            window.scrollTo({top:0 , behavior: 'smooth'})
        }
    } , [ctx.filter_cat])
    return (
        <>
            <div style={ctx.openMenu.menu ? { marginLeft: '310px' } : {}} className="Home_page">
            {ctx.search !== '' && <SliderContainer title={ctx.search} book={book_data} type={'search'}/> }
                {ctx.filter_cat !== '' ? (
                    <SliderContainer title={ctx.filter_cat} book={book_data} type="filter" />
                ) : (
                    <>
                       
                    </>
                )}
               
                <h1 className="section_title">All Books</h1>
                <AllbookContainer book_data={book_data.allbooks ?? []} />
            </div>
            <FilterNavigation book={book_data.allcategories} />
        </>
    );
};

export default Home;

const SliderContainer = ({ title, book, type }) => {
    const [filter , setfilter] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
       
        let filteredbook = book?.allbooks?.filter((book) => {
            if(book.categories[0].trim().toLowerCase().includes(title.trim().toLowerCase())) {
                return book
            } else if(book.title.trim().toLowerCase().includes(title?.trim().toLowerCase())) {
                return book
            } else if(book.author[0].trim().toLowerCase().includes(title.trim().toLowerCase())) {
                return book
            } else if (book.ISBN[0].identifier.trim().includes(title.trim())) {
                return book
            }
        })
        setfilter(filteredbook)
    } , [book , title])
    return (
        <div className="slider_container">
            <h1 className="title">{type === 'filter' ? title : `Search for: ${title}`}</h1>
            <Swiper modules={[Navigation, A11y]} spaceBetween={50} slidesPerView={'auto'} className="slider">
                {(filter !== undefined ? filter : [1,2,3,4,5])?.map((i) => (
                    <SwiperSlide className="swiper_slide">
                        <div onClick={() => navigate(`/book/${i.title}`)} className="book">
                            <img src={i.cover_img ? i.cover_img : setimage.Default} alt="" className="book_cover" />
                            <div className="book_title">{i.title}</div>
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
    const slicedData = usePagination(book_data, pageSize);
    const navigate = useNavigate();
    const handleChange = (e, p) => {
        setcurrentPage(p);
        slicedData.jump(p);
    };

    return (
        <div className="allbook_container">
            {slicedData.currentData().map((i) => (
                <div className="book_container">
                    <img onClick={() => navigate(`/book/${i.title}`)} src={i.cover_img && i.cover_img !== '' ? i.cover_img : setimage.Default} alt="cover" className="book_cover" />
                    <p className="book_title">{i.title}</p>
                </div>
            ))}

            <Pagination className="pagination_container" page={currentPage} size="large" count={count} onChange={handleChange} showFirstButton showLastButton />
        </div>
    );
};

const FilterNavigation = ({ book }) => {
    const [search, setsearch] = useState('');
    const ctx = useContext(Mycontext);
    return (
        <div className="Filter_container">
            <input type="text" id="search_cate" onChange={(e) => {
                setsearch(e.target.value)
                 }} placeholder="Search Categories" />
                
            {book
                ?.filter((i) => i.some((j) => j.toLowerCase().includes(search)))
                ?.map((cate) => (
                    <p key={book?.allcategories?.indexOf(cate)} onClick={() => ctx.setfilter_cat(cate[0])} style={ctx.filter_cat === cate[0] ? {backgroundColor: 'black'} : { backgroundColor: 'bluecoral' }} className="filter_option">
                        {' '}
                        {cate}{' '}
                    </p>
                ))}
        </div>
    );
};
