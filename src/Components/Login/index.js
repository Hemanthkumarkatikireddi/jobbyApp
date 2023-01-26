import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', errorStatus: false, error: ''}

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmission(data.jwt_token)
    } else {
      this.onFailure(data.error_msg)
    }
  }

  onSubmission = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onFailure = errorMsg => {
    this.setState({error: errorMsg, errorStatus: true})
  }

  render() {
    const {username, password, error, errorStatus} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="loginForm-container">
        <form className="login-box" onSubmit={this.submitForm}>
          <div className="login-logo-container">
            <img
              className="login-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <label htmlFor="username">USERNAME</label>
          <input
            className="inputs"
            id="username"
            type="text"
            value={username}
            onChange={this.onChangeUserName}
            placeholder="Username"
          />
          <label htmlFor="password">PASSWORD</label>
          <input
            className="inputs"
            id="password"
            type="text"
            value={password}
            onChange={this.onChangePassword}
            placeholder="Password"
          />
          {errorStatus ? <p className="error">{error}</p> : ''}

          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default LoginForm
