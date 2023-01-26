import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Loader from 'react-loader-spinner'

import JobItem from '../JobItem'

import Header from '../Header'
import './index.css'

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

const pageStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AllJobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    profileStatus: pageStatus.initial,
    jobsStatus: pageStatus.initial,
    employmentType: [],
    salaryRange: '',
    searchValue: '',
  }

  componentDidMount() {
    this.getAllJobs()
    this.getProfile()
  }

  getAllJobs = async () => {
    this.setState({jobsStatus: pageStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {employmentType, salaryRange, searchValue} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${searchValue}`
    const optionsJobs = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, optionsJobs)

    if (response.ok) {
      const fetchedJobsData = await response.json()

      const updateJobs = fetchedJobsData.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({jobsData: updateJobs})
      this.setState({jobsStatus: pageStatus.success})
    } else {
      this.setState({jobsStatus: pageStatus.failure})
    }
  }

  getProfile = async () => {
    this.setState({profileStatus: pageStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const optionsProfile = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, optionsProfile)

    if (response.ok) {
      const fetchedProfileData = await response.json()
      const updateProfileData = {
        name: fetchedProfileData.profile_details.name,
        profileUrl: fetchedProfileData.profile_details.profile_image_url,
        bio: fetchedProfileData.profile_details.short_bio,
      }
      this.setState({profileData: updateProfileData})
      this.setState({profileStatus: pageStatus.success})
    } else {
      this.setState({profileStatus: pageStatus.failure})
    }
  }

  getUser = () => {
    const {profileData} = this.state
    const {name, profileUrl, bio} = profileData
    return (
      <div className="user-profile-success">
        <img src={profileUrl} className="profile-icon" alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-description">{bio}</p>
      </div>
    )
  }

  onRetryProfile = () => {
    this.getProfile()
  }

  userFailure = () => (
    <div className="user-profile-failure">
      <button
        type="button"
        className="retry-button btn"
        onClick={this.onRetryProfile}
      >
        Retry
      </button>
    </div>
  )

  userInProgress = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getUserProfile = () => {
    const {profileStatus} = this.state

    switch (profileStatus) {
      case pageStatus.success:
        return this.getUser()
      case pageStatus.failure:
        return this.userFailure()
      case pageStatus.inProgress:
        return this.userInProgress()
      default:
        return null
    }
  }

  jobsPage = () => {
    const {jobsData} = this.state
    return jobsData.length !== 0 ? (
      <>
        <ul className="jobs-item">
          {jobsData.map(each => (
            <JobItem items={each} key={each.id} />
          ))}
        </ul>
      </>
    ) : (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
          alt="no jobs"
        />
        <h1>No jobs found</h1>
        <p className="no-jobs">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  getRetryJobs = () => {
    this.getAllJobs()
  }

  jobsFailurePage = () => (
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
          onClick={this.getRetryJobs}
        >
          retry
        </button>
      </div>
    </div>
  )

  jobsList = () => {
    const {jobsStatus} = this.state

    switch (jobsStatus) {
      case pageStatus.success:
        return this.jobsPage()
      case pageStatus.inProgress:
        return this.userInProgress()
      case pageStatus.failure:
        return this.jobsFailurePage()
      default:
        return null
    }
  }

  salaryRadioType = event => {
    this.setState({salaryRange: event.target.id}, this.getAllJobs)
    console.log(event.target.id)
  }

  employmentType = event => {
    this.setState({employmentType: event.target.id}, this.getAllJobs)
    console.log(event.target.id)
  }

  userInput = event => {
    this.setState({searchValue: event.target.value})
    console.log(event.target.value)
  }

  onSubmitSearchInput = () => {
    this.getAllJobs()
  }

  onEnterSearch = event => {
    if (event.key === 'Enter') {
      this.getAllJobs()
    }
  }

  render() {
    const {searchValue} = this.state
    return (
      <div className="all-jobs-main-container">
        <Header />
        <div className="all-jobs-container-body">
          <div className="profile-data-and-type">
            {this.getUserProfile()}
            <hr className="hr-line" />
            <h1 className="side-heading">Type of Employment</h1>
            <ul>
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId}>
                  <input
                    className="input"
                    type="checkbox"
                    id={each.employmentTypeId}
                    onChange={this.employmentType}
                  />
                  <label className="label" htmlFor={each.employmentTypeId}>
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr className="hr-line" />
            <h1 className="side-heading">Salary Range</h1>
            <ul>
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    className="radio"
                    type="radio"
                    name="option"
                    id={each.salaryRangeId}
                    onChange={this.salaryRadioType}
                  />
                  <label className="label" htmlFor={each.salaryRangeId}>
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="searches-and-jobs">
            <div className="search-box">
              <input
                className="search-input"
                type="text"
                onChange={this.userInput}
                value={searchValue}
                placeholder="Search"
                onKeyDown={this.onEnterSearch}
              />
              <button
                type="button"
                className="search-button"
                onClick={this.onSubmitSearchInput}
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.jobsList()}
          </div>
        </div>
      </div>
    )
  }
}
export default AllJobs
