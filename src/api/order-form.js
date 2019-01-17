import request from '@utils/request'
import {API_DEFAULT_MIDDLE_FN} from '@utils/constant'

export default {
  /**
   * 服务列表
   * @returns {*}
   */
  getList(data, loading, toast = true) {
    let url = 'api/admin/order'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN, _changeData)
  },
  /**
   * 导出列表
   * @returns {*}
   */
  exportList(data, loading, toast = true) {
    let url = 'api/admin/order/export'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}

function _changeData(res) {
  let arr = []
  arr = res.data.map((item) => {
    return {
      code: item.order_sn,
      title: item.title,
      price: item.price,
      num: item.num,
      total: item.total,
      orderType: item.order_type,
      customer: item.customer,
      date: item.created_at,
      status: item.status,
      shopName: item.shop_name
    }
  })
  let obj = {
    per_page: res.meta.per_page,
    total_page: res.meta.last_page,
    total: res.meta.total
  }
  let data = {
    arr,
    obj
  }
  return data
}
