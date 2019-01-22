<template>
  <div class="base-search">
    <div class="search">
      <input v-model="searchText" type="text" class="search-input" :placeholder="placeHolder"
             @keydown="_enter"
      >
      <span class="before"></span>
      <span class="after"></span>
    </div>
    <div class="search-icon-box" @click="_search">
      <span class="search-icon hand"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BASE_SEARCH'

  export default {
    name: COMPONENT_NAME,
    props: {
      placeHolder: {
        type: String,
        default: '退款单号/会员名称'
      },
      infoText: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        searchText: this.infoText
      }
    },
    watch: {
      searchText(cur, pre) {
        if (cur.trim() === '') {
          this.$emit('search', '')
        }
      }
    },
    methods: {
      _search() {
        this.$emit('search', this.searchText)
      },
      _enter(e) {
        if (e.keyCode === 13) {
          this.$emit('search', this.searchText)
        }
      },
      setValue(txt) {
        this.searchText = txt
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .base-search
    display: flex
    height: 28px
    width: 290px
  .search
    input-animate(224, 28)
  .search-input
    flex: 1
    color: $color-text-main
    font-family: $font-family-regular
    font-size: $font-size-12
    text-indent: 8px
    &::placeholder
      font-family: $font-family-regular
      color: $color-text-assist
  .search-icon-box
    width: 52px
    height: 28px
    overflow: hidden
    margin-left: 20px
    border-radius: 4px
    display: flex
    align-items: center
    justify-content: center
    background: $color-main
    cursor: pointer
    .search-icon
      width: 16px
      height: 16px
      transition: all 0.3s
      icon-image('icon-search')

      &:active
        transform: scale(1.1)
</style>
