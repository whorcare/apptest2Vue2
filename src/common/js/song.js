/** 封装提取歌手的歌曲详情数据 **/
// 在类的实例上面调用方法，其实就是调用原型上的方法。
// class 构造函数 的prototype属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的prototype属性上面。
export default class Song {
  // constructor 方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong(musicData) { // 创建自己的歌曲数据 利用上面的 class Song
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`,
    // url qq音乐更新 导致接口被封加密 使用固定测试值
    url: `http://dl.stream.qqmusic.qq.com/C400001Qu4I30eVFYb.m4a?vkey=6669A7F8212B1B8D38B2DE5BEFDA1955D4BC06DCB5F58113A4C0EB6B50156A1D56A85E2C3E96B9E9A818DDA128C1A701C47B2D2D11590F06&guid=1791208910&uin=591686670&fromtag=66`
  })
}

function filterSinger(singer) { // 拼接字符串变量 singer => [] 将歌名/专辑 拼接一起
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
