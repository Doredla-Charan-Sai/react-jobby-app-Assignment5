import {BsStarFill} from 'react-icons/bs'
import {MdOutlineWork, MdLocationPin} from 'react-icons/md'
import './index.css'

const SimilarJob = props => {
  const {similarJob} = props
  const {
    location,
    rating,
    title,
    employmentType,
    jobDescription,
    companyLogoUrl,
  } = similarJob
  return (
    <li className="simi-job-cont">
      <div className="logo-name-rating-cont">
        <img className="company-logo" src={companyLogoUrl} alt="company logo" />
        <div className="name-rating-cont">
          <h1 className="company-name">{title}</h1>
          <div className="logo-name-rating-cont">
            <BsStarFill className="star" />
            <p className="rate">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="company-name ">Description</h1>
      <p className="rate">{jobDescription}</p>
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
      </div>
    </li>
  )
}

export default SimilarJob