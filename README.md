# vue-virtual-infinite-scroll
> a vue2 component based on Iscroll, supports big data list with high performance scroll, infinite load and pull refresh.

* Based on Iscroll, support iscroll configure options

* Reuse the DOM element to get high performance in big data list

* Support fixed height and variable height.

* Support bottom loadmore and pulldown refresh event

## Demo
https://zuolei828.github.io/virtual-scroll/

uncheck the virtual scroll means a normal big data list not use our component. It is used for performance comparison.

## How to use

```
npm install vue-virtual-infinite-scroll --save
```
```vue
<template>
    <div>
      <virtual-list ref="scroller" :items="items" :iscrollOptions="options" :variable="variable" :infinite="true" :pulldown="true" @loadMore="getMoreData" @pullRefresh="refreshData">
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
      variable: false
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
  }
</script>
```

## Configures

*Prop* | *Type* | *Required* | *Description* |
:--- | :--- | :--- | :--- |
| items | Array | ✓ | The list expected to render, each item in the list should contain id arrtibute for the unique identify, and in variable height mode, it should also contain height attribute with a string or number value. eg: [{ id: 1, height: 40 }, { id:2, height: 50 }] |
| iscrollOptions | Object | * | The iscroll configure options. http://iscrolljs.com/#configuring |
| variable | Boolean | * | Default value is false, to define the height mode of list item. If false, the component will get the item height automatically. If true, you should set the 'height' property to each item in the prop 'items'  |
| bufferSize | Number | * | Default value is 5, define the top and bottom buffer item size. It is used to cache the scoll item out of the visable component area, the larger the bufferSize, the higher the scroll performance will achieved. |
| infinite | Boolean | * | Default value is false, true means you want to use the loadMore function when the component scolled to the bottom  |
| distance | Number | * | Default value is 50, the loadMore infinite function will be called when scrolled into the distance value from bottom  |
| loadMore | Function | * | The custom function called when prop infinite is true and component scrolled into the distance value from bottom |
| pulldown | Boolean | * | Default value is false, true means you want to use the pullRefresh function when the component pulled out of the top boundary |
| pullRefesh | Function | * | The custom function called when prop pulldown is true and the component pulled out the top boundary and released |