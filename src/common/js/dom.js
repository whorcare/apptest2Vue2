export function addClass(el, className) { // 为轮播图自动添加class
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) { // 检查此el DOM 对象 是否有这个className
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el, name, val) { // 将el DOM对象添加 data- 属性 为其赋值index索引 常用
  const prefix = 'data-'
  name = prefix + name
  // 如果有val 就去set  没有则get
  if (val) {
    return el.setAttribute(name + val) // setAttribute() 方法添加指定的属性，并为其赋指定的值。
  } else {
    return el.getAttribute(name) // getAttribute() 方法返回指定属性名的属性值
  }
}

let elementStyle = document.createElement('div').style // 能力检测

let vendor = (() => { // 判断是哪个浏览器内核对应的 （供应商）
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) { // 暴露一个fun 判断供应商选择 对应的属性名开头前缀
  if (vendor === false) { // 都不支持说明浏览器有问题
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
