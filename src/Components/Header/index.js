import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const logoutBtn = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <Link to="/" className="header-link">
        <img
          className="logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <div>
        <Link to="/" className="header-link">
          Home
        </Link>
        <Link to="/allJobs" className="header-link">
          Jobs
        </Link>
      </div>
      <button className="btn" type="button" onClick={logoutBtn}>
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
