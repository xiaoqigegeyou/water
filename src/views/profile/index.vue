<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="更新信息" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="activity">
                <activity />
              </el-tab-pane>
              <!-- <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane> -->

            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  name: 'Profile',
  // inject: ["reload"],
  components: { UserCard, Activity, Timeline, Account },
  data() {
    return {
      user: {},
      activeTab: 'account'
    }
  },
  computed: {
    ...mapGetters([
      'id',
      'name',
      'sex',
      'avatar',
      'roles',
      'area',
      'addr',
      'tell'
    ])
  },
  created() {
    //  this.reload();
    this.mapGetters
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        id: this.id,
        name: this.name,
        roles: this.roles,
        sex: this.sex,
        tell: this.tell,
        avatar: this.avatar,
        area: this.area,
        addr: this.addr
      }
    }
  }
}
</script>
