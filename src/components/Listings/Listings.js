import React, { useState } from 'react';
import { Link } from "react-router-dom";
import "./Listings.css";
import { ListingInfo } from './ListingInfo';
import { nanoid } from 'nanoid';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const uid = () => nanoid(5, '0123456789');

export const Listings = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = (event) => {
    setIsFavorited(prev => !prev);
    event.preventDefault();
  };

  const handleScroll = (direction, event) => {
    const container = event.currentTarget.closest('.listing-array').querySelector('.listing-box-container');
    const scrollAmount = 300;
    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else if (direction === 'right') {
      container.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className='listing-array'>
      <div className="listing-box-container">        
        <Link to={`/viewlisting/${"Event" + uid()}`} className="listing-box">
          <div>
            <span>Trending</span>
            <span className="heart" onClick={(event) => toggleFavorite(event)}>
              {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </span>
          </div>
          <ListingInfo 
          id={"Event" + uid()}
          location="Cape Town, South Africa"
          title="yuh"
          image="https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480"
          rating={5}
          price="250.00"
          />
        </Link>
        <Link to={`/viewlisting/${"Event" + uid()}`} className="listing-box">
          <div>
            <span>Trending</span>
            <span className="heart" onClick={(event) => toggleFavorite(event)}>
              {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </span>
          </div>
          <ListingInfo 
          id={"Event" + uid()}
          location="Cape Town, South Africa"
          title="yuh"
          image="https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480"
          rating={5}
          price="250.00"
          />
        </Link>
        <Link to={`/viewlisting/${"Event" + uid()}`} className="listing-box">
          <div>
            <span>Trending</span>
            <span className="heart" onClick={(event) => toggleFavorite(event)}>
              {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </span>
          </div>
          <ListingInfo 
          id={"Event" + uid()}
          location="Cape Town, South Africa"
          title="yuh"
          image="https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480"
          rating={5}
          price="250.00"
          />
        </Link>
        <Link to={`/viewlisting/${"Event" + uid()}`} className="listing-box">
          <div>
            <span>Trending</span>
            <span className="heart" onClick={(event) => toggleFavorite(event)}>
              {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </span>
          </div>
          <ListingInfo 
          id={"Event" + uid()}
          location="Cape Town, South Africa"
          title="yuh"
          image="https://a0.muscache.com/im/pictures/Mt/MtTemplate-7242285/original/9b148e51-7e53-4e5e-9e75-3292258c8767.jpeg?im_w=480"
          rating={5}
          price="250.00"
          />
        </Link>
      </div>
      <div className="arrow-nav">
        <button className="scroll-arrow" onClick={(event) => handleScroll('left', event)}>
          <NavigateBeforeIcon />
        </button>
        <button className="scroll-arrow" onClick={(event) => handleScroll('right', event)}>
          <NavigateNextIcon />
        </button>
      </div>
    </div>
    
  )
}
