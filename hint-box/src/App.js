import React, { Component, Fragment } from 'react'
import classNames from 'classnames'

import './App.scss'

import './boat.scss'
import './wave.scss'
import boat_img from './boat.svg'
import code1 from './code1.png'
import code2 from './code2.png'
import code3 from './code3.png'

class App extends Component {
    render() {
        return (
            <Fragment>
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

                    <div className="dwf">
                        <p className="btn">@Levitate &copy; 2019</p>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className={classNames('content2')}>
                        <h1>Hint 1</h1>
                        <div className="parent">
                            <img src={code1} alt="hint1" />
                        </div>

                        <h1>Hint 2</h1>
                        <div className="parent">
                            <img src={code2} alt="hint2" />
                        </div>

                        <h1>Hint 3</h1>
                        <div className="parent">
                            <img src={code3} alt="hint3" />
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default App
