<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- name tell 品牌 送水人员 -->

      <!-- <el-input
        v-model="listQuery.name"
        placeholder="姓名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />&nbsp; -->
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
      <el-table-column label="ID" type="index" align="center" width="50">
        <!-- <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>-->
      </el-table-column>
      <el-table-column label="品牌" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.bname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="150px" sortable prop="date" align="center">
        <template slot-scope="{row}">
          <span>{{ row.starttime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.appointmenttime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="结束时间" width="150px"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.endtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="送水人员" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.person }}</span>
        </template>
      </el-table-column>

      <el-table-column label="评分" width="200px" prop="rate" align="center">
        <template slot-scope="{row}">
          <el-rate
            v-model="row.rate"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          />
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
          <el-tag v-if="row.appointmenttime > row.endtime" type="success">
            <div v-html="'准&nbsp;&nbsp;&nbsp;&nbsp;时'" />
          </el-tag>
          <el-tag v-else-if="row.appointmenttime < row.endtime" type="danger">
            <div v-html="'超&nbsp;&nbsp;&nbsp;&nbsp;时'" />
          </el-tag>
          <el-tag v-else type="info">未完成</el-tag>
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
      <!-- <el-table-column label="备注" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.text }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button slot="reference" size="mini" type="primary" @click="handleUpdate(row)">评价</el-button>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"

        :model="order"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="评分" prop="rate">
          <el-rate v-model="order.rate" show-text />
        </el-form-item>
        <el-form-item label="评价" prop="text">
          <el-input v-model="order.text" type="textarea" :rows="2" placeholder="请输入评价" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { allBrand, allDeliver } from '@/api/goods'
import { selectorder, updateorder } from '@/api/orderhistory'

import Pagination from '@/components/Pagination'

export default {
  inject: ['reload'],
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'a',
        2: 'warning',
        3: 'success'
      }
      return statusMap[status]
    },
    tagFilter(status) {
      let tag
      if (status === 1) {
        tag = '配送中'
      } else if (status === 2) {
        tag = '已送达'
      } else if (status === 3) {
        tag = '已评价'
      }
      return tag
    }
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
        bname: '',
        person: '',
        uid: this.$store.getters.id,
        flag: 2
      },
      deliver: [],
      brand: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '评价',
        create: ''
      },
      order: {
        id: '',
        rate: 1,
        text: '',
        flag: 2
      }

    }
  },
  created() {
    allDeliver().then((response) => (this.deliver = response.data))
    allBrand().then((response) => (this.brand = response.data))
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = false
      selectorder(this.listQuery).then((response) => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      (this.order.id = row.id), (this.dialogStatus = 'update')
      this.dialogFormVisible = true
    },
    updateData() {
      updateorder(this.order).then((data) => {
        this.dialogFormVisible = false
        if (data.data === 'success') {
          this.reload() // 调用刷新方法
        }
        this.$notify({
          title: 'Success',
          message: '评价成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

