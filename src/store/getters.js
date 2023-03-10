const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  tell: state => state.user.tell,
  area: state => state.user.area,
  addr: state => state.user.addr,
  roles: state => state.user.roles,
  id: state => state.user.id,
  sex: state => state.user.sex,
  permission_routes: state => state.permission.routes
}
export default getters
