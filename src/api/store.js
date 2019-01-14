import request from '@utils/request'
import {API_DEFAULT_MIDDLE_FN} from '@utils/constant'

export default {
  /**
   * 店铺列表
   * @returns {*}
   */
  getList(data, loading = true, toast = true) {
    let url = 'api/admin/stores'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN, _changeData)
  },
  /**
   * 导出列表
   * @returns {*}
   */
  exportList(data, loading = false, toast = true) {
    let url = 'api/admin/stores/report'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  },
  /**
   * 冻结/解冻
   * @returns {*}
   */
  freeze(id, loading = false, toast = true) {
    let url = `api/admin/stores/${id}/freeze`
    return request.post(url, {}, loading, toast, API_DEFAULT_MIDDLE_FN)
  },
  /**
   * 获取二维码
   * @returns {*}
   */
  getQrcode(data, id, loading = false, toast = true) {
    let url = `api/admin/stores/${id}/qrcode`
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}

function _changeData(res) {
  let arr = []
  arr = res.data.map(item => {
    return {
      storeName: item.industry_name,
      name: item.employee.nickname,
      phone: item.employee.mobile,
      brand: item.merchant.name,
      business: item.visited_num,
      code: item.paied_order_num,
      money: item.paied_order_amount,
      date: item.open_time,
      url: item.logo && item.logo.url
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
