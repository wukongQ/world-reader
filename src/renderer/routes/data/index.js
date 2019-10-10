const ls = window.localStorage

const data = {
  save (key, value) {
    if (typeof value === 'object') {
      value = `TURN_OBJECT:${JSON.stringify(value)}`
    }
    ls.setItem(key, value)
  },
  load (key) {
    let res = ls.getItem(key)
    if (/^TURN_OBJECT:(\S*)/.test(res)) {
      res = JSON.parse(RegExp.$1)
    }
    return res
  }
}

export default data
