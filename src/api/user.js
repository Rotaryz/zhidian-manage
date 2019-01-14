import request from '@utils/request'
import {API_DEFAULT_MIDDLE_FN} from '@utils/constant'

export default {
  /**
   * 获取列表
   * @returns {*}
   */
  getList(data, loading = true, toast = true) {
    let url = 'api/admin/customers'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN, _changeData)
  },
  /**
   * 导出列表
   * @returns {*}
   */
  exportList(data, loading = false, toast = true) {
    let url = 'api/admin/customers/report'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}

function _changeData(res) {
  let arr = []
  arr = res.data.map(item => {
    return {
      head: item.avatar,
      name: item.nickname,
      sex: item.sex,
      addr: item.country + item.province + item.city,
      phone: item.mobile,
      num: item.paied_order_num,
      money: item.paied_order_amount,
      date: item.created_at
      // 需要增加的字段在后面加不能在前面加
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
