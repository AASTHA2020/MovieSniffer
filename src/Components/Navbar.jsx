import "../index.css"
import React from 'react'

function Logo(){
  return(
      <div className="logo">
        <span role="img">🍿</span>
        <h1>MovieSniffer</h1>
      </div>
  )
}



function Navbar({children}){
    return(
        <nav className="nav-bar">
          <Logo/>
        {children}
      </nav>
    )
}
export default Navbar;
