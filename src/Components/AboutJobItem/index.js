import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import {MdLocationOn} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import SimilarJobs from '../SimilarJobs'

import './index.css'

const aboutJobsPageStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AboutJobItem extends Component {
  state = {
    aboutJob: [],
    similarJobs: [],
    pageStatus: aboutJobsPageStatus.initial,
  }

  componentDidMount() {
    this.getAboutJob()
  }

  getAboutJob = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({pageStatus: aboutJobsPageStatus.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const aboutJobOptions = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, aboutJobOptions)
    if (response.ok) {
      const fetchedData = await response.json()
      const updateAboutJobItem = [fetchedData.job_details].map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        companyWebsiteUrl: eachItem.company_website_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        lifeAtCompany: {
          description: eachItem.life_at_company.description,
          imageUrl: eachItem.life_at_company.image_url,
        },
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
        skills: eachItem.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
      }))

      const updatedSimilarJobDetails = fetchedData.similar_jobs.map(
        eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          location: eachItem.location,
          rating: eachItem.rating,
          title: eachItem.title,
        }),
      )

      this.setState({
        aboutJob: updateAboutJobItem[0],
        similarJobs: updatedSimilarJobDetails,
        pageStatus: aboutJobsPageStatus.success,
      })

      //   console.log(fetchedData, updateAboutJobItem)
    } else {
      this.setState({pageStatus: aboutJobsPageStatus.failure})
    }
  }

  pageInProgress = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  pageSuccess = () => {
    const {aboutJob} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      skills,
      lifeAtCompany,
      rating,
      title,
    } = aboutJob

    return (
      <div className="about-item-body">
        <div className="first-part-container">
          <div className="img-title-container">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="company logo"
            />
            <div className="title-rating-container">
              <h1 className="title-heading">{title}</h1>
              <div className="star-rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating-text">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-package-container">
            <div className="location-job-type-container">
              <div className="location-icon-location-container">
                <MdLocationOn className="location-icon" />
                <p className="location">{location}</p>
              </div>
              <div className="employment-type-icon-employment-type-container">
                <p className="job-type">{employmentType}</p>
              </div>
            </div>
            <div>
              <p className="package">{packagePerAnnum}</p>
            </div>
          </div>
        </div>
        <hr className="item-hr-line" />
        <div className="second-part-container">
          <div className="description-link">
            <h1 className="description-heading">Description</h1>
            <a className="visit-anchor" href={companyWebsiteUrl}>
              Visit <BiLinkExternal />
            </a>
          </div>
          <p className="description-para">{jobDescription}</p>
          <div className="skills-container">
            <h1 className="heading">Skills</h1>

            <ul className="skills-body">
              {skills.map(eachSkill => (
                <li className="each-skill-item-container" key={eachSkill.name}>
                  <img
                    className="skill-logo"
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                  />
                  <h4 className="skill-name">{eachSkill.name}</h4>
                </li>
              ))}
            </ul>
            <div className="life-at-company">
              <div className="life-at-company-intro">
                <h1 className="heading">Life at Company</h1>
                <p className="description">{lifeAtCompany.description}</p>
              </div>
              <div>
                <img
                  className="description-img"
                  src={lifeAtCompany.imageUrl}
                  alt="life at company"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getRetryPage = () => {
    this.getAboutJob()
  }

  pageFailure = () => (
    <div className="jobs-failure-page">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        we cannot seem to find the page you are looking for
      </p>
      <div className="jobs-failure-button-container">
        <button
          className="failure-button btn"
          type="button"
          onClick={this.getRetryPage}
        >
          retry
        </button>
      </div>
    </div>
  )

  AboutJobItemBody = () => {
    const {pageStatus} = this.state

    switch (pageStatus) {
      case aboutJobsPageStatus.inProgress:
        return this.pageInProgress()
      case aboutJobsPageStatus.success:
        return this.pageSuccess()
      case aboutJobsPageStatus.failure:
        return this.pageFailure()
      default:
        return null
    }
  }

  render() {
    const {aboutJob, similarJobs} = this.state

    return (
      <div className="about-job_item-container">
        <Header />
        {this.AboutJobItemBody()}
        <ul className="similar-jobs">
          {similarJobs.map(each => (
            <SimilarJobs
              similarJobs={each}
              key={each.id}
              employmentType={aboutJob.employmentType}
            />
          ))}
        </ul>
      </div>
    )
  }
}

export default AboutJobItem
