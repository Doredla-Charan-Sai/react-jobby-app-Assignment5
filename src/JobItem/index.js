import {BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const JobItem = props => {
  const {jobCard} = props
  const {
    id,
    location,
    rating,
    title,
    employmentType,
    jobDescription,
    companyLogoUrl,
    packagePerAnnum,
  } = jobCard

  return (
    <Link to={`/jobs/${id}`} className="link">
      <li className="job-card">
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
              <BsFillBriefcaseFill
                className="rate"
                style={{marginRight: '5px'}}
              />
              <p className="rate" style={{marginRight: '10px'}}>
                {location}
              </p>
            </div>
            <div className="logo-name-rating-cont">
              <MdLocationOn className="rate" style={{marginRight: '5px'}} />
              <p className="rate">{employmentType}</p>
            </div>
          </div>
          <p className="rate">{packagePerAnnum}</p>
        </div>
        <hr className="line" />
        <h1 className="company-name ">Description</h1>
        <p className="rate">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default withRouter(JobItem)
