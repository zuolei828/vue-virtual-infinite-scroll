<template>
  <div class="demo">
    <virtual-list :items="items" :options="options" :infinite="true" :pulldown="true" @loadMore="getMoreData" @pullRefresh="refreshData">
      <template slot="content" slot-scope="props">
        <div class="demo-item">
          {{props.item.text}}
        </div>
      </template>
    </virtual-list>
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
      }
    }
  },
  created () {
    let list = []
    for (let i = 0; i < 100; i++) {
      list.push({
        text: i,
        id: i
      })
    }
    this.items = list
  },
  methods: {
    getMoreData ($stateChange) {
      if (this.items.length > 1000) {
        $stateChange('complete')
      } else {
        setTimeout(() => {
          let length = this.items.length
          for (let i = length; i < length + 20; i++) {
            this.items.push({
              text: i,
              id: i
            })
          }
          $stateChange('loaded')
        }, 1500)
      }
    },
    refreshData ($pullStateChange) {
      setTimeout(() => {
        this.items.splice(0)
        let list = []
        for (let i = 0; i < 50; i++) {
          list.push({
            text: i,
            id: i
          })
        }
        this.items = this.items.concat(list)
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
    border: 1px solid #d5d5d5;
    & .demo-item {
      height: 40px;
      line-height: 40px;
    }
  }
</style>


