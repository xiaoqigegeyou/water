<template>
  <div>
    <div style=" float:right">
        <el-popover
    placement="top-start"
    title="详情"
    width="200"
    trigger="hover"
    :content="details">
    <p class="tipck">容量：{{capacity}}</p>
    <p class="tipck">保质期：{{warranty}} </p>
    <el-button type="text" slot="reference">详情</el-button>
  </el-popover>
  &nbsp;&nbsp;&nbsp;
      <el-button type="danger" size="mini" @click="dialogFormVisible = true">
        立即预约
      </el-button>
    </div>
    <el-dialog title="确认订单" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth">
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

        <el-form-item label="送水人员" prop="did">
          <el-select v-model="form.did" placeholder="请选择">
            <el-option
              v-for="(item,index) in deliver"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="预约时间" prop="appointmenttime">
          <el-date-picker
            v-model="form.appointmenttime"
            :picker-options="pickerOption"
            type="datetime"
            @change="handle"
            format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="即时配送">
          <el-switch v-model="delivery"></el-switch>
        </el-form-item>
        <el-form-item label="电话" style="width:600px">
          <el-input v-model="form.tell"></el-input>
        </el-form-item>
        <el-form-item label="地区" style="width:800px">
            <cascader-area v-model="area" />
          <!-- <el-input type="textarea" autosize v-model="form.addr"></el-input> -->
        </el-form-item>
         <el-form-item label="详细地址" style="width:800px">

          <el-input type="textarea" autosize v-model="addr"></el-input>
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
import  CascaderArea from "@/components/CascaderArea";
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
        addr: '',
        bname: this.OneBrand.name,
        person: "",
        starttime: new Date(),
        appointmenttime: "",
        price: "",
        uid: this.$store.getters.id,
        did: "",
      },
      capacity:this.OneBrand.capacity,
      warranty:this.OneBrand.warranty,

      deliver: [],
      delivery: false,
      formLabelWidth: "180px",
      num: 1,

      dialogFormVisible: false,

      rules: {
        did: [
          { required: true, message: "请选择配送人员", trigger: "blur" },
        ],
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
      this.form.price = this.num * this.OneBrand.price;
      return this.num * this.OneBrand.price;
    },
    details(){
      return '容量：'+this.capacity+'\n\r保质期：'+this.warranty
    }
  },
  created() {
    allDeliver().then((response) => (this.deliver = response.data));
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('确认提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
           console.log(this.form);
          this.dialogFormVisible = false;
          this.form.addr=this.area.join(" ")+" "+this.addr
          insrtOrder(this.form).then(this.$router.push('/result/success'));
          // this.$router.push('/result/success');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          this.$router.push('/result/erro');
        });

        } else {
          console.log(this.form);
          alert("请填写完整信息");
          return false;
        }
      });
    },

handle: function() {
       var startAt = new Date(this.form.appointmenttime) * 1000 /1000;
        if(startAt < Date.now()) {
            this.form.appointmenttime= new Date();
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
