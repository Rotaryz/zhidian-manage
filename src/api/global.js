import request from '@utils/request'
import {API_DEFAULT_MIDDLE_FN} from '@utils/constant'

export default {
  /**
   * 登陆
   * @returns {*}
   */
  login(data, loading = true, toast = true) {
    let url = '/api/jwt/admin/login'
    return request.post(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}
