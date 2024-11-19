import React from 'react';
import '../Navbarr/Navbarr.css';
import { Link } from 'react-router-dom';

const Navbarr = () => {
  return (
  <> 
  <div className='nav-bar'> 
  <div className="positionn">
    <Link to='/'> 
          <b style={{ cursor: 'pointer', color: 'white'  }}> Products </b>
          </Link>
          <Link to="/billing">
            <b style={{ cursor: 'pointer', color: 'white' }}> Billing </b>
          </Link>
        </div>
        </div>
        {/* <div style={{backgroundColor:'#AAABB8',width:'100%',height:'100vh',position:'fixed',marginTop:'2rem'}}> 
        </div> */}
  </>
  )
}

export default Navbarr