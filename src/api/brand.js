import request from '@utils/request'
import {API_DEFAULT_MIDDLE_FN} from '@utils/constant'

export default {
  /**
   * 品牌列表
   * @returns {*}
   */
  getList(data, loading = true, toast = true) {
    let url = 'api/admin/merchants'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN, _changeData)
  },
  /**
   * 开通
   * @returns {*}
   */
  open(id, loading = true, toast = true) {
    let url = `api/admin/merchants/${id}/upgrade`
    return request.post(url, {}, loading, toast, API_DEFAULT_MIDDLE_FN)
  },

  /**
   * 店铺列表
   * @returns {*}
   */
  login(data, loading = true, toast = true) {
    let url = 'api/admin/stores'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}

function _changeData(res) {
  let arr = []
  arr = res.data.map(item => {
    return {
      storeName: item.industry_name,
      name: item.nickname,
      phone: item.agent_mobile,
      num: item.store_num,
      actived: item.actived,
      date: item.open_time,
      status: item.status,
      url: item.logo.url
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
