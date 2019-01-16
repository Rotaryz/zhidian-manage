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
  freeze(data, loading = false, toast = true) {
    let url = `api/admin/stores/${data.id}/freeze`
    return request.post(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  },
  /**
   * 获取二维码
   * @returns {*}
   */
  getQrcode(id, loading = false, toast = true) {
    let url = `api/admin/stores/${id}/qrcode`
    return request.get(url, {}, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}

function _changeData(res) {
  let arr = []
  arr = res.data.map((item) => {
    return {
      storeName: item.name,
      name: (item.employee && item.employee.nickname) || '',
      phone: (item.employee && item.employee.mobile) || '',
      brand: (item.merchant && item.merchant.name) || '',
      business: item.visited_num,
      code: item.paied_order_num,
      money: item.paied_order_amount,
      date: item.created_at,
      url: item.logo && item.logo.url,
      id: item.id,
      status: item.status,
      reason: item.freeze_reason
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
