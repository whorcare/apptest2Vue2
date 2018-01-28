/** 公共js方法 **/
function getRandomInt(min, max) { // 辅助函数
  // 返回min 和max之间的随机数
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 对数组进行重新排序 经典算法
export function shuffle(arr) {
  let _arr = arr.slice() // 副本 不影响数组本身
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
