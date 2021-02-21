
<template>
  <div>

    <div class="bg-banner" />
    <div id="login-box">
      <div class="login-banner" />
      <el-form
        :model="ruleForm"
        size="medium"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :label-position="labelPosition"
      >
        <div class="title-container">
          <h3 class="title">登录界面</h3>
        </div>
        <el-form-item label="账号" prop="tell">
          <el-input v-model="ruleForm.tell" placeholder="电话号码" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
            placeholder="密码"
            style="width: 200px;"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" size="medium" style="margin-right:20px;">登录</el-button>

          <el-button @click="register" size="medium">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "right",
      ruleForm: {
        tell: "",
        pass: "",
      },
    };
  },
  methods: {
    submit () {
      // if (this.ruleForm.tell === "111" && this.ruleForm.pass === "111")
      //   alert("登陆成功");
      // else alert("账号或密码错误");
      this.$store.dispatch('user/login', this.ruleForm).then(() => {
              this.$router.push({ path: this.redirect || '/' })
    },
    register () {
        this.$router.push("/register")
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
  background-image: url(../assets/images/login-bg.jpg);
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
  background-image: url(../assets/images/login-banner.jpg);
  background-size: cover;
  background-position: center center;
}
.demo-ruleForm {
  width: 350px;
  padding: 30px 10px 40px;
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
