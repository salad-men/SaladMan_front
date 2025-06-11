import './Login.css'

const Login = () => {
    return(
        <div className="login-background">
            <div className="login-blur">
                <div className='login-box'>
                    <h2>로그인</h2>
                    <form action="" className='loginform'>
                        <input type="text" placeholder="아이디"/>
                        <input type="text" placeholder="비밀번호"/>
                        <button className='login-button'>로그인</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;