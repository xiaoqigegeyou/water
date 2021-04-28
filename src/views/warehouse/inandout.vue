<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- name tell 品牌 送水人员 -->

      <el-input
        v-model="name"
        placeholder="品牌"
        style="width: 200px;"
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
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >增加</el-button>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 1012px;"
    >
      <el-table-column label="ID" type="index"  align="center" width="50" />


      <el-table-column label="品牌名" align="center" prop="price" width="100">
        <template slot-scope="{row}">
          <span>{{ foudname(row.bid) }}</span>
        </template>
      </el-table-column>
         <el-table-column label="仓库地点" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.location }}</span>
        </template>
      </el-table-column>

      <el-table-column label="进货量" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.innumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出货量" width="210px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.outnumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="capacity" width="100">
        <template slot-scope="{row}">
          <el-tag v-if="row.innumber > row.outnumber" type="success">
            <div v-html="'库存充足'" />
          </el-tag>
          <el-tag v-else-if="row.innumber <= row.outnumber" type="danger">
            <div v-html="'库存不足'" />
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改仓库地址</el-button>
          <!-- <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row,$index)"
          >删除</el-button> -->
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

        :model="temp"
        label-position="center"
        label-width="180px"
      >
        <el-form-item label="仓库地址" prop="name" style="width:800px">
          <el-input v-model="temp.location" />
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
  selectInandout,
  updateInandout,
  addInandout,
  deleteInandout,
} from "@/api/warehouse";
import { allBrand, allDeliver } from "@/api/goods";

import Pagination from "@/components/Pagination";

export default {
  inject: ["reload"],
  components: { Pagination },

  data() {
    return {
      name:'',
      statusMap: null,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        bid: "",
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
      location:""
      },

      // rules: {
      //   name: [{ required: true, message: '品牌名不能为空', trigger: 'blur' }],
      //   price: [{ required: true, message: '单价不能为空', trigger: 'blur' }],
      //   image: [{ required: true, message: '照片不能为空', trigger: 'blur' }]
      // }
    };
  },

  created() {
    this.getList();
  },
  methods: {
    foudname(a) {
      for (let s of this.statusMap) {
        if (s.id == a) return s.name;
      }
    },
    foudid(a) {
      for (let s of this.statusMap) {
        if (s.name == a) return s.id;
      }
    },
    getList() {
      this.listLoading = false;
      // allBrand().then((response) => (this.brand = response.data));
      allBrand().then((response) => {
        this.statusMap = response.data;

        // console.log(this.statusMap);
      }),
        selectInandout(this.listQuery).then((response) => {
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
      this.listQuery.bid=this.foudid(this.name)
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


          updateInandout(this.temp).then((data) => {
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

      ;
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

