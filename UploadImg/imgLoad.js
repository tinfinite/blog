const F = function () {}
export default {
  _load (url, context) {
    let self = this
    let imgCompleted = false
    let img = document.createElement('img')

    let onload = () => {
      if (img.complete) {
        if (!imgCompleted) {
          self.afterOne.call(self.context, url)
          ++self.count === self.length && self.afterAll.call(self.context)
        }
      } else {
        onload()
      }
      img.onload = null
    }
    img.onload = onload
    img.onerror = () => {
      self.error.call(self.context)
    }
    img.src = url
  },

  load (params) {
    if (!params.url) {
      return
    }
    this.count = 0
    this.urls = params.url
    this.length = params.url.length
    this.before = params.before || F
    this.afterOne = params.afterOne || F
    this.afterAll = params.afterAll || F
    this.error = params.error || F
    this.context = params.context || this

    this.before.call(this.context)

    for (let item of this.urls) {
      this._load(item)
    }
  }
}
