// type.ts
 
import { CSSProperties, ReactNode } from "react"
/**有孩子的，基础的组件props，包含className style children */
interface baseChildrenProps {
    /**组件最外层的className */
    className?: string
    /**组件最外层的style */
    style?: CSSProperties
    /**孩子 */
    children?: ReactNode
}
/**ItemRender渲染函数的参数 */
type itemProps<T> = {
    /**当前元素 */
    item: T,
    /**当前索引 */
    index: number,
    /**父元素宽度 */
    width: number
    /**可拖拽的盒子，只有在这上面才能拖拽。自由放置位置。提供了一个默认的拖拽图标。可以作为包围盒，将某块内容作为拖拽区域 */
    DragBox: (props: baseChildrenProps) => ReactNode
}
/**拖拽排序组件的props */
export interface DragSortProps<T> {
    /**组件最外层的className */
    className?: string
    /**组件最外层的style */
    style?: CSSProperties
    /**列表，拖拽后会改变里面的顺序 */
    list: T[]
    /**用作唯一key，在list的元素中的属性名，比如id。必须传递 */
    keyName: keyof T
    /**一行个数，默认1 */
    cols?: number
    /**元素间距，单位px，默认0 (因为一行默认1) */
    marginX?: number
    /**当列表长度变化时，是否需要Flip动画，默认开启 (可能有点略微的动画bug) */
    flipWithListChange?: boolean
    /**每个元素的渲染函数 */
    ItemRender: (props: itemProps<T>) => ReactNode
    /**拖拽结束事件，返回排序好的新数组，在里面自己调用setList */
    afterDrag: (list: T[]) => any
} 