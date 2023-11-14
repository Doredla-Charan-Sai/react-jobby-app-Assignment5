import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsStarFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {MdOutlineWork, MdLocationPin} from 'react-icons/md'
import Header from '../Header'
import SimilarJob from '../SimilarJob'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsList: {},
    similarJobs: [],
    jobAPIStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemApiCall()
  }

  getJobItemApiCall = async () => {
    this.setState({jobAPIStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const jobItemApi = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobItemApi, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetailsData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        rating: data.job_details.rating,
        location: data.job_details.location,
        title: data.job_details.title,
        packagePerAnnum: data.job_details.package_per_annum,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
      }
      const similars = data.similar_jobs.map(eachJob => ({
        id: eachJob.id,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        companyLogoUrl: eachJob.company_logo_url,
      }))
      this.setState({
        jobDetailsList: jobDetailsData,
        similarJobs: similars,
        jobAPIStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobAPIStatus: apiStatusConstants.failure})
      console.log('Sorry')
    }
  }

  renderCases = () => {
    const {jobAPIStatus} = this.state
    switch (jobAPIStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.success:
        return this.renderJobsSuccess()
      default:
        return null
    }
  }

  renderJobsFailureView = () => (
    <div className="jobs-detail-cont">
      <img
        className="opps-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="oops-head">Oops! Something Went Wrong</h1>
      <p className="oops-head opps-para">
        We cannot seem for the page you are looking for
      </p>
      <button type="button" className="login-btn" onClick={this.reset}>
        Retry
      </button>
    </div>
  )

  renderJobsSuccess = () => {
    const {jobDetailsList, similarJobs} = this.state
    console.log(similarJobs)
    const {
      location,
      rating,
      title,
      employmentType,
      jobDescription,
      companyLogoUrl,
      packagePerAnnum,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobDetailsList

    return (
      <div className="specific-job-cont">
        <div className="job-card">
          <div className="logo-name-rating-cont">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="company logo"
            />
            <div className="name-rating-cont">
              <h1 className="company-name">{title}</h1>
              <div className="logo-name-rating-cont">
                <BsStarFill className="star" />
                <p className="rate">{rating}</p>
              </div>
            </div>
          </div>
          <div className="loca-pack-cont">
            <div className="logo-name-rating-cont">
              <div className="logo-name-rating-cont">
                <MdLocationPin className="rate" style={{marginRight: '5px'}} />
                <p className="rate" style={{marginRight: '10px'}}>
                  {location}
                </p>
              </div>
              <div className="logo-name-rating-cont">
                <MdOutlineWork className="rate" style={{marginRight: '5px'}} />
                <p className="rate">{employmentType}</p>
              </div>
            </div>
            <p className="rate">{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="des-visit-cont">
            <h1 className="company-name ">Description</h1>
            <a href={companyWebsiteUrl} className="website-link">
              Visit <FiExternalLink />
            </a>
          </div>
          <p className="rate">{jobDescription}</p>
          <h1 className="company-name ">Skills</h1>
          <ul className="skills-cont">
            {skills.map(eachSkill => (
              <li className="skill-cont" key={eachSkill.name}>
                <img
                  className="company-logo"
                  src={eachSkill.imageUrl}
                  alt="skill icon"
                />
                <p className="rate">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="company-name ">Life at Company</h1>
          <div className="life-at-company-cont">
            <p className="rate">{lifeAtCompany.description}</p>
            <img
              className="life-at-img"
              src={lifeAtCompany.imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="similar-jobs-head">Similar Jobs</h1>
        <ul className="skills-cont">
          {similarJobs.map(eachJob => (
            <SimilarJob key={eachJob.id} similarJob={eachJob} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    return (
      <>
        <Header />
        {this.renderCases()}
      </>
    )
  }
}

export default JobItemDetails
