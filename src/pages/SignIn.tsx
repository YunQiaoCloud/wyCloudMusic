import * as React from 'react'
import axios from 'axios'
import '../styles/User.scss'

class SignIn extends React.Component {
  async componentDidMount() {
    const res = await axios.get('/login/cellphone?phone=17611501995&password=q1902367435')
    console.log(res)
    // anonimousUser: false
    // ban: 0
    // baoyueVersion: 0
    // createTime: 1502792168954
    // donateVersion: 0
    // id: 567282922
    // salt: '[B@69d9c281'
    // status: -10
    // tokenVersion: 0
    // type: 1
    // userName: '1_17707252075'
    // vipType: 0
    // viptypeVersion: 0
    // whitelistAuthority: 0
  }
  render() {
    return (
    <div className="Sign">
      <input type="text"/>
      <input type="password"/>
    </div>
    )
  }
}

export default SignIn
