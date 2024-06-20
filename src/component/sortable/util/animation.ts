// lib/common/util/animation.ts
 
 
/**位置的类型 */
interface position {
    x: number,
    y: number
}
 
/**Flip动画 */
export class Flip {
    /**dom元素 */
    private dom: Element
    /**原位置 */
    private firstPosition: position | null = null
    /**动画时间 */
    private duration: number
    /**正在移动的动画会有一个专属的class类名，可以用于标识 */
    static movingClass = "__flipMoving__"
    constructor(dom: Element, duration = 500) {
        this.dom = dom
        this.duration = duration
    }
    /**获得元素的当前位置信息 */
    private getDomPosition(): position {
        const rect = this.dom.getBoundingClientRect()
        return {
            x: rect.left,
            y: rect.top
        }
    }
    /**给原始位置赋值 */
    recordFirst(firstPosition?: position) {
        if (!firstPosition) firstPosition = this.getDomPosition()
        this.firstPosition = { ...firstPosition }
    }
    /**播放动画 */
    play(callback?: () => any) {
        if (!this.firstPosition) {
            console.warn('请先记录原始位置');
            return
        }
        const lastPositon = this.getDomPosition()
        const dif: position = {
            x: lastPositon.x - this.firstPosition.x,
            y: lastPositon.y - this.firstPosition.y,
        }
        // console.log(this, dif);
        if (!dif.x && !dif.y) return
        this.dom.classList.add(Flip.movingClass)
        this.dom.animate([
            { transform: `translate(${-dif.x}px, ${-dif.y}px)` },
            { transform: `translate(0px, 0px)` }
        ], { duration: this.duration })
        setTimeout(() => {
            this.dom.classList.remove(Flip.movingClass)
            callback?.()
        }, this.duration);
    }
}
/**Flip多元素同时触发 */
export class FlipList {
    /**Flip列表 */
    private flips: Flip[]
    /**正在移动的动画会有一个专属的class类名，可以用于标识 */
    static movingClass = Flip.movingClass
    /**Flip多元素同时触发 - 构造函数
     * @param domList 要监听的DOM列表
     * @param duration 动画时长，默认500ms
     */
    constructor(domList: Element[], duration?: number) {
        this.flips = domList.map((k) => new Flip(k, duration))
    }
    /**记录全部初始位置 */
    recordFirst() {
        this.flips.forEach((flip) => flip.recordFirst())
    }
    /**播放全部动画 */
    play(callback?: () => any) {
        this.flips.forEach((flip) => flip.play(callback))
    }
}