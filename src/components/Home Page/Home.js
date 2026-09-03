import React from 'react';
import { Route } from "react-router-dom";
import "./Home.css";
import { Listings } from '../Listings/Listings';

export const Home = () => {
  return (
    <div className='home-page'>
      <section>
        <h1>Accomodations in: Johannesburg</h1>
        <Listings />
      </section>
      <section>
        <h1>Popular Experiences:</h1>
        <Listings />
      </section>
      <section>
        <h1>Happening today:</h1>
        <Listings />
      </section>
    </div>
  )
}