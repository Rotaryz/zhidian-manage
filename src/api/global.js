import request from '@utils/request'
import {API_DEFAULT_MIDDLE_FN} from '@utils/constant'

export default {
  /**
   * 登陆
   * @returns {*}
   */
  login(data, loading = true, toast = true) {
    let url = '/api/jwt/super/login'
    return request.get(url, data, loading, toast, API_DEFAULT_MIDDLE_FN)
  }
}
