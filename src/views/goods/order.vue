<template>
  <div>
    <div style=" float:right">
      <el-button type="text" @click="dialogFormVisible = true">
        <h3>立即预约</h3>
      </el-button>
    </div>
    <el-dialog title="确认订单" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form"   :rules="rules" :label-width="formLabelWidth">
        <!-- //name -->
        <input type="hidden" v-model="form.name" />

        <!-- //下单时间 -->
        <input type="hidden" v-model="form.currentDate" />

        <el-form-item label="品牌名" style="width:400px">
          <el-input v-model="form.bname" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="个数">
          <el-input-number v-model="num" @change="handleChange" :min="1" :max="100" label="描述文字"></el-input-number>
        </el-form-item>

        <el-form-item label="送水人员"  prop="person">
          <el-select v-model="form.person" placeholder="请选择">
            <el-option
              v-for="(item,index) in deliver"
              :key="index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="预约时间" prop="appointmenttime">
          <el-date-picker v-model="form.appointmenttime" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="即时配送" >
          <el-switch v-model="delivery"></el-switch>
        </el-form-item>
        <el-form-item label="电话" style="width:600px">
          <el-input v-model="form.tell"></el-input>
        </el-form-item>
        <el-form-item label="地址" style="width:800px">
          <el-input type="textarea" autosize v-model="form.addr"></el-input>
        </el-form-item>
        <el-form-item>
          <h3>总价：{{sum}}元</h3>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">提交订单</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { insrtOrder, allBrand, allDeliver } from "@/api/goods";

export default {
  props: ["OneBrand"],

  data() {
    return {
      form: {
        name: this.$store.getters.name,
        tell: this.$store.getters.tell,
        addr: this.$store.getters.addr,
        bname: this.OneBrand.name,
        person: "",
        starttime: new Date(),
        appointmenttime: "",
        price: "",
      },
      deliver: [],
      delivery: false,
      formLabelWidth: "180px",
      num: 1,

      dialogFormVisible: false,

      rules: {
       person: [
            { required: true, message: '请选择配送人员', trigger: 'blur' }
          ],
          appointmenttime: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'blur' }
          ],
      },
    };
  },
  computed: {
    sum() {
      this.form.price = this.num * this.OneBrand.price;
      return this.num * this.OneBrand.price;
    },
  },
  created() {
    allDeliver().then((response) => (this.deliver = response.data));
  },
  methods: {
    // onSubmit() {
    //   console.log(this.form);
    //   insrtOrder(this.form).then(alert("提交成功"));
    // },
 onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        console.log(this.form);
        this.dialogFormVisible = false
        insrtOrder(this.form).then(alert("提交成功"));
        } else {
          console.log(this.form);
          alert("请填写完整信息")
          return false;
        }
      });
    },
    handleChange(value) {
      console.log(value);
    },
  },
};
</script>

<style>
</style>
