import React,{ DragEventHandler, useEffect,  useRef, useState } from "react";
import { DragSortProps } from "./type.tsx";
import useCalculativeWidth from "./hooks/alculativeWidth.ts"; 
import { cn, findParent } from "./util/util.ts"; 
import style from './index.module.less';
import  DragIcon  from "./UI/index.tsx"; //这个图标可以自己找喜欢的
import { FlipList } from "./util/animation.ts";
 
/**拖拽时，留在原位置的元素的样式 */
const movingClass = [style.background]; //使用数组是为了方便以后添加其他类名
/**拖拽时，留在原位置的子元素的样式 */
const opacityClass = ["opacity-0"]; //使用数组是为了方便以后添加其他类名
 
/**拖拽排序组件 */
const DragSort = function <T>({
  list,
  ItemRender,
  afterDrag,
  keyName,
  cols = 1,
  marginX = 0,
  flipWithListChange = true,
  className,
  style,
}: DragSortProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);
  /**记录当前正在拖拽哪个元素 */
  const nowDragItem = useRef<HTMLDivElement>();
  const itemWidth = useCalculativeWidth(listRef, marginX, cols);
  /**存储flipList动画实例 */
  const flipListRef = useRef<FlipList>();
  const [dragOpen, setDragOpen] = useState(false); //是否开启拖拽 （鼠标进入指定区域开启）
 
  /**创建记录新的动画记录，并立即记录当前位置 */
  const createNewFlipList = (exceptTarget?: Element) => {
    if (!listRef.current) return;
    //记录动画
    const listenChildren = [...listRef.current.children].filter((k) => k !== exceptTarget); //除了指定元素，其它的都动画
    flipListRef.current = new FlipList(listenChildren, 300);
    flipListRef.current.recordFirst();
  };
 
  //下面这两个是用于，当列表变化时，进行动画
  useEffect(() => {
    if (!flipWithListChange) return;
    createNewFlipList();
  }, [list]);
  useEffect(() => {
    if (!flipWithListChange) return;
    createNewFlipList();
    return () => {
      flipListRef.current?.play(() => flipListRef.current?.recordFirst());
    };
  }, [list.length]);
 
  /**事件委托- 监听 拖拽开始 事件，添加样式 */
  const onDragStart: DragEventHandler<HTMLDivElement> = (e) => {
    if (!listRef.current) return;
    e.stopPropagation(); //阻止冒泡
 
    /**这是当前正在被拖拽的元素 */
    const target = e.target as HTMLDivElement;
 
    //设置被拖拽元素“留在原地”的样式。为了防止设置正在拖拽的元素样式，所以用定时器，宏任务更晚执行
    setTimeout(() => {
      target.classList.add(...movingClass); //设置正被拖动的元素样式
      target.childNodes.forEach((k) => (k as HTMLDivElement).classList?.add(...opacityClass)); //把子元素都设置为透明，避免影响
    }, 0);
 
    //记录元素的位置，用于Flip动画
    createNewFlipList(target);
 
    //记录当前拖拽的元素
    nowDragItem.current = target;
 
    //设置鼠标样式
    e.dataTransfer.effectAllowed = "move";
  };
 
  /**事件委托- 监听 拖拽进入某个元素 事件，在这里只是DOM变化，数据顺序没有变化 */
  const onDragEnter: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault(); //阻止默认行为，默认是不允许元素拖动到人家身上的
    if (!listRef.current || !nowDragItem.current) return;
 
    /**孩子数组，每次都会获取最新的 */
    const children = [...listRef.current.children];
    /**真正会被挪动的元素(当前正悬浮在哪个元素上面) */ //找到符合条件的父节点
    const realTarget = findParent(e.target as Element, (now) => children.indexOf(now) !== -1);
 
    //边界判断
    if (realTarget === listRef.current || realTarget === nowDragItem.current || !realTarget) {
      // console.log("拖到自身或者拖到外面");
      return;
    }
    if (realTarget.className.includes(FlipList.movingClass)) {
      // console.log("这是正在动画的元素，跳过");
      return;
    }
 
    //拿到两个元素的索引，用来判断这俩元素应该怎么移动
    /**被拖拽元素在孩子数组中的索引 */
    const nowDragtItemIndex = children.indexOf(nowDragItem.current);
    /**被进入元素在孩子数组中的索引 */
    const enterItemIndex = children.indexOf(realTarget);
 
    //当用户选中文字，然后去拖动这个文字时，就会触发 （可以通过禁止选中文字来避免）
    if (enterItemIndex === -1 || nowDragtItemIndex === -1) {
      console.log("若第二个数为-1，说明拖动的不是元素，而是“文字”", enterItemIndex, nowDragtItemIndex);
      return;
    }
 
    //Flip动画 - 记录原始位置
    flipListRef.current?.recordFirst();
 
    if (nowDragtItemIndex < enterItemIndex) {
      // console.log("向下移动");
      listRef.current.insertBefore(nowDragItem.current, realTarget.nextElementSibling);
    } else {
      // console.log("向上移动");
      listRef.current.insertBefore(nowDragItem.current, realTarget);
    }
 
    //Flip动画 - 播放
    flipListRef.current?.play();
  };
 
  /**事件委托- 监听 拖拽结束 事件，删除样式，设置当前列表 */
  const onDragEnd: DragEventHandler<HTMLDivElement> = (e) => {
    if (!listRef.current) return;
    /**当前正在被拖拽的元素 */
    const target = e.target as Element;
 
    target.classList.remove(...movingClass); //删除前面添加的 被拖拽元素的样式，回归原样式
    target.childNodes.forEach((k) => (k as Element).classList?.remove(...opacityClass)); //删除所有子元素的透明样式
 
    /**拿到当前DOM的id顺序信息 */
    const ids = [...listRef.current.children].map((k) => String(k.id)); //根据id，判断到时候应该怎么排序
 
    //把列表按照id排序
    const newList = [...list].sort(function (a, b) {
      const aIndex = ids.indexOf(String(a[keyName]));
      const bIndex = ids.indexOf(String(b[keyName]));
      if (aIndex === -1 && bIndex === -1) return 0;
      else if (aIndex === -1) return 1;
      else if (bIndex === -1) return -1;
      else return aIndex - bIndex;
    });
 
    afterDrag(newList); //触发外界传入的回调函数
 
    setDragOpen(false); //拖拽完成后，再次禁止拖拽
  };
 
  /**拖拽按钮组件 */ //只有鼠标悬浮在这上面的时候，才开启拖拽，做到“指定区域拖拽”
  const DragBox = ({ className, style, children }: baseChildrenProps) => {
    return (
      <div
        style={{ ...style }}
        className={cn("hover:cursor-grabbing", className)}
        onMouseEnter={() => setDragOpen(true)}
        onMouseLeave={() => setDragOpen(false)}
      >
        
        {children || <DragIcon size={20} color="#666666" />}
      </div>
    );
  };
 
  return (
    <div
      className={cn(cols === 1 ? "" : "flex flex-wrap", className)}
      style={style}
      ref={listRef}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragOver={(e) => e.preventDefault()} //被拖动的对象被拖到其它容器时（因为默认不能拖到其它元素上）
      onDragEnd={onDragEnd}
    >
      {list.map((item, index) => {
        const key = item[keyName] as string;
        return (
          <div id={key} key={key} style={{ width: itemWidth, margin: `4px ${marginX / 2}px` }} draggable={dragOpen} className="my-1">
            {ItemRender({ item, index, width: itemWidth, DragBox })}
          </div>
        );
      })}
    </div>
  );
};
export default DragSort;