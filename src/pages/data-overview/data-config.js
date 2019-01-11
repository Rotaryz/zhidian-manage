export const OVERVIEW = [
  {icon: 'user', number: 0, title: '新用户', total: 0, yesterday: 0, text: '总用户数'},
  {icon: 'shop', number: 0, title: '门店', total: 0, yesterday: 0, text: '总门店数 '},
  {icon: 'order', number: 0, title: '交易订单', total: 0, yesterday: 0, text: '总交易订单数'},
  {icon: 'amount', number: 0, title: '交易金额 ', total: 0, yesterday: 0, text: '总交易金额 '}
]

export const CHATS_DATA_TYPE = {
  user: 'user'
}

export const CHATS_CONFIG = {
  [CHATS_DATA_TYPE.user]: {
    xAxisData: ['2:00', '4:00', '06:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
    xBetweenData: ['0:00 ~ 2:00', '2:00 ~ 4:00', '4:00 ~ 6:00', '6:00 ~ 8:00', '8:00 ~ 10:00', '10:00 ~ 12:00', '12:00 ~ 14:00', '14:00 ~ 16:00', '16:00 ~ 18:00', '18:00 ~ 20:00', '20:00 ~ 22:00', '22:00 ~ 24:00'],
    seriesData: {potential_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], consume_num: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    formatter: _userFormatter,
    drawFn: 'drawCustomer',
    chartType: 1
  }
}
function _userFormatter(params, xBetweenData) {
  let total = 0
  params.forEach((item) => {
    total = total + item.data * 1
  })
  let arr = `<p style="text-align: left;margin: 0px 10px 6px;font-size: 16px;font-family: PingFangSC-Regular">${xBetweenData[params[0].dataIndex]}(合计: ${total})</p>`
  params.forEach((item) => {
    let marker = `<span style="display:inline-block;margin-right:8px;border-radius:50%;width:5px;height:5px;background-color:${item.color}"></span>`
    arr += `<p style="text-align: left; margin: 0px 10px 6px; font-size: 14px; font-family: PingFangSC-Regular">${marker}${item.seriesName} ${item.data}</p>`
  })
  return arr
}
