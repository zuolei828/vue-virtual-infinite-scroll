<template>
  <div id="wrapper">
    <div class="virtual-scroller">
      <!-- the pulldown refresh area -->
      <div class="refresh-loader" v-if="pulldown" v-show="pullState.length > 0" :style="getPullerStyle">
        <slot name="pullRefresh">
          <i class="iconfont" :class="getPullerClass"></i>
          <span class="text-default">{{pullText}}</span> 
        </slot>
      </div>
      <!-- the virtual scroll list area -->
      <ul class="scroll-list">
        <li class="list-item" v-for="item in pool" :key="item.id" :style="getItemStyle(item)">
          <slot name="content" :item="item" />
        </li>
      </ul>
      <!-- the bottom infinite loader area -->
      <div class="infinite-loader" v-if="infinite" v-show="infiniteLoading" :style="getSpinnerStyle">
        <slot name="loaderMore">
          <i class="spinner-default"></i>
          <span class="text-default">加载中...</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import IScroll from '../iscroll-probe.js'
import '../assets/icon/iconfont.css'

export default {
  name: 'virtual-scroll',
  props: {
    items: Array,
    infinite: Boolean,
    pulldown: Boolean,
    distance: {
      type: Number,
      default: 50
    },
    bufferSize: [String, Number],
    options: Object
  },
  data () {
    return {
      myScroll: null,
      wrapperHeight: 0,
      itemHeight: 0,
      buffer: 0,
      poolLength: 0,
      pool: [],
      infiniteLoading: false,
      infiniteComplete: false,
      pullerTop: 0,
      pullState: ''
    }
  },
  created () {
    this.buffer = this.bufferSize || 5
    this.pool = this.items.slice(0, this.buffer)
  },
  mounted () {
    this.$nextTick(() => {
      this.myScroll = new IScroll('#wrapper', this.options)
      this.initScrollView()
      this.initEvents()
    })
  },
  computed: {
    getPullerStyle () {
      let top = -this.pullerTop
      return {
        transform: 'translate(0, ' + top + 'px)'
      }
    },
    getPullerClass () {
      return {
        'icon-pulldown': this.pullState === 'begin' || this.pullState === 'trigger',
        'icon-pullup': this.pullState === 'trigger',
        'spinner-default': this.pullState === 'refresh',
        'icon-complete': this.pullState === 'complete'
      }
    },
    getSpinnerStyle () {
      let top = this.itemHeight * this.items.length
      return {
        transform: 'translate(0, ' + top + 'px)'
      }
    },
    pullText () {
      switch (this.pullState) {
        case 'begin':
          return '下拉刷新'
        case 'trigger':
          return '释放更新'
        case 'refresh':
          return '更新中...'
        case 'complete':
          return '更新完成'
        default:
          return ''
      }
    }
  },
  methods: {
    initScrollView () {
      this.wrapperHeight = this.$el.clientHeight
      if (this.items.length === 0) return
      this.itemHeight = this.$el.querySelector('.list-item').offsetHeight
      this.poolLength = Math.ceil(this.wrapperHeight / this.itemHeight) + 2 * this.buffer
      this.pool = this.items.slice(0, this.poolLength)
      this.updateScrollView()
      this.resetScroller()
    },
    initEvents () {
      if (this.myScroll) {
        this.myScroll.on('scroll', this.handleScrollEvent)
        this.myScroll.on('scrollEnd', this.handleScrollEndEvent)
        this.myScroll.on('pullDownEnd', this.handlePullDownEndEvent)
      }
    },
    resetParams () {
      this.infiniteLoading = false
      this.infiniteComplete = false
    },
    handleScrollEvent () {
      if (!this.infiniteComplete && !this.infiniteLoading && this.myScroll.maxScrollY > this.myScroll.y - this.distance) {
        this.triggerLoadmore()
      } else if (this.pulldown && this.myScroll.y > 0) {
        this.triggerPulldownRefresh()
      } else {
        this.updateScrollView()
      }
    },
    handleScrollEndEvent () {
      if (this.pullState === 'complete' || this.pullState === 'begin') {
        this.pullState = ''
        this.myScroll.pullState = ''
      }
    },
    handlePullDownEndEvent () {
      if (this.pullState === 'trigger') {
        this.pullState = 'refresh'
        this.myScroll.pullState = 'refresh'
        this.$emit('pullRefresh', this.pullStateManager)
      }
    },
    triggerLoadmore () {
      this.isPulling = false
      this.infiniteLoading = true
      this.$nextTick(() => {
        this.resetScroller(this.$el.querySelector('.infinite-loader').offsetHeight)
      })
      this.$emit('loadMore', this.stateManager)
    },
    triggerPulldownRefresh () {
      if (this.infiniteLoading || this.pullState === 'refresh' || this.pullState === 'complete') return
      if (!this.pullState || this.myScroll.y <= this.pullerTop) {
        this.pullState = 'begin'
        this.myScroll.pullerHeight = 0
        if (!this.pullerTop) {
          this.$nextTick(() => {
            this.pullerTop = this.$el.querySelector('.refresh-loader').offsetHeight
          })
        }
      } else if (this.myScroll.y > this.pullerTop) {
        this.pullState = 'trigger'
        this.myScroll.pullerHeight = this.pullerTop
      }
    },
    stateManager (state) {
      switch (state) {
        case 'loaded':
          this.infiniteLoading = false
          this.$nextTick(() => {
            this.resetScroller()
            this.updateScrollView()
          })
          break
        case 'complete':
          this.infiniteLoading = false
          this.infiniteComplete = true
          this.$nextTick(() => {
            this.resetScroller()
          })
          break
      }
    },
    pullStateManager (state) {
      if (state === 'complete') {
        this.myScroll.pullerHeight = 0
        this.pullState = 'complete'
        setTimeout(() => {
          this.resetScroller(null, 600)
          this.resetParams()
        }, 500)
      }
    },
    resetScroller (loaderHeight, time) {
      let h = loaderHeight || 0
      this.myScroll.scrollerHeight = this.itemHeight * this.items.length + h
      this.myScroll.maxScrollY = -this.itemHeight * this.items.length + this.wrapperHeight - h
      this.myScroll.refresh(time)
    },
    updateScrollView () {
      let scrolledLength = Math.max(Math.floor(-this.myScroll.y / this.itemHeight) - this.buffer, 0)
      let majorPhase = Math.floor(scrolledLength / this.poolLength)
      let majorLength = scrolledLength % this.poolLength
      let i = 0
      let top = 0
      while (i < this.poolLength) {
        top = majorPhase * this.poolLength * this.itemHeight + i * this.itemHeight
        if (i < majorLength) {
          top += this.itemHeight * this.poolLength
        }
        if (i < this.pool.length && this.pool[i]._top !== top) {
          this.updateItem(i, top)
        }
        i++
      }
    },
    updateItem (i, top) {
      let index = top / this.itemHeight
      if (index < this.items.length) {
        let item = this.items[index]
        item._top = top
        this.$set(this.pool, i, item)
      }
    },
    getItemStyle (item) {
      return {
        transform: 'translate(0, ' + item._top + 'px)'
      }
    }
  }
}
</script>
<style lang="postcss">
  #wrapper {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 1;
    overflow: hidden;
    & .refresh-loader {
      text-align: center;
      padding: 5px 0;
      & i {
        font-size: 20px;
        color: #999;
        vertical-align: middle;
      }
      & .icon-pulldown {
        transition: transform .3s;
        transform: rotate(180deg);
        display: inline-block;
      }
      & .icon-pullup {
        transform: rotate(0deg);
        transition: transform .3s;
      }
      & .icon-complete {
        font-size: 23px;
      }
      & .text-default {
        vertical-align: middle;
        color: #999;
        font-size: 14px;
      }
    }
    & .scroll-list {
      list-style: none;
      margin: 0;
      padding: 0;
      & .list-item {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
    }
    & .infinite-loader {
      position: absolute;
      width: 100%;
      z-index: 10000;
      text-align: center;
      padding: 5px 0;
      & .text-default {
        vertical-align: middle;
        font-size: 14px;
        color: #999;
      }
    }
    & .spinner-default {
      display: inline-block;
      width: 18px;
      height: 18px;
      line-height: 28px;
      border-radius: 50%;
      vertical-align: middle;
      position: relative;
      border: 1px solid #999;
      animation: loading-rotating ease 1.5s infinite;
      &:before {
        content: '';
        width: 6px;
        height: 6px;
        position: absolute;
        display: block;
        top: 0;
        left: 50%;
        margin-top: -3px;
        margin-left: -3px;
        background-color: #999;
        border-radius: 50%;
      }
    }
  }
  @keyframes loading-rotating {
    0%{
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>

