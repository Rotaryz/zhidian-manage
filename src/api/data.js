import request from '@utils/request'
import {API_DEFAULT_MIDDLE_FN} from '@utils/constant'
import {OVERVIEW} from '@pages/data-overview/data-config'

export default {
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
}

// 解析图标数据
function _resolveGetTotalChartData(res) {
  if (!res.data.length) {
    throw new Error('系统异常.')
  }
  let xAxisData = []
  let xBetweenData = []
  let seriesData = {
    potential_num: [], // 潜在用户
    consume_num: [], // 消费用户
    shop_num: [], // 店铺数量
    pay_amount: [], // 交易金额
    submit_num: [], // 提交订单
    pay_num: [], // 支付订单
    refund_num: [], // 退款订单
  }
  res.data.forEach((item) => {
    xAxisData.push(item.at) // x 轴每个点对应y轴的值
    xBetweenData.push(item.at_between) // x 轴 间隔的值
    seriesData.potential_num.push(_DEFAULT_NUM(item.potential_num))
    seriesData.consume_num.push(_DEFAULT_NUM(item.consume_num))
    seriesData.shop_num.push(_DEFAULT_NUM(item.invite_num))
    seriesData.submit_num.push(_DEFAULT_NUM(item.submit_num))
    seriesData.pay_num.push(_DEFAULT_NUM(item.pay_num))
    seriesData.refund_num.push(_DEFAULT_NUM(item.refund_num))
    seriesData.pay_amount.push(_DEFAULT_NUM(item.pay_amount))
    // for(let [key,val] of Object.entries(item)) {
    //   if (seriesData[key]) {
    //     seriesData[key].push(val)
    //   } else {
    //     seriesData[key] = []
    //     seriesData[key].push(val)
    //   }
    // }
  })
  res.data = {
    xAxisData,
    xBetweenData,
    seriesData
  }
  return res
}
function _DEFAULT_NUM(num) {
  return num || 0
}
// 解析统计数据
function _resolveGetTotalModeData(res) {
  let resData = res.data
  let newCustomer = resData.new_customer || {}
  let formalShop = resData.formal_shop || {}
  let successOrder = resData.success_order || {}
  let successOrderAmount = resData.success_order_amount || {}
  let data = OVERVIEW
  data.forEach((item) => {
    if (item.icon === 'user') {
      item.number = _formatNumber(newCustomer.today_num)
      item.yesterday = _formatNumber(newCustomer.yesterday_num)
      item.total = _formatNumber(newCustomer.total_num)
    }
    if (item.icon === 'shop') {
      item.number = _formatNumber(formalShop.today_num)
      item.total = _formatNumber(formalShop.total_num)
      item.yesterday = _formatNumber(formalShop.yesterday_num)
    }
    if (item.icon === 'order') {
      item.number = _formatNumber(successOrder.today_num)
      item.yesterday = _formatNumber(successOrder.yesterday_num)
      item.total = _formatNumber(successOrder.total_num)
    }
    if (item.icon === 'amount') {
      item.number = _formatNumber(successOrderAmount.today_amount)
      item.yesterday = _formatNumber(successOrderAmount.yesterday_amount)
      item.total = _formatNumber(successOrderAmount.total_amount)
    }
  })
  res.data = data
  return res
}

// 组装三位带，的数字
function _formatNumber(num) {
  if (!num) {
    return '0'
  }
  let arr = ('' + num).split('.')
  let reg = /(?=(\B)(\d{3})+$)/g
  let number = arr[0].replace(reg, ',')
  return arr[1] ? `${number}.${arr[1]}` : number
}
