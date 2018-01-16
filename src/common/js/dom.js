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
