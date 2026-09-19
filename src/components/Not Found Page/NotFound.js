import React from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import './NotFound.css'
import '../../Responsive Styles/ResponsiveNotFound.css'

export const NotFound = () => {
  return (
    <div className="not-found">
      <Link to="/">
        <img src="https://cdn.dribbble.com/userupload/26627208/file/original-997cfd86b7e1e12f436cfde62fc88b44.gif" alt="404 Page Not Found" />
      </Link>
      <div>
        <h1>Page Not Found | Error:404</h1>
        <p>The page you are looking for does not exist. Please check the URL or return to the <Link to="/">homepage</Link>.</p>
      </div>
    </div>
  )
}
