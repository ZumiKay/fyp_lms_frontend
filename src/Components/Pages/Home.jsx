import React, { useContext, useEffect, useState } from 'react';
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
import { Loading, setimage } from '../Asset';
import usePagination from '../../Config/usePaginitaion';
import { useNavigate } from 'react-router-dom';

const Home = ({ book_data }) => {
    const ctx = useContext(Mycontext);
    const [change , setchange] = useState(false)
    const [openfilter, setopen] = useState(false)
    const handleresize = () => {
        if(window.innerWidth < 1090) {
            setchange(true)
        } else {
            setchange(false)
        }
    }
    useEffect(() => {
        if(ctx.filter_cat !== '' ) {
            window.scrollTo({top:0 , behavior: 'smooth'})
        }
       
    } , [ctx.filter_cat])
    useEffect(() =>
    {
        if(window.innerWidth < 1090) {
            setchange(true)
        } else {
            setchange(false)
        }
       
        window.addEventListener('resize' , handleresize) 

        return () => window.removeEventListener('resize' , handleresize) 
    }
    , [])
    return (
        <>
            <div style={ctx.openMenu.search ? {marginTop: "50px"} : {}}  className="Home_page">
            {ctx.search !== '' && <SliderContainer title={ctx.search} book={book_data} type={'search'}/> }
                {ctx.filter_cat !== '' ? (
                    <SliderContainer title={ctx.filter_cat} book={book_data} type="filter" />
                ) : (
                    <>
                       
                    </>
                )}
               
                <h1 className="section_title">All Books</h1>
                {ctx.loading.booklist && <Loading/>}
                <AllbookContainer book_data={book_data.allbooks ?? []} />
            </div>
            {change  ? 
           
           (openfilter ?  <FilterNavigation book={book_data.allcategories} resize={change} setopen={setopen} />  :  <i onClick={() => setopen(true)} className="fa-sharp fa-solid fa-filter fa-xl filter-icon"></i>)
             : 
            <FilterNavigation book={book_data.allcategories} resize={change} /> }
        </>
    );
};

export default Home;

const SliderContainer = ({ title, book, type }) => {
    const [filter , setfilter] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
       
        let filteredbook = book?.allbooks?.filter((book) => {
            if(book?.categories[0].trim().toLowerCase().includes(title?.trim().toLowerCase())) {
                return book
            } else if(book?.title.trim().toLowerCase().includes(title?.trim().toLowerCase())) {
                return book
            } else if(book?.author[0].trim().toLowerCase().includes(title?.trim().toLowerCase())) {
                return book
            } else if (book?.ISBN[0].identifier.trim().includes(title?.trim())) {
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
    const trackpage = localStorage.getItem('page')
    const [currentPage, setcurrentPage] = useState(trackpage !== null ? JSON.parse(trackpage) : 1);
    const count = Math.ceil(book_data.length / pageSize);
    const slicedData = usePagination(book_data, pageSize);
    const navigate = useNavigate();
    
    const handleChange = (e, p) => {
        setcurrentPage(p);
        slicedData.jump(p);
        localStorage.setItem('page' , JSON.stringify(p))
    };
   
    return (
        <div className="allbook_container">
            <div className='book'>
            {slicedData.currentData().map((i) => (
                <div className="book_container">
                    <img onClick={() => navigate(`/book/${i.title}`)} src={i.cover_img && i.cover_img !== '' ? i.cover_img : setimage.Default} alt="cover" className="book_cover" />
                    <p className="book_title">{i.title}</p>
                </div>
            ))}
            </div>

            <Pagination className="pagination_container" page={currentPage} size="large" count={count} onChange={handleChange} showFirstButton showLastButton />
        </div>
    );
};

const FilterNavigation = ({ book , resize , setopen }) => {
    const [search, setsearch] = useState('');
    const ctx = useContext(Mycontext);
    return (
        <>
        
        <div className="Filter_container">
            {resize && <i onClick={() => setopen(false)} class="fa-solid fa-circle-xmark fa-2xl" style={{marginBottom: '20px',marginTop: '10px'}}></i>}
            <input type="text" id="search_cate" onChange={(e) => {
                setsearch(e.target.value)
                 }} placeholder="Search Categories" />
                
            {book
                ?.filter((i) => i?.some((j) => j.includes(search)))
                ?.map((cate) => (
                    <p key={book?.allcategories?.indexOf(cate)} onClick={() => ctx.setfilter_cat(cate[0])} style={ctx.filter_cat === cate[0] ? {backgroundColor: 'black'} : { backgroundColor: 'bluecoral' }} className="filter_option">
                        
                        {' '}
                        {cate}{' '}
                    </p>
                ))}
        </div>
        </>
    );
};
