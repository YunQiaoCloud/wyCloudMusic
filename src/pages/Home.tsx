import * as React from 'react'
import axios from 'axios'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import Slider from 'react-slick'
import { Link } from 'react-router-dom'

import '../styles/Home.css'

interface Album {
  blurPicUrl: string,
  name: string,
  id: number,
  picUrl: string,
  picId: number
}

interface Artists {
  img1v1Url: string,
  name: string,
  id: number,
  picUrl: string,
  picId: number
}

interface Song {
  name: string,
  id: number,
  album: Album,
  artists: Artists[]
}

interface Banner {
  pic: string,
  url: string,
  targetId: number,
  targetType: number,
  titleColor: string,
  exclusive: boolean,
  encodeId: number
}

class TodoStore {
  @observable todos: string[] = []

  addTodo(task: string) {
    this.todos.push(task)
  }
}

interface Personalized {
  alg: string
  canDislike: boolean
  copywriter: string
  highQuality: boolean
  id: number
  name: string
  picUrl: string
  playCount: number
  trackCount: number
  type: number
}

interface Props {
  todo: string[],
  state: StateType
}

interface StateType {
  songs: Song[],
  banners: Banner[]
  personalized: Personalized[]
}

@observer
class MusicList extends React.Component<Props> {
  todoStore = new TodoStore()
  state: StateType = {
    songs: [],
    banners: [],
    personalized: []
  }
  constructor(props: Props) {
    super(props)
    this.todoStore.addTodo('foo')
    setTimeout(() => {
      this.todoStore.addTodo('footer')
    }, 3000)
  }
  async componentDidMount() {
    // 获取头图
    this.getBanner()
    this.getPersonalized()
    try {
      const res = await axios.get('/recommend/songs')
      this.setState(Object.assign(this.state, { songs: res.data.recommend }))
    } catch (err) {
      console.log(err)
    }
  }
  async getBanner() {
    try {
      const res = await axios.get('/banner')
      this.setState(Object.assign(this.state, { banners: res.data.banners }))
    } catch (err) {
      console.log(err)
    }
  }

  async getPersonalized() {
    try {
      const res = await axios.get('/personalized')
      this.setState(Object.assign(this.state, { personalized: res.data.result }))
    } catch (err) {
      console.log(err)
    }
  }

  handleClick(song: Song) {
    console.log(song)
  }
  render() {
    // 最多只显示六个歌曲推荐
    const songs = this.state.songs || []
    if (songs.length > 6) {
      songs.length = 6
    }

    let personalizedList = this.state.personalized
    if (personalizedList.length > 6) {
      personalizedList.length = 6
    }

    const personalizedListDom = personalizedList.map((personalized: Personalized) => {
      // 照顾浏览器兼容性，超过16个字符，自动截取字符串，并在最后加 “...”
      let name = personalized.name || ''
      if (name.length >= 16) {
        name = name.substr(0, 15)
        name += '...'
      }

      return (
        <Link
          key={personalized.id}
          to={{ pathname: '/music' }}
          className="Home-remd-song"
        >
          <img className="cover" src={personalized.picUrl} alt={personalized.name}/>
          <p className="name">{name}</p>
        </Link>
      )
    })

    const songsDom = songs.map((song: Song) => {
      // 照顾浏览器兼容性，超过16个字符，自动截取字符串，并在最后加 “...”
      let name = song.name
      if (name.length >= 16) {
        name = name.substr(0, 15)
        name += '...'
      }

      return (
        <Link
          key={song.id}
          to={{ pathname: '/music' }}
          className="Home-remd-song"
        >
          <img className="cover" src={song.album.blurPicUrl} alt={song.name}/>
          <p className="name">{name}</p>
        </Link>
      )
    })

    const bannersDom = this.state.banners.map((banner: Banner) => {
      const bannerStyle = { backgroundImage: `url(${banner.pic || banner.url})` }
      return (
        <Link
          key={banner.targetId}
          to={{ pathname: '/music' }}
        >
          <i className="cover" style={bannerStyle}/>
        </Link>
      )
    })

    let placeholder = '搜索音乐'
    if (songs.length) {
      // 取一个在数组长度范围内的随机整数
      const random = Math.round(Math.random() * (songs.length ? songs.length - 1 : 0))

      placeholder = `为你推荐 ${songs[random].name}`
    }

    const settings = {
      infinite: true,
      speed: 500,
      autoplay: true,
      dots: true,
      pauseOnFocus: true,
      pauseOnHover: true,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1
    }

    return (
      <div className="Home">
        <div className="Home-header">
          <Link
            className="Home-header-me"
            to={{ pathname: '/me' }}
          />
          <input
            type="text"
            className="Home-hedaer-search"
            placeholder={placeholder}
          />
          <a href="javascript:;" className="Home-header-player"/>

          <div className="Home-header-banner">
            <Slider {...settings}>
              {bannersDom}
            </Slider>
          </div>
        </div>
        <div className="Home-content">
          <div className="Home-menu">
            <a href="javascript:;" className="Home-menu-item">
              <i className="icon icon-collect" />
              <span>收藏</span>
            </a>
            <a href="javascript:;" className="Home-menu-item">
              <i className="icon icon-daily" />
              <span>每日推荐</span>
            </a>
            <a href="javascript:;" className="Home-menu-item">
              <i className="icon icon-personalize" />
              <span>歌单</span>
            </a>
            <a href="javascript:;" className="Home-menu-item">
              <i className="icon icon-ranking" />
              <span>排行榜</span>
            </a>
          </div>

          <hr/>

          {
            personalizedListDom ?
            <>
              <h3 className="Home-title">推荐歌单</h3>
              <div className="Home-remd">
                  {personalizedListDom}
              </div>
            </>
            :
            null
          }
          {
            songsDom ?
            <>
              <h3 className="Home-title">推荐音乐</h3>
              <div className="Home-remd">
                {songsDom}
              </div>
            </>
            :
            null
          }
        </div>
      </div>
    )
  }
}
export default MusicList
