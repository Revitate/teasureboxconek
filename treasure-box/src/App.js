import React, { Component } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import { to } from 'await-to-js'
import axios from 'axios'

import './App.scss'

import './boat.scss'
import './wave.scss'
import boat_img from './boat.svg'
import qr from './qr-hint.svg'

class App extends Component {
    state = {
        msg: '',
        username: '',
        password: '',
        passHint: '',
        asUser: null,
        waitTime: null,
        hint: null
    }

    onChange = e => {
        const { name, value } = e.target

        this.setState({
            [name]: value
        })
    }

    handleLogin = async e => {
        e.preventDefault()
        const { username, password } = this.state
        const [err, res] = await to(
            axios.post('/api/login', {
                username,
                password
            })
        )
        if (err) {
            console.error(err)
            return
        }
        const { status, msg } = res.data
        if (status === 'success') {
            this.setState({
                asUser: {
                    username,
                    password
                }
            })
        } else {
            this.setState({ msg })
            console.log(msg)
        }
    }

    tickCountdown = () => {
        setTimeout(() => {
            const newWaitTime = this.state.waitTime.subtract(1000)
            if (newWaitTime.asMilliseconds() > 0) {
                this.setState(
                    {
                        waitTime: newWaitTime
                    },
                    this.tickCountdown
                )
            } else {
                this.setState({
                    waitTime: null
                })
            }
        }, 1000)
    }

    handleGetHint = async e => {
        e.preventDefault()
        const { asUser, passHint } = this.state
        const [err, res] = await to(
            axios.post('/api/treasure', {
                ...asUser,
                passHint
            })
        )
        if (err) {
            console.error(err)
            return
        }
        const { status, treasure, msg, waitTime } = res.data
        if (status === 'success') {
            this.setState({
                hint: treasure
            })
        } else {
            console.log(msg)
            if (waitTime) {
                this.setState(
                    {
                        waitTime: moment.duration(waitTime)
                    },
                    this.tickCountdown
                )
            }
        }
    }

    render() {
        const isLogin = this.state.asUser !== null
        const showTimer = this.state.waitTime !== null
        const showHint = this.state.hint !== null
        const showPassHint = this.state.hint === null && !showTimer
        return (
            <div className="App">
                <div>
                    <div className="boat-anime moveRight">
                        <img
                            className="boat"
                            src={boat_img}
                            alt="pirate ship"
                        />
                    </div>
                    <div className="ocean">
                        <div className="wave moveRight" />
                        <div className="wave moveRight" />
                    </div>
                </div>
                <div
                    className={classNames(
                        'form',
                        'animated',
                        'faster',
                        'bounceIn',
                        {
                            fadeOutUp: isLogin
                        }
                    )}
                >
                    <h2>Login To Your Account</h2>
                    <form>
                        <input
                            placeholder="Username"
                            type="text"
                            name="username"
                            onChange={this.onChange}
                        />
                        <input
                            placeholder="Password"
                            type="password"
                            name="password"
                            onChange={this.onChange}
                        />
                        <p style={{ color: 'red' }}>{this.state.msg}</p>
                        <button
                            className="animated infinite pulse"
                            onClick={this.handleLogin}
                        >
                            Login
                        </button>
                    </form>
                </div>
                {isLogin && (
                    <div className={classNames('content')}>
                        <div className={classNames('animated', 'bounceIn')}>
                            <h1>Welcome {this.state.asUser.username}</h1>
                            {showTimer && (
                                <p>
                                    cooldown{' '}
                                    {this.state.waitTime
                                        .minutes()
                                        .toString()
                                        .padStart(2, '0')}{' '}
                                    :{' '}
                                    {this.state.waitTime
                                        .seconds()
                                        .toString()
                                        .padStart(2, '0')}
                                </p>
                            )}
                            {showPassHint && (
                                <div className="form2">
                                    <form>
                                        <input
                                            placeholder="Password For Hint!"
                                            type="text"
                                            name="passHint"
                                            onChange={this.onChange}
                                        />
                                        <button
                                            className="animated infinite pulse"
                                            onClick={this.handleGetHint}
                                        >
                                            Get Hint!
                                        </button>
                                    </form>
                                </div>
                            )}
                            {showHint && (
                                <div>
                                    <h3>The end is a new begining</h3>
                                    <img src={qr} alt="qrcode" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <div className="dwf">
                    <p className="btn">@Levitate &copy; 2019</p>
                </div>
            </div>
        )
    }
}

export default App
