import {
  login,
  logout,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    id: '',
    name: '',
    tell: '',
    area:[],
    addr: '',
    roles: '',
    sex: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_TELL: (state, tell) => {
    state.tell = tell
  },
  SET_AREA: (state, area) => {
    state.area = area
  },
  SET_ADDR: (state, addr) => {
    state.addr = addr
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },

  SET_SEX: (state, sex) => {
    state.sex = sex
  }

}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      tell,
      pass
    } = userInfo
    return new Promise((resolve, reject) => {
      login(tell, pass).then(response => {
        const {
          data
        } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const data = response.data

        if (!data) {
          return reject('Verification failed, please Login again.')
        } else {
          console.log(data);
          let roles
          const {
            name,
            tell,
            area,
            addr,
            id,
            sex,
            avatar
          } = data

          if (data.roles === 1) {
            roles = ['admin']

          } else {
            roles = ['normal']
          }

          if (avatar === ''||typeof(avatar) == "undefined") {
            commit('SET_AVATAR', 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
          } else {
            commit('SET_AVATAR', avatar)
          }


          if (area === ''||typeof(area) == "undefined") {
            commit('SET_AREA', [])
          } else {
            commit('SET_AREA', area.split(','))
          }
          console.log(area);
          commit('SET_ROLES', roles)
          commit('SET_SEX', sex)
          commit('SET_NAME', name)
          commit('SET_TELL', tell)

          commit('SET_ADDR', addr)
          commit('SET_ID', id)

          resolve(data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
