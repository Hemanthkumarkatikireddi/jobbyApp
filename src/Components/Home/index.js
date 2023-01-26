import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import Header from '../Header'
import './index.css'

const Home = () => {
  const token = Cookies.get('jwt_token')
  if (token === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="sub-box">
          <h1>Find The Job That Fits Your Life</h1>
          <p className="description">
            Millions of peoples are searching for jobs,salary
            information,company reviews, Find the jobs that fits your abilities
            and potential.
          </p>
          <Link to="/allJobs">
            <button className="btn" type="button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}
export default Home
