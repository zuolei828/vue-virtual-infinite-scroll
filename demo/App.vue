<template>
  <div class="demo">
    <div class="tool-bar">
      <label>
        <input type="checkbox" @click="toggleVariable" />
        variable height
      </label>
      <label>
        <input type="checkbox" :checked="virtual" @click="toggleVirtual" />
        virtual scroll 
      </label>
    </div>
    <div class="virtual-scroll-container" v-if="showScroller && virtual">
      <virtual-list ref="scroller" :items="items" :options="options" :variable="variable" :infinite="true" :pulldown="true" @loadMore="getMoreData" @pullRefresh="refreshData">
        <template slot="content" slot-scope="props">
          <div class="demo-item" :style="getStyle(props.item.height)">
            <span>
              {{props.item.text}}
            </span>
            <img src="./assets/demo.jpeg" />
          </div>
        </template>
      </virtual-list>
    </div>
    <div class="actual-scroll-container" v-if="showScroller && !virtual">
      <ul>
        <li v-for="item in items" :key="item.id">
          <div class="demo-item" :style="getStyle(item.height)">
            <span>
              {{item.text}}
            </span>
            <img src="./assets/demo.jpeg" />
          </div> 
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'demo',
  data () {
    return {
      items: [],
      options: {
        scrollbars: true,
        interactiveScrollbars: true,
        probeType: 3,
        mouseWheel: true,
        mouseWheelSpeed: 1
      },
      variable: false,
      virtual: true,
      showScroller: true
    }
  },
  created () {
    let list = []
    for (let i = 0; i < 100; i++) {
      list.push({
        text: i,
        id: i,
        height: Math.max(Math.floor(Math.random() * 50), 20)
      })
    }
    this.items = list
  },
  methods: {
    toggleVariable () {
      this.showScroller = false
      this.$nextTick(() => {
        this.variable = !this.variable
        this.showScroller = true
        this.$nextTick(() => {
          this.items.splice(0)
          for (let i = 0; i < 100; i++) {
            this.items.push({
              text: i,
              id: i,
              height: Math.max(Math.floor(Math.random() * 50), 20)
            })
          }
        })
      })
    },
    toggleVirtual () {
      this.virtual = !this.virtual
      this.$nextTick(() => {
        this.items.splice(0)
        let total = this.virtual ? 100 : 10000
        for (let i = 0; i < total; i++) {
          this.items.push({
            text: i,
            id: i,
            height: Math.max(Math.floor(Math.random() * 50), 20)
          })
        }
      })
    },
    getStyle (height) {
      if (!this.variable) {
        height = 40
      }
      return {
        'height': height + 'px',
        'line-height': height + 'px'
      }
    },
    getMoreData ($stateChange) {
      if (this.items.length > 1000) {
        $stateChange('complete')
      } else {
        setTimeout(() => {
          let length = this.items.length
          for (let i = length; i < length + 20; i++) {
            this.items.push({
              text: i,
              id: i,
              height: Math.max(Math.floor(Math.random() * 50), 20)
            })
          }
          $stateChange('loaded')
        }, 1500)
      }
    },
    refreshData ($pullStateChange) {
      setTimeout(() => {
        this.items.splice(0)
        for (let i = 0; i < 50; i++) {
          this.items.push({
            text: i,
            id: i,
            height: Math.max(Math.floor(Math.random() * 50), 20)
          })
        }
        $pullStateChange('complete')
      }, 1500)
    }
  }
}
</script>

<style lang="postcss">
  .demo {
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 10px;
    right: 10px;
    & .tool-bar {
      height: 40px;
      line-height: 40px;
    }
    & .virtual-scroll-container {
      position: absolute;
      top: 40px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      border: 1px solid #d5d5d5;
      & .demo-item {
        padding-left: 20px;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #e3e3e3;
        vertical-align: middle;
        & img {
          margin-left: 10px;
          height: 80%;
          vertical-align: middle;
        }
      }
    }
    & .actual-scroll-container {
      position: absolute;
      top: 40px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      border: 1px solid #d5d5d5;
      overflow: scroll;
      & ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      & .demo-item {
        padding-left: 20px;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #e3e3e3;
        vertical-align: middle;
        & img {
          margin-left: 10px;
          height: 80%;
          vertical-align: middle;
        }
      }
    }
  }
</style>


