import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav>
      <ul className="nav-cont">
        <Link to="/" className="link">
          <li>
            <img
              className="jobby-logo header-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </li>
        </Link>
        <li className="links-cont">
          <Link to="/" className="link">
            <p className="link-txt">Home</p>
          </Link>
          <Link to="/jobs" className="link">
            <p className="link-txt">Jobs</p>
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="login-btn logout"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
