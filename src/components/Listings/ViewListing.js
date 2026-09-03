import React from 'react';
import { ListingInfo } from './ListingInfo';
import "./ViewListing.css";

export const ViewListing = () => {
  return (
    <div className='view-listing'>
      <div className="listing-viewbox">
        <ListingInfo />
      </div>
    </div>
  )
}
