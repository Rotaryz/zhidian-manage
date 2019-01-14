import request from '@utils/request'
import {API_DEFAULT_MIDDLE_FN} from '@utils/constant'

export default {
  /**
   * 活动列表
   * @returns {*}
   */
  getList(data, loading = true, toast = true) {
    let url = 'api/admin/activity'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN, _changeData)
  },
  /**
   * 导出列表
   * @returns {*}
   */
  exportList(data, loading = false, toast = true) {
    let url = 'api/admin/activity/export'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}

function _changeData(res) {
  let arr = []
  arr = res.data.map(item => {
    return {
      title: item.activity_name,
      price: item.price,
      type: item.type,
      status: item.status,
      link: item.goods_title,
      source: item.source,
      date: item.created_at,
      url: item.image_url_thumb
      // 需要增加的字段在后面加不能在前面加
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
