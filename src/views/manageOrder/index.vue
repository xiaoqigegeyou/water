<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- name tell 品牌 送水人员 -->

      <el-input
        v-model="listQuery.name"
        placeholder="姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />&nbsp;
      <el-input
        v-model="listQuery.tell"
        placeholder="电话"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />&nbsp;
      <el-select
        v-model="listQuery.bname"
        placeholder="品牌"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option v-for="item in brand" :key="item.id" :label="item.name" :value="item.name" />
      </el-select>&nbsp;
      <el-select
        v-model="listQuery.person"
        placeholder="送水人员"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option v-for="item in deliver" :key="item.id" :label="item.name" :value="item.name" />
      </el-select>&nbsp;

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>

    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"


    >
      <el-table-column label="ID" type="index"  align="center" width="50">
        <!-- <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="姓名" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.bname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="135px" sortable prop="date" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.starttime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" width="135px"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.appointmenttime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="150px"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.endtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="送水人员" width="80px"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.person }}</span>
        </template>
      </el-table-column>

      <el-table-column label="评分" width="180px"  prop="rate" align="center">
        <template slot-scope="{row}">
          <el-rate
            v-model="row.rate"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </template>
      </el-table-column>

      <el-table-column label="总价" align="center" sortable prop="price" width="95">
        <template slot-scope="{row}">
          <span>{{ row.price }}元</span>
        </template>
      </el-table-column>

      <el-table-column label="tag" class-name="status-col" width="150px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.flag | statusFilter">{{ row.flag | tagFilter }}</el-tag>&nbsp;
          <el-tag
            v-if="row.appointmenttime > row.endtime"
            type="success"
          > <div v-html="'准&nbsp;&nbsp;&nbsp;&nbsp;时'"></div> </el-tag>
          <el-tag
            v-else-if="row.appointmenttime < row.endtime"
            type="danger"
          > <div v-html="'超&nbsp;&nbsp;&nbsp;&nbsp;时'"></div> </el-tag>
          <el-tag v-else type="info"> 未完成 </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tell }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.addr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.text }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="96"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row,$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>5"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { allBrand, allDeliver } from "@/api/goods";
import { selectorder,deleteorder } from "@/api/orderhistory";

import Pagination from "@/components/Pagination";

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "a",
        2: "warning",
        3: "success",
      };
      return statusMap[status];
    },
    tagFilter(status) {
      let tag;
      if (status === 1) {
        tag = "配送中";
      } else if (status === 2) {
        tag = "已送达";
      } else if (status === 3) {
        tag = "已评价";
      }

      return tag;
    },

  },
  created() {
    allDeliver().then((response) => (this.deliver = response.data));
    allBrand().then((response) => (this.brand = response.data));
    this.getList();
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: '',
        tell: '',
        bname: "",
        person: "",
        uid:'',
      },
      deliver: [],
      brand: [],
    };
  },
  methods: {
    getList() {
      this.listLoading = false;
      selectorder(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
handleDelete(row, index) {
      deleteorder(row.id).then(() => {
        this.$notify({
          title: "Success",
          message: "删除成功",
          type: "success",
          duration: 2000,
        });
        this.list.splice(index, 1);
      });
    },

  },
};
</script>

