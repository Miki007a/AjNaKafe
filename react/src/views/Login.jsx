import {Link} from "react-router-dom";
import axiosClient from "../axios-client.js";
import React, {createRef} from "react";
import {useStateContext} from "../context/ContextProvider.jsx";
import { useState } from "react";

export default function Login() {
  const emailRef = createRef()
  const passwordRef = createRef()
  const { setUser, setToken } = useStateContext()
  const [message, setMessage] = useState(null)

  const onSubmit = ev => {
    ev.preventDefault()

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    axiosClient.post('/login', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message)
        }
      })
  }

  return (
    <div  style={{
      backgroundImage: `url('/coffee-background.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }} className="login-signup-form animated fadeInDown">
      <div className="wrapper animated fadeInDown">
        <div className="inner">

          <div className="form-content" style={{width:'100%'}}>
            <div className="form-inner">

              <form onSubmit={onSubmit}>
                <div className="form-header">
                  <h3>Логирајте се на вашиот акаунт</h3>
                </div>
                {message &&
                  <div className="alert">
                    <p>{message}</p>
                  </div>
                }
                <div className="form-row">
                  <input ref={emailRef} type="email" className="form-control" placeholder="Имеил"/>
                </div>
                <div className="form-row">
                  <input ref={passwordRef} type="password" className="form-control" placeholder="Лозинка"/>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <button className="file-upload-button" style={{marginBottom: '15px', fontSize: '20px'}}>Login</button>
                  <p className="message">Не сте регистрирани? <Link to="/signup">Создади нов акаунт</Link></p>
                </div>


              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
