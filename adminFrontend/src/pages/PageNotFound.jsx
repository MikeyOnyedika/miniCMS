import React from 'react'
import {Link} from 'react-router-dom'
const PageNotFound = () => {
  return (
    <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <h2 style={{ color: 'var(--secondary-clr)' }}>
            Oops, looks like you're lost.
        </h2>
        <Link to="/" style={{ backgroundColor: 'var(--secondary-clr)', color: 'var(--primary-clr)' }}>Home</Link>
    </div>
  )
}

export default PageNotFound