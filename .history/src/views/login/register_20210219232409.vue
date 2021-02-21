
<template>
  <div>
    <div class="bg-banner" />
    <div id="login-box">
      <div class="login-banner" />
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
    <div class="title-container">
          <h3 class="title">注册界面</h3>
        </div>
  <el-form-item label="用户名" prop="name">
    <el-input v-model="ruleForm.name" placeholder="用户名"></el-input>
  </el-form-item>
    <el-form-item label="电话号码" prop="tell">
    <el-input v-model="ruleForm.tell" placeholder="电话号码"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="pass">
    <el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="密码"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="checkPass">
    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="确认密码"></el-input>
  </el-form-item>
   <el-form-item label="配送地址" prop="desc">
    <el-input type="textarea" v-model="ruleForm.desc" placeholder="配送地址"></el-input>
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
import { register} from '@/api/user'
export default {
  data() {
       var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validatetell = (rule, value, callback) => {
       if (!value) {
          return callback(new Error('电话不能为空'));
        }
        setTimeout(() => {
            if (value.length != 11) {
              callback(new Error('电话号码格式错误'));
            } else {
              callback();
            }

        }, 1000);
      };

    return {
      labelPosition: "right",
      ruleForm: {
          name:"",
          tell: "",
         pass: "",
         checkPass:"",
          desc:"",
      },
       rules: {
           name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
          ],
           tell: [
            { required: true,validator: validatetell, trigger: 'blur' }
          ],
          pass: [
            { required: true,validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { required: true,validator: validatePass2, trigger: 'blur' }
          ]
          }
    };
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            register(this.ruleForm).then(alert('submit!')).catch(console.log('error submit!!'))

        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
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
  width: 350px;
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
