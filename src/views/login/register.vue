
<template>
  <div>
    <div class="bg-banner" />
    <div id="login-box">
      <div class="login-banner" />
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="80px"
        class="demo-ruleForm"
      >
        <div class="title-container">
          <h3 class="title">注册界面</h3>
        </div>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="ruleForm.name" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="电话号码" prop="tell">
          <el-input v-model="ruleForm.tell" placeholder="电话号码" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="ruleForm.pass" show-password autocomplete="off" placeholder="密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            v-model="ruleForm.checkPass"
            show-password
            autocomplete="off"
            placeholder="确认密码"
          />
        </el-form-item>
        <el-form-item label="选择区域" prop="area">
          <!-- <el-input type="textarea" v-model="ruleForm.addr" placeholder="配送地址"></el-input> -->
          <cascader-area v-model="area" />
        </el-form-item>
        <el-form-item label="详细地址" prop="addr">
          <el-input v-model="ruleForm.addr" type="textarea" placeholder="小区楼道/乡村名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即注册</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { register, getInfo } from "@/api/user";
import CascaderArea from "@/components/CascaderArea";
export default {
  components: {
    CascaderArea,
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatetell = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("电话不能为空"));
      }

      setTimeout(() => {

        if (value.length != 11) {
          callback(new Error("电话号码格式错误"));
        } else {
            // var re =1;
         getInfo(value).then((re)=>{

            if ( re.data!== 0) {
            callback(new Error("该电话号码已经被使用！"));
            }else{
              callback();
            }

         })
        }
      }, 1000);
    };

    return {
      // area: ['山东省' , '济南市' , '长清区'],

      labelPosition: "right",
      area: [],
      ruleForm: {
        name: "",
        tell: "",
        sex: "男",
        pass: "",
        checkPass: "",
        area: "",
        addr: "",
      },

      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        tell: [{ required: true, validator: validatetell, trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.area = this.area.join(",");
          console.log(this.ruleForm);
          register(this.ruleForm)
            .then(alert("注册成功!"))
            .then(this.$router.push("/login"));
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.bg-banner {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/images/login-bg.jpg);
  background-size: cover;
  background-position: center center;
}
#login-box {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px #999;
}
.login-banner {
  width: 200px;
  background-image: url(../../assets/images/login-banner.jpg);
  background-size: cover;
  background-position: center center;
}
.demo-ruleForm {
  width: 400px;
  padding: 50px 40px 50px;
  overflow: hidden;
}
.title-container {
  position: relative;
}
.title {
  font-size: 22px;
  color: #666;
  margin: 0 auto 30px;
  text-align: center;
  font-weight: bold;
}
</style>
