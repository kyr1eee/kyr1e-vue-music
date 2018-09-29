export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let classArr = className.split(' ')
  classArr.push(className)
  el.className = classArr.join(' ')
}

export function hasClass(el, className) {
  // \s为字符's',同理\a->'a'
  // var a = '\a'  -> 'a'
  // RegExp需加 \
  // /\s/则不需要,因为不是字符串
  let re = new RegExp('(^|\\s)' + className + '($|\\s)')
  return re.test(el.className)
}

export function getData(el, name, val) {
  const prefix = 'data-'
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(prefix + name)
  }
}

let vendor = (() => {
  let elementStyle = document.createElement('div').style
  let transformNames = {
    webkit: 'webkitTransform',
    moz: 'mozTransform',
    ms: 'msTransform',
    O: 'OTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
