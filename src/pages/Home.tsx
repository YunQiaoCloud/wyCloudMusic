import * as React from 'react'
import axios from 'axios'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
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
          to={{ pathname: '/music', search: `song=${JSON.stringify(personalized)}` }}
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
          to={{ pathname: '/music', search: `song=${JSON.stringify(song)}` }}
          className="Home-remd-song"
        >
          <img className="cover" src={song.album.blurPicUrl} alt={song.name}/>
          <p className="name">{name}</p>
        </Link>
      )
    })

    const banner = this.state.banners[0] || {}
    const style2 = { backgroundImage: `url(${banner.pic || banner.url})` }

    return (
      <div className="Home">
        <div className="Home-header">
          <input type="text" className="Home-hedaer-search"/>
          <div className="Home-header-banner" style={style2} />
        </div>
        <div className="Home-content">
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
