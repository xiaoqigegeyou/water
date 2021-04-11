<template>
  <el-form ref="form" :rules="rules" :model="form">
    <el-form-item label="新密码" prop="pass">
      <el-input v-model="form.pass" show-password placeholder="新密码" />
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input v-model="form.checkPass" show-password placeholder="确认密码" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit('form')">修改密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateInfo } from '@/api/user'
import CascaderArea from '@/components/CascaderArea'
export default {
  components: {
    CascaderArea
  },

  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {

      form2: {
        id: this.$store.getters.id,
        pass: ''
      },
      form: {
        checkPass: '',
        pass: ''
      },
      rules: {
        pass: [{ required: true, validator: validatePass, trigger: 'blur' }],
        checkPass: [{ required: true, validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form2.pass = this.form.pass
          updateInfo(this.form2).then(() => {
            this.$message({
              message: '密码更改已成功',
              type: 'success',
              duration: 2000
            })
          })
          this.$nextTick(() => {
            this.$refs[formName].resetFields()
          })
        } else {
          this.$refs[formName].resetFields()

          this.$message({
            message: '密码更改失败',
            type: 'warning',
            duration: 2000
          })

          return false
        }
      })
    }
    // submit() {
    //   (this.form.id = this.user.id),
    //     (this.form.name = this.user.name),
    //     (this.form.sex = this.user.sex),
    //     (this.form.tell = this.user.tell),
    //     (this.form.addr = this.user.addr),
    //     (this.form.area = this.user.area.join(",")),

    //      this.$store.commit('user/SET_SEX', this.user.sex)
    //       this.$store.commit('user/SET_NAME', this.user.name)
    //       this.$store.commit('user/SET_TELL', this.user.tell)
    //       this.$store.commit('user/SET_AREA', this.user.area)
    //       this.$store.commit('user/SET_ADDR', this.user.addr)

    //     console.log(this.form);
    //   updateInfo(this.form).then(() => {
    //     this.$message({
    //       message: "用户信息更新已成功",
    //       type: "success",
    //       duration: 2000,
    //     });
    //   });

    // },
  }
}
</script>
