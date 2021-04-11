<template>
  <el-form>
    <el-form-item label="姓名">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio label="男" />
        <el-radio label="女" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="电话">
      <el-input v-model.trim="user.tell" />
    </el-form-item>
    <el-form-item label="区域">
      <cascader-area v-model="user.area" />
    </el-form-item>
    <el-form-item label="详细地址">
      <el-input v-model.trim="user.addr" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
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
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: '',
          name: '',
          tell: '',
          sex: '',
          area: '',
          addr: ''
        }
      }
    }
  },
  data() {
    return {
      form: {
        id: '',
        sex: '',
        name: '',
        tell: '',
        area: [],
        addr: ''
      }
    }
  },
  methods: {
    submit() {
      (this.form.id = this.user.id),
      (this.form.name = this.user.name),
      (this.form.sex = this.user.sex),
      (this.form.tell = this.user.tell),
      (this.form.addr = this.user.addr),
      (this.form.area = this.user.area.join(',')),

      this.$store.commit('user/SET_SEX', this.user.sex)
      this.$store.commit('user/SET_NAME', this.user.name)
      this.$store.commit('user/SET_TELL', this.user.tell)
      this.$store.commit('user/SET_AREA', this.user.area)
      this.$store.commit('user/SET_ADDR', this.user.addr)

      console.log(this.form)
      updateInfo(this.form).then(() => {
        this.$message({
          message: '用户信息更新已成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
