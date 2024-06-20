import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
/**Tailwindcss的 合并css类名 函数
 * @param inputs 要合并的类名
 * @returns 
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
 
 
 
/**查找符合条件的父节点
 * @param node 当前节点。如果当前节点就符合条件，就会返回当前节点
 * @param target 参数是当前找到的节点，返回一个布尔值，为true代表找到想要的父节点
 * @returns 没找到则返回null，找到了返回Element
 */
export function findParent(node: Element, target: (nowNode: Element) => boolean) {
    while (node && !target(node)) {
        if (node.parentElement) {
            node = node.parentElement;
        } else {
            return null;
        }
    }
    return node;
}