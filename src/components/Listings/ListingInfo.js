import React from 'react';
import './ListingInfo.css';
import GradeTwoToneIcon from '@mui/icons-material/GradeTwoTone';

export const ListingInfo = ({id, image, title, location, rating, price}) => {
  return (
        <div className='listing'>
            <img src={image} />
            <div className="listing-info">
                <h2 className="listing-title">{title}</h2>
                <span className="location">Where: {location}</span>
                <p className="product-price">From <small>R</small>{price}/guest</p>
                <div className="rating">
                    <span>Reviews: {Array(rating).fill().map((_, i)=>(<GradeTwoToneIcon />))}</span>
                </div>
            </div>
        </div>
  )
}
