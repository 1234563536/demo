// mitt 文件，因为每次导入后创建都是一个新的 mitt，导致存储的事件丢失，所以需要先进行处理一下
import mitt from 'mitt'
export default mitt()