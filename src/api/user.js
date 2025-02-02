import request from '@utils/request'
import {API_DEFAULT_MIDDLE_FN} from '@utils/constant'

export default {
  /**
   * 获取列表
   * @returns {*}
   */
  getList(data, loading, toast = true) {
    let url = 'api/admin/customers'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN, _changeData)
  },
  /**
   * 导出列表
   * @returns {*}
   */
  exportList(data, loading, toast = true) {
    let url = 'api/admin/customers/report'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}

function _changeData(res) {
  let arr = []
  arr = res.data.map((item) => {
    return {
      head: item.avatar,
      name: item.nickname,
      sex: item.sex,
      addr: item.country + item.province + item.city,
      phone: item.mobile,
      num: item.paied_order_num,
      money: item.paied_order_amount,
      date: item.created_at && item.created_at.split(' ')[0]
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
