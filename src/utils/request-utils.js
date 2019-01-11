import storage from 'storage-controller'
import {app as _this} from '@src/main'
import {LOGIN_PAGE} from '@utils/constant'
// 判断是否为浏览器环境
const isBrowser = !!window
// 错误码检查
export function handleErrorType(code) {
  switch (code) {
    case 404: {
      _toErrorPage(`404`)
      break
    }
    case 10000: {
      _handleLoseEfficacy()
      break
    }
    default:
      break
  }
}

function _toErrorPage(useType) {}

function _handleLoseEfficacy() {
  const currentRoute = _this.$route.path
  if (currentRoute !== '/') {
    storage.set('beforeLoginRoute', currentRoute)
  }
  storage.remove('token')
  _this.$router.replace(LOGIN_PAGE)
}

export function showLoading(loading) {
  if (loading) {
    isBrowser && _this.$loading.show()
  }
}

/* utils-api 中间件 */
// 中间件
export function defaultMiddleWare(res, ...args) {
  const [, , loading = true, toast = true] = args
  let fn = args[args.length - 1]
  // 隐藏loading
  if (loading) {
    _loadingHide()
  }
  // 错误处理
  if (res == null || res.error == null || res.data == null) {
    throw new Error(res)
  }
  // toast处理
  if (_this.$ERR_OK !== res.error) {
    toast && _toastShow(res.message)
    throw new Error(res.message)
  }
  // 自定义函数处理
  if (typeof fn === 'function') {
    res = fn(res)
  }
  return res
}
// 关闭loading
function _loadingHide() {
  isBrowser && _this.$loading.hide()
}
// 显示toast
function _toastShow(msg) {
  isBrowser && _this.$toast.show(msg)
}
