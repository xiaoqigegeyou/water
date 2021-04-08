<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- name tell 品牌 送水人员 -->

      <el-input
        v-model="listQuery.name"
        placeholder="姓名"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />&nbsp;
      <el-input
        v-model="listQuery.tell"
        placeholder="电话"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />&nbsp;
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >增加</el-button>
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
      <el-table-column label="ID" type="index" align="center" width="50"></el-table-column>
      <el-table-column label="姓名" width="250px" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电话" align="center" sortable prop="tell" width="350">
        <template slot-scope="{row}">
          <span>{{ row.tell }}</span>
        </template>
      </el-table-column>

      <el-table-column label="性别" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评分" width="510px" sortable align="center">
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

      <el-table-column label="操作" align="center" width="299" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="center"
        label-width="180px"
      >
        <el-form-item label="姓名" prop="name" style="width:800px">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="电话" prop="tell" style="width:800px">
          <el-input v-model="temp.tell" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="temp.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right:100px;">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectDeliver,
  updateDeliver,
  addDeliver,
  deleteDeliver,
} from "@/api/manageDeliver";

import Pagination from "@/components/Pagination";

export default {
  inject: ["reload"],
  components: { Pagination },

  created() {
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
        name: "",
        tell: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      brand: [],
      textMap: {
        update: "更新信息",
        create: "创建",
      },
      temp: {
        id: "",
        name: "",
        tell: "",
        sex: "",
        rate: 0,
      },
      rules: {
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        tell: [{ required: true, message: "电话不能为空", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
      },
    };
  },
  methods: {
    getList() {
      this.listLoading = false;
      // allBrand().then((response) => (this.brand = response.data));
      selectDeliver(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    resetTemp() {
      this.temp = {
        id: "",
        name: "",
        tell: "",
        sex: "男",
        rate: 0,
      };
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      form2
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          addDeliver(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "添加成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj

      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });

      // updateorder(row).then((data) => {
      //   if (data.data === "success") {
      //     this.reload(); // 调用刷新方法
      //   }
      // });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateDeliver(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      deleteDeliver(row.id).then(() => {
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

