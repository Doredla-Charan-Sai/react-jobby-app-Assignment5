import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {BsSearch} from 'react-icons/bs'
// import {BsStarFill} from 'react-icons/bs'
// import {MdOutlineWork, MdLocationPin} from 'react-icons/md'
// import {Link} from 'react-router-dom'
import JobItem from '../JobItem'
import Header from '../Header'
import './index.css'

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]
const jwtToken = Cookies.get('jwt_token')
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}
const apiProfileStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class Jobs extends Component {
  state = {
    userProfile: {},
    activeEmployements: [],
    activeSalaryRange: '',
    searchInput: '',
    jobAPIStatus: apiStatusConstants.initial,
    jobsList: [],
  }

  componentDidMount() {
    this.getProfileAPICall()
    this.getJobsApiCall()
  }

  getProfileAPICall = async () => {
    this.setState({
      apiProfileStatus: apiProfileStatusConstants.inProgress,
      activeEmployements: [],
      activeSalaryRange: '',
      searchInput: '',
      jobAPIStatus: apiStatusConstants.initial,
    })
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedProfileData = {
        name: data.profile_details.name,
        shortBio: data.profile_details.short_bio,
        profileImageUrl: data.profile_details.profile_image_url,
      }
      this.setState({
        userProfile: updatedProfileData,
        apiProfileStatus: apiProfileStatusConstants.success,
      })
    } else {
      this.setState({apiProfileStatus: apiProfileStatusConstants.failure})
    }
  }

  getJobsApiCall = async () => {
    this.setState({jobAPIStatus: apiStatusConstants.inProgress})
    const {activeEmployements, activeSalaryRange, searchInput} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${activeEmployements}&minimum_package=${activeSalaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.jobs.map(eachJob => ({
        id: eachJob.id,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        companyLogoUrl: eachJob.company_logo_url,
        packagePerAnnum: eachJob.package_per_annum,
      }))

      this.setState({
        jobsList: formattedData,
        jobAPIStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobAPIStatus: apiStatusConstants.failure})
    }
  }

  reset = () => {
    this.setState(
      {
        activeEmployements: [],
        activeSalaryRange: '',
        searchInput: '',
        jobAPIStatus: apiStatusConstants.initial,
      },
      this.getJobsApiCall(),
    )
  }

  onCheck = event => {
    const {activeEmployements} = this.state
    if (activeEmployements.includes(event.target.value)) {
      this.setState(
        prevState => ({
          activeEmployements: prevState.activeEmployements.filter(
            eachEmployment => event.target.value !== eachEmployment,
          ),
        }),
        this.getJobsApiCall,
      )
    } else {
      this.setState(
        prevState => ({
          activeEmployements: [
            ...prevState.activeEmployements,
            event.target.value,
          ],
        }),
        this.getJobsApiCall,
      )
    }
  }

  onChangeRadio = event => {
    this.setState({activeSalaryRange: event.target.value}, this.getJobsApiCall)
  }

  renderFailureProfile = () => (
    <div className="failure-profile-cont">
      <button
        type="button"
        className="login-btn"
        onClick={this.getProfileAPICall}
      >
        Retry
      </button>
    </div>
  )

  onSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  getSearchInput = () => {
    this.getJobsApiCall()
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderCases = () => {
    const {jobAPIStatus, jobsList, apiProfileStatus} = this.state
    switch (jobAPIStatus) {
      case apiStatusConstants.success:
        if (
          jobsList.length !== 0 &&
          apiProfileStatus === apiProfileStatusConstants.success
        ) {
          return this.renderJobsSuccess()
        }
        if (
          jobsList.length !== 0 &&
          apiProfileStatus !== apiProfileStatusConstants.success
        ) {
          return this.renderLoader()
        }
        return this.noJobsFoundView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderProfileCases = () => {
    const {apiProfileStatus, userProfile} = this.state
    switch (apiProfileStatus) {
      case apiProfileStatusConstants.failure:
        return this.renderFailureProfile()
      case apiProfileStatusConstants.inProgress:
        return this.renderLoader()
      case apiProfileStatusConstants.success:
        if (userProfile.length !== 0) {
          return this.renderProfileSuccess()
        }
        return this.renderFailureProfile()
      default:
        return null
    }
  }

  renderProfileSuccess = () => {
    const {userProfile} = this.state
    const {name, shortBio, profileImageUrl} = userProfile
    return (
      <div className="user-profile-cont">
        <img className="profile-pic" src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="short-bio">{shortBio}</p>
      </div>
    )
  }

  noJobsFoundView = () => {
    console.log('no jobs')
    return (
      <div className="no-jobs-cont">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs"
        />
        <h1 className="oops-head">No Jobs Found</h1>
        <p className="oops-head opps-para">
          We could not find any jobs. Try other filters
        </p>
      </div>
    )
  }

  renderJobsFailureView = () => (
    <div className="failure-jobs-bg-cont">
      <img
        className="opps-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="oops-head">Oops! Something Went Wrong</h1>
      <p className="oops-head opps-para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="login-btn" onClick={this.reset}>
        Retry
      </button>
    </div>
  )

  renderJobsSuccess = () => {
    const {jobsList} = this.state
    return (
      <ul className="jobs-list-cont">
        {jobsList.map(job => (
          <JobItem key={job.id} jobCard={job} />
        ))}
      </ul>
    )
  }

  render() {
    const {activeSalaryRange} = this.state
    return (
      <>
        <div className="jobs-cont">
          <Header />
          <div className="two-conts">
            <div className="profile-select-cont">
              {this.renderProfileCases()}
              <hr className="line" />
              <div className="check-box-cont">
                <h1 className="check-title">Type of Employment</h1>
                <ul className="check-list-cont">
                  {employmentTypesList.map(checkItem => (
                    <li
                      className="list-checkbox"
                      key={checkItem.employmentTypeId}
                    >
                      <input
                        type="checkbox"
                        onChange={this.onCheck}
                        value={checkItem.employmentTypeId}
                        id={checkItem.employmentTypeId}
                        className="checkbox"
                      />
                      <label
                        htmlFor={checkItem.employmentTypeId}
                        className="label"
                      >
                        {checkItem.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <hr className="line" />
              <div className="check-box-cont">
                <h1 className="check-title">Salary Range</h1>
                <ul
                  className="check-list-cont"
                  onChange={this.onChangeRadio}
                  value={activeSalaryRange}
                >
                  {salaryRangesList.map(checkItem => (
                    <li className="list-checkbox" key={checkItem.salaryRangeId}>
                      <input
                        type="radio"
                        value={checkItem.salaryRangeId}
                        id={checkItem.salaryRangeId}
                        name="salaries"
                        className="checkbox"
                      />
                      <label
                        htmlFor={checkItem.salaryRangeId}
                        className="label"
                      >
                        {checkItem.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="search-jobs-list">
              <div className="search-cont">
                <input
                  type="search"
                  placeholder="Search"
                  onChange={this.onSearch}
                  className="search-ip"
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  label="search"
                  className="search-btn"
                  onClick={this.getSearchInput}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
              {this.renderCases()}
            </div>
          </div>
        </div>
        ){/* } */}
      </>
    )
  }
}
export default Jobs
