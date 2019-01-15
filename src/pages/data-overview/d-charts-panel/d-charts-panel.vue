<template>
  <div class="d-charts-panel">
    <header class="header">
      <div class="title">{{title}}</div>
      <date-picker ref="_datePicker" @change="changeHandle($event, 'date')"></date-picker>
      <div class="btn-group">
        <sizer-group ref="group" :btnGroup="btnGroup" :defaultIndex="2" @change="changeHandle"></sizer-group>
      </div>
    </header>
    <section class="charts-wrapper">
      <div ref="chartItem" class="chart-item"></div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  import DatePicker from '@components/date-picker/date-picker'
  import SizerGroup from '@components/sizer-group/sizer-group'
  import API from '@api'
  import {CHATS_CONFIG} from '../data-config'
  import {formatDateTime} from '@utils/common'

  const COMPONENT_NAME = 'D_CHARTS_PANEL'
  const NAV = [{title: '昨天', status: 'yesterday'}, {title: '7天', status: 'week'}, {title: '30天', status: 'month'}]
  const DEFAULT_STATUS = 'month'
  const smooth = 0.5
  export default {
    name: COMPONENT_NAME,
    components: {
      DatePicker,
      SizerGroup
    },
    props: {
      dataInfo: {
        type: Object,
        default() {
          return {}
        }
      },
      title: {
        type: String,
        default: ''
      },
      chartType: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        btnGroup: NAV,
        dateType: DEFAULT_STATUS,
        startDate: '',
        endDate: '',
        myChart: null
      }
    },
    computed: {
      CHATS_CONFIG() {
        return CHATS_CONFIG[this.chartType]
      }
    },
    created() {},
    mounted() {
      this.myChart = this.$echarts.init(this.$refs.chartItem)
      setTimeout(() => {
        this._getTotalChart()
      }, this.CHATS_CONFIG.timeout)
      window.addEventListener(
        'resize',
        () => {
          this.myChart && this.myChart.resize()
        },
        false
      )
    },
    beforeDestroy() {
    // window.removeEventListener('resize')
    },
    methods: {
      changeHandle(e, type) {
        if (type && e) {
          this.startDate = formatDateTime(e[0])
          this.endDate = formatDateTime(e[1])
          this.dateType = ''
          this.$refs.group && this.$refs.group._clearActive()
        } else {
          this.dateType = e || DEFAULT_STATUS
          this.startDate = ''
          this.endDate = ''
          this.$refs._datePicker && this.$refs._datePicker.clearTime()
        }
        this._getTotalChart()
      },
      _getTotalChart() {
        if (!this.CHATS_CONFIG) return
        let data = {
          stats_type: this.CHATS_CONFIG.chartType,
          date_type: this.dateType,
          start_date: this.startDate,
          end_date: this.endDate
        }
        API.Data.getTotalChart(data, false, false)
          .then((res) => {
            let {xAxisData, xBetweenData, seriesData} = res.data
            let _this = this
            this[this.CHATS_CONFIG.drawFn](_this, xAxisData, xBetweenData, seriesData, this.myChart)
          })
          .catch((e) => {
            // console.log(e)
            // e.message === '系统异常.' && this.$toast.show(e.message)
            let _this = this
            let {xAxisData, xBetweenData, seriesData} = this.CHATS_CONFIG
            this[this.CHATS_CONFIG.drawFn](_this, xAxisData, xBetweenData, seriesData, this.myChart)
          })
      },
      _drawOrder(_this, xAxisData, xBetweenData, seriesData, myChart) {
        myChart.setOption({
          // formatter: function (params) {
          //   if (typeof params !== 'object') {
          //     return params
          //   }
          //   let tatol = 0
          //   params.forEach((item) => {
          //     tatol += parseFloat(item.data)
          //   })
          //   let arr = `<p style="text-align: left;margin: 0px 10px 6px;font-size: 16px;font-family: PingFangSC-Regular">${between[params[0].dataIndex]}(合计: ${tatol})</p>`
          //   params.forEach((item) => {
          //     let marker = `<span style="display:inline-block;margin-right:8px;border-radius:50%;width:5px;height:5px;background-color:${item.color}"></span>`
          //     arr += `<p style="text-align: left; margin: 0px 10px 6px; font-size: 14px; font-family: PingFangSC-Regular">${marker}${item.seriesName} ${item.data}</p>`
          //   })
          //   return arr
          // },
          legend: {
            itemWidth: 14,
            itemHeight: 14,
            borderRadius: 0,
            bottom: 19,
            data: [{name: '提交订单', icon: 'rect'}, {name: '支付订单', icon: 'rect'}, {name: '退款订单', icon: 'rect'}]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '63',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E6E6E6',
                width: 0.5
              }
            },
            axisLabel: {
              color: '#666',
              fontSize: 12,
              align: 'center'
            },
            axisTick: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            axisLine: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              align: 'left'
            },
            axisPointer: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            padding: [10, 50, 10, 20]
          },
          yAxis: {
            minInterval: 1,
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#EFEFEF',
                width: 0.5,
                type: 'dotted'
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            },
            axisLabel: {
              formatter: '{value}',
              color: '#666'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            }
          },
          series: [
            {
              name: '提交订单',
              data: seriesData.submit_num,
              type: 'line',
              smooth,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  x2: 0,
                  y: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(169,129,255,0.3)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(169,129,255,0.3)'
                    }
                  ],
                  globalCoord: false
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(169,129,255,1)',
                  borderWidth: 1,
                  // borderColor: '#fff',
                  // shadowColor: 'rgba(73,133,252,1)',
                  // shadowOffsetY: 0,
                  // shadowOffsetX: 0,
                  // shadowBlur: 10,
                  lineStyle: {
                    color: 'rgba(169,129,255,1)',
                    width: 3
                  }
                }
              }
            },
            {
              name: '支付订单',
              data: seriesData.pay_num,
              type: 'line',
              smooth,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  x2: 0,
                  y: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(73,133,252, 0.55)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(73,133,252, 0.05)'
                    }
                  ],
                  globalCoord: false
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(73,133,252,1)',
                  borderWidth: 1,
                  // borderColor: '#fff',
                  // shadowColor: 'rgba(73,133,252,1)',
                  // shadowOffsetY: 0,
                  // shadowOffsetX: 0,
                  // shadowBlur: 10,
                  lineStyle: {
                    color: 'rgba(73,133,252,1)',
                    width: 3
                  }
                }
              }
            },
            {
              name: '退款订单',
              data: seriesData.refund_num,
              type: 'line',
              smooth,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  x2: 0,
                  y: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(104,212,165,0.28)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(104,212,165,0.28)'
                    }
                  ],
                  globalCoord: false
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(79,209,102,1)',
                  borderWidth: 1,
                  // borderColor: '#fff',
                  // shadowColor: 'rgba(73,133,252,1)',
                  // shadowOffsetY: 0,
                  // shadowOffsetX: 0,
                  // shadowBlur: 10,
                  lineStyle: {
                    color: 'rgba(79,209,102,1)',
                    width: 3
                  }
                }
              }
            }
          ]
        })
      // myChart.resize()
      },
      _drawAmount(_this, xAxisData, xBetweenData, seriesData, myChart) {
        myChart.setOption({
          // formatter: function (params) {
          //   let tatol = 0
          //   params.forEach((item) => {
          //     tatol += parseFloat(item.data)
          //   })
          //   let arr = `<p style="text-align: left;margin: 0px 10px 6px;font-size: 16px;font-family: PingFangSC-Regular">${between[params[0].dataIndex]}(合计: ${tatol})</p>`
          //   params.forEach((item) => {
          //     let marker = `<span style="display:inline-block;margin-right:8px;border-radius:50%;width:5px;height:5px;background-color:${item.color}"></span>`
          //     arr += `<p style="text-align: left; margin: 0px 10px 6px; font-size: 14px; font-family: PingFangSC-Regular">${marker}${item.seriesName} ${item.data}</p>`
          //   })
          //   return arr
          // },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '63',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E6E6E6',
                width: 0.5
              }
            },
            axisLabel: {
              color: '#666',
              fontSize: 12,
              align: 'center'
            },
            axisTick: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            axisLine: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              align: 'left'
            },
            axisPointer: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            padding: [10, 50, 10, 20]
          },
          yAxis: {
            minInterval: 1,
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#EFEFEF',
                width: 0.5,
                type: 'dotted'
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            },
            axisLabel: {
              formatter: '{value}',
              color: '#666'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            }
          },
          series: [
            {
              name: '交易金额',
              data: seriesData.pay_amount,
              type: 'line',
              smooth,
              // smooth: true,
              // showSymbol: false,
              // symbol: 'circle',
              // smoothMonotone: 'x',
              // symbolSize: 3,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  x2: 0,
                  y: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(73,133,252, 0.55)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(73,133,252, 0.05)'
                    }
                  ],
                  globalCoord: false
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(73,133,252,1)',
                  borderWidth: 1,
                  // borderColor: '#fff',
                  // shadowColor: 'rgba(73,133,252,1)',
                  // shadowOffsetY: 0,
                  // shadowOffsetX: 0,
                  // shadowBlur: 10,
                  lineStyle: {
                    color: 'rgba(73,133,252,1)',
                    width: 3
                  }
                }
              }
            }
          ]
        })
      // myChart.resize()
      },
      _drawOpenShop(_this, xAxisData, xBetweenData, seriesData, myChart) {
        myChart.setOption({
          // formatter: function (params) {
          //   let tatol = 0
          //   params.forEach((item) => {
          //     tatol += parseFloat(item.data)
          //   })
          //   let arr = `<p style="text-align: left;margin: 0px 10px 6px;font-size: 16px;font-family: PingFangSC-Regular">${between[params[0].dataIndex]}(合计: ${tatol})</p>`
          //   params.forEach((item) => {
          //     let marker = `<span style="display:inline-block;margin-right:8px;border-radius:50%;width:5px;height:5px;background-color:${item.color}"></span>`
          //     arr += `<p style="text-align: left; margin: 0px 10px 6px; font-size: 14px; font-family: PingFangSC-Regular">${marker}${item.seriesName} ${item.data}</p>`
          //   })
          //   return arr
          // },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '63',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E6E6E6',
                width: 0.5
              }
            },
            axisLabel: {
              color: '#666',
              fontSize: 12,
              align: 'center'
            },
            axisTick: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            axisLine: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            textStyle: {
              align: 'left'
            },
            axisPointer: {
              lineStyle: {
                color: '#ccc',
                width: 0.5
              }
            },
            padding: [10, 50, 10, 20]
          },
          yAxis: {
            minInterval: 1,
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#EFEFEF',
                width: 0.5,
                type: 'dotted'
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            },
            axisLabel: {
              formatter: '{value}',
              color: '#666'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#c4c4c4',
                width: 0.5
              }
            }
          },
          series: [
            {
              name: '店铺数量',
              data: seriesData.shop_num,
              type: 'line',
              smooth,
              // smooth: true,
              // showSymbol: false,
              // symbol: 'circle',
              // smoothMonotone: 'x',
              // symbolSize: 3,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  x2: 0,
                  y: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(73,133,252, 0.55)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(73,133,252, 0.05)'
                    }
                  ],
                  globalCoord: false
                }
              },
              itemStyle: {
                normal: {
                  color: 'rgba(73,133,252,1)',
                  borderWidth: 1,
                  // borderColor: '#fff',
                  // shadowColor: 'rgba(73,133,252,1)',
                  // shadowOffsetY: 0,
                  // shadowOffsetX: 0,
                  // shadowBlur: 10,
                  lineStyle: {
                    color: 'rgba(73,133,252,1)',
                    width: 3
                  }
                }
              }
            }
          ]
        })
      // myChart.resize()
      },
      _drawCustomer(_this, xAxisData, xBetweenData, seriesData, myChart) {
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function(params) {
              return _this.CHATS_CONFIG.formatter(params, xBetweenData)
            }
          },
          legend: {
            itemWidth: 14,
            itemHeight: 14,
            borderRadius: 0,
            bottom: 19,
            data: [{name: '潜在用户', icon: 'rect'}, {name: '消费用户', icon: 'rect'}]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '63',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: xAxisData,
              axisLabel: {
                color: '#666',
                fontSize: 12,
                align: 'center'
              },
              axisTick: {
                lineStyle: {
                  color: '#ccc',
                  width: 0.5
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#ccc',
                  width: 0.5
                }
              }
            }
          ],
          yAxis: [
            {
              minInterval: 1,
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#EFEFEF',
                  width: 0.5,
                  type: 'dotted'
                }
              },
              type: 'value',
              axisTick: {
                show: false,
                lineStyle: {
                  color: '#c4c4c4',
                  width: 0.5
                }
              },
              axisLabel: {
                color: '#666',
                fontSize: 12,
                align: 'center'
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#c4c4c4',
                  width: 0.5
                }
              }
            }
          ],
          series: [
            {
              name: '潜在用户',
              type: 'bar',
              stack: '开店统计',
              data: seriesData.potential_num,
              barWidth: 16,
              color: '#2D4692'
            },
            {
              name: '消费用户',
              type: 'bar',
              stack: '开店统计',
              color: '#6ED1F5',
              barWidth: 16,
              data: seriesData.consume_num
            }
          ]
        })
      // myChart.resize()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .d-charts-panel
    card-box-style()
    .header
      display :flex
      align-items :center
      padding :20px 30px
      border-bottom :1px solid $color-line
      .title
        font-family: $font-family-regular
        font-size: 18px;
        color: #333333;
        line-height: 18px;
        min-width :130px
        flex: 1
      .btn-group
        margin-left :20px
    .charts-wrapper
      .chart-item
        height: 367px
</style>
