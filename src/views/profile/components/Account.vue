<template>
  <el-form >
    <el-form-item label="姓名">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="电话">
      <el-input v-model.trim="user.tell" />
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model.trim="user.addr" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateInfo } from "@/api/user";
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: "",
          name: "",
          tell: "",
          addr: "",
        };
      },
    },
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        tell: '',
        addr: '',
      },
    };
  },
  methods: {
    submit() {

      this.form.id=this.user.id,
      this.form.name=this.user.name,
      this.form.tell=this.user.tell,
      this.form.addr=this.user.addr,
      console.log(this.form);
      updateInfo(this.form).then(() => {
        this.$message({
          message: "用户信息更新已成功",
          type: "success",
          duration: 2000,
        });
      });
    },
  },
};
</script>
