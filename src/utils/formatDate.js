/*!
 * 格式化时间戳
 *
 * @author  zhouying
 * @date   2017-07-22
 * @param  {Object}   date 时间对象
 * @param  {String}   fmt  转换规则字符串
 * @return {String}        转换好的时间格式字符串
 */
export function formatDate(date, fmt) {
		// 匹配一个或多个y
    if (/(y+)/.test(fmt)) {
    		// 获取年份，转换为字符串，截取掉4-匹配到的字符串的长度，替换
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    // 月份，日期，小时，分钟，秒的获取
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
    		// 给每一个遍历出来的字符串生成一个正则，去和fmt进行匹配 
        if (new RegExp(`(${k})`).test(fmt)) {
        		// 将获取的对象的值转换为字符串
            let str = o[k] + '';
            // 进行替换，但是有一个补0的操作
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
        }
    }
    // 将替换好的字符串转换回去
    return fmt;
}
/**
 * 月份，日期，小时，分钟，秒的补0操作
 *
 * @author  zhouying
 * @date   2017-07-22
 * @param  {String}   str 要补0的字符串
 * @return {String}       补0后的字符串
 */
function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}