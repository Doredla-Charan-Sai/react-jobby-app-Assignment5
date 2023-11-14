import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

class Home extends Component {
  render() {
    const token = Cookies.get('jwt_token')
    if (token === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div className="home-bg-cont">
        <Header />
        <div className="home-txt-cont">
          <h1 className="main-home-head">Find The Job That Fits Your Life</h1>
          <p className="main-home-para">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs" className="link">
            <button
              type="button"
              className="login-btn"
              onClick={this.onFindJobs}
            >
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    )
  }
}
export default Home
