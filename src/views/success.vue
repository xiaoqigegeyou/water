<template>
  <div >
    <result type="success" title="付款成功" desc="您已付款成功，请点击下方按钮返回">
      <el-button type="primary" size="small" @click="back">返回首页</el-button>
      <el-button size="small">打印</el-button>
    </result>
  </div>
</template>
<script>
import result from "@/components/Result";

export default {
  components: {
    result,
  },

  methods:{
    back() {
          this.$router.push("/");
        },
  }
};
</script>
