import request from '@utils/request'
import {API_DEFAULT_MIDDLE_FN} from '@utils/constant'

export default {
  /**
   * 获取列表
   * @returns {*}
   */
  getList(data, loading = true, toast = true) {
    let url = 'api/admin/withdrawal'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN, _changeData)
  },
  /**
   * 导出列表
   * @returns {*}
   */
  exportList(data, loading = false, toast = true) {
    let url = 'api/admin/withdrawal/export'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  },
  /**
   * 审核
   * @returns {*}
   */
  withdrawal(data, loading = false, toast = false) {
    let url = `api/admin/withdrawal/check/${data.id}`
    return request.post(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}

function _changeData(res) {
  let arr = []
  arr = res.data.map(item => {
    return {
      orderCode: item.withdraw_sn,
      date: item.created_at,
      account: item.account,
      canCashMoney: item.remaining,
      freezeMoney: item.blocked_remaining,
      cashMoney: item.total,
      nickName: item.info.name,
      cardType: item.info.bank,
      cardNum: item.info.withdrawal_card,
      status: item.status_str,
      note: item.note,
      id: item.id

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
