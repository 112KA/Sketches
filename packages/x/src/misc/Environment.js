class Environment {
    constructor() {
        this.local = /localhost|192.168|172.16/.test(location.hostname);
        this.dev = /dev/.test(location.hostname);
        this.stg = /stg/.test(location.hostname);
        this.prd = !(this.local || this.dev || this.stg);
        this.ios = /iPhone|iPod|iPad/.test(navigator.userAgent);
        this.android = /Android/.test(navigator.userAgent);
        this.quest = /Quest/.test(navigator.userAgent);
        this.tablet = (/iPad|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document) ||
            (/Android/.test(navigator.userAgent) && !/Mobile/.test(navigator.userAgent));
        this.pc = !(this.tablet || this.ios || this.android || this.quest);
        this.support = {
            touch: 'ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch),
            pointer: window.navigator.pointerEnabled,
            MSPointer: window.navigator.msPointerEnabled,
            xr: false,
        };
        this.ie = /msie|trident/i.test(navigator.userAgent);
        this.edge = /edg/i.test(navigator.userAgent);
        this.safari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);
    }
}
export const env = new Environment();
if (window.navigator.xr) {
    window.navigator.xr
        .isSessionSupported('immersive-vr')
        .then(isSupported => (env.support.xr = isSupported && env.pc));
}
//# sourceMappingURL=Environment.js.map