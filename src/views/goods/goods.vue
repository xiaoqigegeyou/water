<template>
  <div class="card">
    <el-row :gutter="100" style="height:400px">
      <el-col :span="8" v-for="(b,index) in brand" :key="index" :offset="1" style="width:350px">
        <el-card :body-style="{ padding: '0px', height:'360px' }" shadow="hover">
          <img :src="b.image" class="image" />
          <div style="padding: 14px;">
            <span>
              <h3>{{b.name}}</h3>
              <h5>{{b.price}}元/桶</h5>
            </span>
            <div class="bottom clearfix">
              <time class="time">{{ b.message}}</time>
            </div>
            <Order :OneBrand='b'></Order>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { insrtOrder, allBrand, allDeliver } from "@/api/goods";
import Order from './order.vue';

export default {
  data() {
    return {
      brand: [],
    };
  },
  created() {
    allBrand().then((response) => (this.brand = response.data));
  },
  components: {
    Order,
  },
  methods: {},
};
</script>

<style>
/* .card {
  display: flex;
} */
.el_row {
  display: flex;
}
.el-card {
  margin-top: 30px;
  margin-bottom: 20px;
}
.time {
  font-size: 13px;
  color: #999;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}
.button {
  padding: 0;
  float: right;
}
.image {
  width: 100%;
  height: 300px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
