<template>
  <div>
    <div style=" float:right">
      <el-popover placement="top-start" title="详情" width="200" trigger="hover" :content="details">
        <p class="tipck">容量：{{ capacity }}</p>
        <p class="tipck">保质期：{{ warranty }}</p>
        <el-button slot="reference" type="text">详情</el-button>
      </el-popover>&nbsp;&nbsp;&nbsp;
      <el-button type="danger" size="mini" @click="dialogFormVisible = true">立即预约</el-button>
    </div>
    <el-dialog title="确认订单" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
        <!-- //name -->
        <input v-model="form.name" type="hidden" />

        <!-- //下单时间 -->
        <input v-model="form.currentDate" type="hidden" />

        <el-form-item label="品牌名" style="width:400px">
          <el-input v-model="form.bname" :disabled="true" />
        </el-form-item>

        <el-form-item label="个数">
          <el-input-number
            v-model="form.number"
            :min="0"
            :max=max
            label="描述文字"
            @change="handleChange"
          /> <nobr style="color:red"> 当前仓库剩余量：{{remaining()}}</nobr>
        </el-form-item>

        <el-form-item label="送水人员" prop="did">
          <el-select v-model="form.did" placeholder="请选择">
            <el-option
              v-for="(item,index) in deliver"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="预约时间" prop="appointmenttime">
          <el-date-picker
            v-model="form.appointmenttime"
            :picker-options="pickerOption"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
            @change="handle"
          />
        </el-form-item>
        <el-form-item label="即时配送">
          <el-switch v-model="delivery" />
        </el-form-item>
        <el-form-item label="电话" style="width:600px">
          <el-input v-model="form.tell" />
        </el-form-item>
        <el-form-item label="地区" style="width:800px">
          <cascader-area v-model="area" />
          <!-- <el-input type="textarea" autosize v-model="form.addr"></el-input> -->
        </el-form-item>
        <el-form-item label="详细地址" style="width:800px">
          <el-input v-model="addr" type="textarea" autosize />
        </el-form-item>
        <el-form-item>
          <h3>总价：{{ sum }}元</h3>
        </el-form-item>
        <el-form-item>
          <el-button v-if="remaining()<=0" type="primary" @click="onSubmit('form')"  disabled>提交订单</el-button>
          <el-button v-else type="primary" @click="onSubmit('form')"  >提交订单</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { insrtOrder, allBrand, allDeliver } from "@/api/goods";

import { selectAllInandout } from "@/api/warehouse";
import CascaderArea from "@/components/CascaderArea";
export default {
  components: {
    CascaderArea,
  },
  props: ["OneBrand"],

  data() {
    return {
      area: this.$store.getters.area,
      addr: this.$store.getters.addr,
      form: {
        name: this.$store.getters.name,
        tell: this.$store.getters.tell,
        addr: "",
        bname: this.OneBrand.name,
        person: "",
        starttime: new Date(),
        appointmenttime: "",
        price: "",
        uid: this.$store.getters.id,
        did: "",
        number: 0,
      },
      capacity: this.OneBrand.capacity,
      warranty: this.OneBrand.warranty,

      deliver: [],
      allInandout:'',
      delivery: false,
      formLabelWidth: "180px",

      max:'100',
      dialogFormVisible: false,

      rules: {
        did: [{ required: true, message: "请选择配送人员", trigger: "blur" }],
        appointmenttime: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "blur",
          },
        ],
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  computed: {
    sum() {
      this.form.price = this.form.number * this.OneBrand.price;
      return this.form.number * this.OneBrand.price;
    },
    details() {
      return "容量：" + this.capacity + "\n\r保质期：" + this.warranty;
    },

  },
  created() {
    allDeliver().then((response) => (this.deliver = response.data));
    selectAllInandout().then((response) => (this.allInandout = response.data));
  },
  methods: {
       remaining(){
        for(let rem of this.allInandout){
          if(rem.bid==this.OneBrand.id){
          var cha =rem.innumber-rem.outnumber
          this.max=cha
          return cha}
        }
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm("确认提交?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "提交成功!",
              });
              console.log(this.form);
              this.dialogFormVisible = false;
              this.form.addr = this.area.join(" ") + " " + this.addr;
              insrtOrder(this.form).then(this.$router.push("/result/success"));
              // this.$router.push('/result/success');
              this.$nextTick(() => {
                this.$refs[formName].clearValidate();
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
              //      this.$nextTick(() => {
              //   this.$refs[formName].clearValidate();
              // });
              this.$router.push("/result/erro");
            });
        } else {
          console.log(this.form);
          alert("请填写完整信息");
          return false;
        }
      });
    },

    handle: function () {
      var startAt = (new Date(this.form.appointmenttime) * 1000) / 1000;
      if (startAt < Date.now()) {
        this.form.appointmenttime = new Date();
      }
    },
    handleChange(value) {
      console.log(value);
    },
  },
};
</script>

<style>
</style>
