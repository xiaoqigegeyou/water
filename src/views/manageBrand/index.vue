<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- name tell 品牌 送水人员 -->

      <el-input
        v-model="listQuery.name"
        placeholder="品牌"
        style="width: 400px;"
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
      <el-table-column label="品牌" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="单价" align="center" sortable prop="price" width="150">
        <template slot-scope="{row}">
          <span>{{ row.price }}元</span>
        </template>
      </el-table-column>

      <el-table-column label="描述" width="610px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="410px" align="center">
        <template slot-scope="{row}">
          <el-link type="primary" :href="row.image">{{ row.image }}</el-link>
          <!-- <span>{{ row.image }}</span> -->
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
        <el-form-item label="品牌名" prop="name" style="width:800px">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="单价" prop="price" style="width:800px">
          <el-input v-model="temp.price" />
        </el-form-item>
        <el-form-item label="描述" prop="message" style="width:800px">
          <el-input type="textarea" autosize v-model="temp.message" />
        </el-form-item>
        <el-form-item label="图片" prop="image" style="width:800px">
          <el-input type="textarea" autosize v-model="temp.image" />
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
  selectBrand,
  updateBrand,
  addBrand,
  deleteBrand,
} from "@/api/manageBrand";

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
        price: "",
        message: "",
        image: "",
      },
      rules: {
        name: [{ required: true, message: "品牌名不能为空", trigger: "blur" }],
        price: [{ required: true, message: "单价不能为空", trigger: "blur" }],
        image: [{ required: true, message: "照片不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    getList() {
      this.listLoading = false;
      // allBrand().then((response) => (this.brand = response.data));
      selectBrand(this.listQuery).then((response) => {
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
        price: "",
        message: "",
        image: "",
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
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          addBrand(this.temp).then((data) => {
            if (data.data === "success") {
              this.reload(); // 调用刷新方法
            }
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
          updateBrand(tempData).then((data) => {
            if (data.data === "success") {
              this.reload(); // 调用刷新方法
            }
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
      deleteBrand(row.id).then(() => {
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

