import { assertIsDefined } from '..';
const LOG_PREFIX = '[MediaQuery]';
export class MediaQuery extends EventTarget {
    constructor(mdBreakPoint = 600, lgBreakPoint = 1025) {
        super();
        this._mediaQueryMap = new Map();
        this.deviceSize = 'sm';
        this._onChange = (e) => {
            // console.log(LOG_PREFIX, '_onChange', { e })
            const deviceSizeList = this._mediaQueryMap.get(e.media);
            assertIsDefined(deviceSizeList);
            this.deviceSize = e.matches ? deviceSizeList[1] : deviceSizeList[0];
            this.dispatchEvent(new CustomEvent('change', { detail: { deviceSize: this.deviceSize } }));
        };
        this._mediaQueryMap.set(`(min-width: ${mdBreakPoint}px)`, ['sm', 'md']);
        this._mediaQueryMap.set(`(min-width: ${lgBreakPoint}px)`, ['md', 'lg']);
        let isSetDeviceSize = false;
        this._mediaQueryMap.forEach((value, key) => {
            const mql = window.matchMedia(key);
            mql.addEventListener('change', this._onChange);
            if (mql.matches) {
                isSetDeviceSize = true;
                this.deviceSize = value[1];
            }
        });
        if (this.deviceSize === undefined) {
            this.deviceSize = 'sm';
        }
    }
}
//# sourceMappingURL=MediaQuery.js.map