import request from '@utils/request'
import {API_DEFAULT_MIDDLE_FN} from '@utils/constant'

export default {
  /**
   * 服务列表
   * @returns {*}
   */
  getList(data, loading = true, toast = true) {
    let url = 'api/admin/goods'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN, _changeData)
  },
  /**
   * 导出列表
   * @returns {*}
   */
  exportList(data, loading = false, toast = true) {
    let url = 'api/admin/goods/export'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}

function _changeData(res) {
  let arr = []
  arr = res.data.map(item => {
    return {
      title: item.title,
      price: item.platform_price,
      num: item.browse_count,
      stock: item.sale_count,
      status: item.is_online,
      source: item.source,
      date: item.created_at,
      url: item.image_url
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
