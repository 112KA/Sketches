class Environment {
  local = /localhost|192.168|172.16/.test(location.hostname)
  dev = /dev/.test(location.hostname)
  stg = /stg/.test(location.hostname)
  prd = !(this.local || this.dev || this.stg)

  ios = /iPhone|iPod|iPad/.test(navigator.userAgent)
  android = /Android/.test(navigator.userAgent)
  quest = /Quest/.test(navigator.userAgent)

  tablet =
    (/iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document) ||
    (/Android/.test(navigator.userAgent) && !/Mobile/.test(navigator.userAgent))

  pc = !(this.tablet || this.ios || this.android || this.quest)

  support = {
    touch: 'ontouchstart' in window, // || (window.DocumentTouch && document instanceof DocumentTouch),
    // pointer: window.navigator.pointerEnabled,
    // MSPointer: window.navigator.msPointerEnabled,
    xr: false,
  }

  ie = /msie|trident/i.test(navigator.userAgent)
  edge = /edg/i.test(navigator.userAgent)
  safari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent)
}
export const env = new Environment()

if (window.navigator.xr) {
  window.navigator.xr
    .isSessionSupported('immersive-vr')
    .then(isSupported => (env.support.xr = isSupported && env.pc))
}
