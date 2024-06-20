"use client";
import React,{ useState } from "react";
import DragSort from "../component/sortable/index.tsx";
import { Button, InputNumber } from "antd";
export default function Page() {
  interface item {
    id: number;
  }
  const [list, setList] = useState<item[]>([]); //当前列表
  const [cols, setCols] = useState(1); //一行个数
  /**创建一个新的元素 */
  const createNewItem = () => {
    setList((old) =>
      old.concat([
        {
          id: Date.now(),
        },
      ])
    );
  };
  return (
    <div className="p-2 bg-[#a18c83] w-screen h-screen overflow-auto">
      <Button type="primary" onClick={createNewItem}>
        点我添加
      </Button>
      一行个数： <InputNumber value={cols} min={1} onChange={(v) => setCols(v!)} />
      <DragSort
        list={list}
        keyName={"id"}
        cols={cols}
        marginX={10}
        afterDrag={(list) => setList(list)}
        ItemRender={({ item, index, DragBox }) => {
          return (
            <div className="flex items-center border rounded-sm p-2 gap-1 bg-white">
              <DragBox />
              <div>序号：{index}，</div>
              <div>ID：{item.id}</div>
              {/* <DragBox className="bg-stone-400 text-white p-1">自定义拖拽位置</DragBox> */}
            </div>
          );
        }}
      />
    </div>
  );
}