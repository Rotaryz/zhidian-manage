import request from '@utils/request'
import {API_DEFAULT_MIDDLE_FN} from '@utils/constant'

export default {
  /**
   * 获取列表
   * @returns {*}
   */
  getList(data, loading = true, toast = true) {
    let url = 'api/admin/pay-trade'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN, _changeData)
  },
  /**
   * 导出列表
   * @returns {*}
   */
  exportList(data, loading = false, toast = true) {
    let url = 'api/admin/pay-trade/export'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}

function _changeData(res) {
  let arr = []
  arr = res.data.map(item => {
    return {
      code: item.order_sn,
      orderCode: item.order_sn,
      orderMoney: item.total,
      orderType: item.order_type,
      isRefund: item.is_refund,
      person: item.pay_customer,
      date: item.created_at
    }
  })
  let obj = {
    per_page: res.meta.per_page,
    total_page: res.meta.last_page,
    total: res.meta.total
  }
  console.log(obj)
  let data = {
    arr,
    obj
  }
  return data
}
