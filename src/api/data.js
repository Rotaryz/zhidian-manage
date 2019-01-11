import request from '@utils/request'
import {API_DEFAULT_MIDDLE_FN} from '@utils/constant'
import {OVERVIEW} from '@pages/data-overview/data-config'

export default {
  /**
   * 交易金额（昨天/今天)
   * @param data
   * @returns {*}
   */
  exchangeMoney(data) {
    let url = '/api/admin/total-today'
    return request.get(url, data)
  },
  /**
   * 商家/门店/订单数量/金额统计
   * @param data
   * @returns {*}
   */
  getTotalMode(data, loading, toast = true) {
    let url = '/api/admin/real-stats'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN, _resolveGetTotalModeData)
  },
  /**
   * 总筛选图标
   * @param data
   * @returns {*}
   */
  getTotalChart(data, loading, toast = true) {
    let url = '/api/admin/history-stats'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN, _resolveGetTotalChartData)
  },
  /**
   * 客户统计
   * @param data
   * @returns {*}
   */
  customerStats(data) {
    let url = '/api/admin/customer-stats'
    return request.get(url, data)
  }
}

// 解析图标数据
function _resolveGetTotalChartData(res) {
  let xAxisData = []
  let xBetweenData = []
  let seriesData = {}
  res.data.forEach((item) => {
    xAxisData.push(item.at)
    xBetweenData.push(item.at_between)
    for(let [key,val] of Object.entries(item)) {
      if (seriesData[key]) {
        seriesData[key].push(val)
      } else {
        seriesData[key] = []
        seriesData[key].push(val)
      }
    }
  })
  res.data = {
    xAxisData,
    xBetweenData,
    seriesData
  }
  return res
}

// 解析统计数据
function _resolveGetTotalModeData(res) {
  let resData = res.data
  let data = OVERVIEW
  data.forEach((item) => {
    if (item.icon === 'user') {
      item.number = _formatNumber(resData.new_customer.today_num)
      item.yesterday = _formatNumber(resData.new_customer.yesterday_num)
      item.total = _formatNumber(resData.new_customer.total_num)
    }
    if (item.icon === 'shop') {
      item.number = _formatNumber(resData.formal_shop.today_num)
      item.total = _formatNumber(resData.formal_shop.total_num)
      item.yesterday = _formatNumber(resData.formal_shop.yesterday_num)
    }
    if (item.icon === 'order') {
      item.number = _formatNumber(resData.success_order.today_num)
      item.yesterday = _formatNumber(resData.success_order.yesterday_num)
      item.total = _formatNumber(resData.success_order.total_num)
    }
    if (item.icon === 'amount') {
      item.number = _formatNumber(resData.success_order_amount.today_amount)
      item.yesterday = _formatNumber(resData.success_order_amount.yesterday_amount)
      item.total = _formatNumber(resData.success_order_amount.total_amount)
    }
  })
  res.data = data
  return res
}

// 组装三位带，的数字
function _formatNumber(num) {
  let arr = ('' + num).split('.')
  let reg = /(?=(\B)(\d{3})+$)/g
  let number = arr[0].replace(reg, ',')
  return arr[1] ? `${number}.${arr[1]}` : number
}
