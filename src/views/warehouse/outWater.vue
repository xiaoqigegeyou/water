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
      >增加</el-button> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 701px;"
    >
      <el-table-column label="ID" type="index" align="center" width="50" />
      <el-table-column label="品牌名" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ foudBrandName(row.bid) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="出库时间" align="center" sortable prop="price" width="300">
        <template slot-scope="{row}">
          <span>{{ row.outtime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
<!--
      <el-table-column label="生产日期" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.protime | parseTime('{y}-{m}-{d} ')}}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="出库量" align="center" prop="capacity" width="100">
        <template slot-scope="{row}">
          <span>{{ row.outnumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经手人" align="center" prop="warranty" width="100">
        <template slot-scope="{row}">
          <span>{{ foudDeliverName(row.did) }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="操作" align="center" width="259" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
          <el-button
            v-if="row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row,$index)"
          >删除</el-button>
        </template>
      </el-table-column> -->
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
        <el-form-item label="品牌名" prop="bid" style="width:800px">
          <el-select v-model="temp.bid" placeholder="请选择">
            <el-option
              v-for="(item,index) in brand"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期" prop="protime" style="width:800px">
          <el-date-picker
            v-model="temp.protime"
            :picker-options="pickerOption"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="入库量" prop="innumber" style="width:800px">
          <el-input-number v-model="temp.innumber" :min="1" :max="1000" label="描述文字" />
        </el-form-item>
        <el-form-item label="经手人" prop="did" style="width:800px">
          <el-select v-model="temp.did" placeholder="请选择">
            <el-option
              v-for="(item,index) in deliver"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
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
  selectOutwater,
  updateOutwater,
  addOutwater,
  deleteOutwater,
} from "@/api/warehouse";
import { allBrand, allDeliver } from "@/api/goods";

import Pagination from "@/components/Pagination";

export default {
  inject: ["reload"],
  components: { Pagination },

  data() {
    return {
      name:'',
      deliver: [],
      brand: [],
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
        bid: "",
        intime:new Date(),
        protime: "",
        innumber: "",
        did: "",
      },
      rules: {
        bid: [{ required: true, message: "品牌名不能为空", trigger: "blur" }],
        protime: [
          { required: true, message: "生产日期不能为空", trigger: "blur" },
        ],
        innumber: [
          { required: true, message: "入库量不能为空", trigger: "blur" },
        ],
        did: [{ required: true, message: "经手人不能为空", trigger: "blur" }],
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },

  created() {
    this.getList();
    allDeliver().then((response) => (this.deliver = response.data));
    allBrand().then((response) => (this.brand = response.data));
  },
  methods: {
    getList() {
      this.listLoading = false;
      // allBrand().then((response) => (this.brand = response.data));
      selectOutwater(this.listQuery).then((response) => {
        this.list = response.data.items;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
      foudBrandName(a) {
      for (let s of this.brand) {
        if (s.id == a) return s.name;
      }
    },
     foudBrandId(a) {
      for (let s of this.brand) {
        if (s.name == a) return s.id;
      }
    },
    foudDeliverName(a) {
      for (let s of this.deliver) {
        if (s.id == a) return s.name;
      }
    },
    resetTemp() {
      this.temp = {
        id: "",
        bid: "",
        intime: new Date(),
        protime: "",
        innumber: "",
        did: "",
      };
    },
    handleFilter() {
      this.listQuery.page = 1;
       this.listQuery.bid=this.foudBrandId(this.name)
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
          addInwater(this.temp).then((data) => {
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
                updateInwater(tempData).then((data) => {
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
      deleteInwater(row.id).then(() => {
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

