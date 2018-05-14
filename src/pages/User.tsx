import * as React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../styles/User.css'

interface Props {
}

interface PlaylistItem {
  name: string
  id: number
  playCount: number
  coverImgUrl: string
  trackCount: number
}

interface Creator {
  vipType: number
  province: number
  nickname: string
  accountStatus: number
  userType: number
}
interface RecommendItem {
  alg: string
  copywriter: string
  createTime: number
  creator: Creator
  id: number
  name: string
  picUrl: string
  playcount: number
  trackCount: number
  type: number
  userId: number
}

export default class User extends React.Component<Props> {
  state = {
    user: {
      listenSongs: 0,
      createTime: 0,
      vipLevel: 0,
      id: -1,
      avatarUrl: '',
      backgroundUrl: '',
      city: 10000,
      nickname: '',
      mobileSign: false,
      pcSign: false
    },
    recommend: [],
    playlist: []
  }
  async componentDidMount() {
    // id 1422227274
    const res = await axios.get('/user/detail?uid=1422227274')
    const user = Object.assign({}, res.data.profile, {
      listenSongs: res.data.listenSongs,
      mobileSign: res.data.mobileSign,
      pcSign: res.data.pcSign,
      createTime: res.data.createTime,
      vipLevel: res.data.level
    })

    this.setState(Object.assign(this.state, { user }))

    // 签到
    if (!user.pcSign && !user.mobileSign) {
      this.setSign()
    }

    this.getMyPlaylist()
    this.getRecommendPlaylist()
  }

  setSign() {
    axios.get('/daily_signin')
  }

  async getMyPlaylist() {
    const res = await axios.get('/user/playlist?uid=1422227274')
    this.setState(Object.assign(this.state, { playlist: res.data.playlist }))
  }
  async getRecommendPlaylist() {
    const res = await axios.get('/recommend/resource')
    this.setState(Object.assign(this.state, { recommend: res.data.recommend }))
  }

  render() {
    const user = this.state.user
    const playlist = this.state.playlist
    console.log(this.state.recommend)

    if (playlist.length > 3) {
      playlist.splice(0, 2)
    }

    const playlistDom = playlist.map((item: PlaylistItem) => {
      return (
        <div className="playlist-item" key={item.id}>
          <img src={item.coverImgUrl} alt={item.name}/>
          <span className="playlist-item-info">
            <span>{item.name}</span>
            <span className="playlist-item-count dim">
              <span>{item.trackCount}首</span>
              {item.trackCount && item.playCount ? <span> · </span> : null}
              {item.playCount ? <span>{item.playCount}次播放</span> : null}
            </span>
          </span>
        </div>
      )
    })

    const recommendDom = this.state.recommend.map((item: RecommendItem, index: number) => {
      let name = item.name || ''

      if (name.length > 19) {
        name = name.substr(0, 19)
        name += '...'
      }
      return (
        <li className="playlist-item" key={item.id}>
          {/* <img src={item.picUrl} alt={item.name}/> */}
          {/* <span>{index}.</span> */}
          <span className="playlist-item-info">
            <span>{name}</span>
            <span className="playlist-item-count dim">
              {/* {item.copywriter} */}
              {/* {item.creator.nickname}推荐 */}
              {/* {item.creator && item.playcount ? <span> · </span> : null} */}
              {item.playcount ? <span>{item.playcount}次播放</span> : null}
              {item.creator && item.playcount ? <span> · </span> : null}
              <span>{item.trackCount}首</span>
            </span>
          </span>
        </li>
      )
    })

    return (
      <div className="User">
        <Link to={{pathname: '/'}} className="User-goback"/>
        <div className="User-header">
          <div className="User-header-info">
            <div className="user-info">
              <img className="avatar" src={user.avatarUrl} alt={user.nickname}/>
              <p className="nickname">
                <span>
                  {user.nickname}
                </span>
                <span>lv.{user.vipLevel}</span>
              </p>
            </div>
            <a href="javascript:;" className="user-daily-signin">
              {this.state.user.mobileSign || this.state.user.pcSign ? '已签到' : '签到'}
            </a>
          </div>
        </div>

        <div className="User-content">
          <ul className="User-content-status card">
            <li>
              <span>0</span>
              <span className="title dim">
                动态
              </span>
            </li>
            <li>
              <span>0</span>
              <span className="title dim">
                关注
              </span>
            </li>
            <li>
              <span>0</span>
              <span className="title dim">
                粉丝
              </span>
            </li>
          </ul>

          <div className="User-content-songs card">
            <h3 className="title">
              <span>我的音乐</span>
              <a  className="dim" href="javascript:;">查看更多</a>
            </h3>
            <ul>
              <li>
                <a href="javascript:;">
                  <i className="icon icon-personalize"/>
                  <span>每日推荐</span>
                </a>
              </li>
              <li>
                <a href="javascript:;">
                  <i className="icon icon-played"/>
                  <span>最近播放</span>
                </a>
              </li>
              <li>
                <a href="javascript:;">
                  <i className="icon icon-radio"/>
                  <span>我的电台</span>
                </a>
              </li>
              <li>
                <a href="javascript:;">
                  <i className="icon icon-collect"/>
                  <span>我的收藏</span>
                </a>
              </li>
            </ul>
          </div>

          {
            playlistDom.length ?
            <div className="User-content-playlist card">
              <h3 className="title">
                <span>我喜欢的</span>
                <a  className="dim" href="javascript:;">查看更多</a>
              </h3>
              {playlistDom}
            </div>
            :
            null
          }

          {
            recommendDom.length ?
            <div className="User-content-playlist card recommended">
              <h3 className="title">
                <span>推荐歌单</span>
                <a  className="dim" href="javascript:;">查看更多</a>
              </h3>
              <ol>
                {recommendDom}
              </ol>
            </div>
            :
            null
          }
        </div>
      </div>
    )
  }
}
