<template>
  <result type="error" title="提交失败" desc="请核对并修改以下信息后，再重新提交。">
    <div slot="extra">
      <div>您提交的内容有如下错误：</div>
      <div>
        付款失败
        <a href="###">打印</a>
      </div>
    </div>
    <el-button type="primary" size="small" @click="back">返回修改</el-button>
  </result>
</template>
<script>
import result from '@/components/Result'

export default {
  components: {
    result
  },

  methods: {
    back() {
      this.$router.push('/')
    }
  }
}
</script>
