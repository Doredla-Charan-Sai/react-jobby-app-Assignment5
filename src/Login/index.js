import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: ''}

  getAPICall = async () => {
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const {history} = this.props

      Cookies.set('jwt_token', data.jwt_token, {expires: 30, path: '/'})
      history.replace('/')
    } else {
      this.setState({errorMsg: data.error_msg})
    }
  }

  onUsername = event => {
    this.setState({username: event.target.value})
  }

  onPassword = event => {
    this.setState({password: event.target.value})
  }

  submitForm = event => {
    event.preventDefault()
    this.getAPICall()
  }

  render() {
    const {username, password, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-cont">
        <div className="jobby-form-card">
          <img
            className="jobby-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <form className="form-cont" onSubmit={this.submitForm}>
            <label htmlFor="username" className="label">
              USERNAME
            </label>
            <input
              id="username"
              value={username}
              placeholder="Username"
              className="input"
              type="text"
              onChange={this.onUsername}
            />
            <label htmlFor="password" className="label">
              PASSWORD
            </label>
            <input
              id="password"
              value={password}
              placeholder="Password"
              className="input"
              type="password"
              onChange={this.onPassword}
            />
            <button type="submit" className="login-btn">
              Login
            </button>
            {errorMsg !== '' ? (
              // eslint-disable-next-line react/no-unescaped-entities
              <p className="error">*{errorMsg}</p>
            ) : null}
          </form>
        </div>
      </div>
    )
  }
}
export default Login
