<template>
  <div class="d-charts-panel">
    <header class="header">
      <div class="title">{{title}}</div>
      <date-picker ref="_datePicker" @change="changeHandle($event, 'date')"></date-picker>
      <div class="btn-group">
        <sizer-group ref="group" :btnGroup="btnGroup" @change="changeHandle"></sizer-group>
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
  const NAV = [
    {title: '昨天', status: 'yesterday'},
    {title: '7天', status: 'week'},
    {title: '30天', status: 'month'},
  ]
  const DEFAULT_STATUS = 'yesterday'
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
        endDate: ''
      }
    },
    computed:{
      CHATS_CONFIG() {
        return CHATS_CONFIG[this.chartType]
      }
    },
    created() {
      this._getTotalChart()
    },
    mounted() {
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
        API.Data.getTotalChart(data).then((res) => {
          let {xAxisData, xBetweenData, seriesData} = res.data
          this[this.CHATS_CONFIG.drawFn](xAxisData, xBetweenData, seriesData)
        })
      },
      drawCustomer(xAxisData, xBetweenData, seriesData) {
        let _this = this
        xAxisData = xAxisData || this.CHATS_CONFIG.xAxisData
        xBetweenData = xBetweenData || this.CHATS_CONFIG.xBetweenData
        seriesData = seriesData || this.CHATS_CONFIG.seriesData
        let myChart = this.$echarts.init(this.$refs.chartItem)
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            'formatter': function (params) {
              return _this.CHATS_CONFIG.formatter(params, xBetweenData)
            }
          },
          legend: {
            itemWidth: 14,
            itemHeight: 14,
            borderRadius: 0,
            bottom: 19,
            data: [
              {name: '潜在用户', icon: 'rect'},
              {name: '消费用户', icon: 'rect'}
            ]
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
        myChart.resize()
      },
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
