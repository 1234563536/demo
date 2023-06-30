/**
 * 工具函数封装
 */
export default {
    formateDate(date, rule) {
        let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, date.getFullYear())
        }
        const o = {
            // 'y+': date.getFullYear(),
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                const val = o[k] + '';
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? val : ('00' + val).substr(val.length));
            }
        }
        return fmt;
    },
    formatDate2(t) {
        t = t || Date.now();
        let time = new Date(t);
        let str = time.getMonth() < 9 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
        str += '-';
        str += time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        str += ' ';
        str += time.getHours();
        str += ':';
        str += time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        return str;
    },
    formateTime(time) {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const now = new Date().getTime();
        const diffValue = now - time;

        // 计算差异时间的量级
        const secondC = diffValue / second;
        const minC = diffValue / minute;
        const hourC = diffValue / hour;
        const dayC = diffValue / day;

        if (dayC >= 1) {
            return parseInt(dayC) + "天";
        } else if (hourC >= 1) {
            return parseInt(hourC) + "小时";
        } else if (minC >= 1) {
            return parseInt(minC) + "分钟";
        } else if (secondC >= 1) {
            return parseInt(secondC) + "秒";
        } else {
            return '0秒';
        }
    },
    generateRoute(menuList) {
        let routes = []
        const deepList = (list) => {
            while (list.length) {
                let item = list.pop()
                if (item.action) {
                    routes.push({
                        name: item.component,
                        path: item.path,
                        meta: {
                            title: item.menuName
                        },
                        component: item.component
                    })
                }
                if (item.children && !item.action) {
                    deepList(item.children)
                }
            }
        }
        deepList(menuList)
        return routes;
    }
}