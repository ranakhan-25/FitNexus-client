import { RoleController } from "@/components/role/RoleController"

const UserLayout = async({children}) => {
  await RoleController("trainer")
  return children
}

export default UserLayout