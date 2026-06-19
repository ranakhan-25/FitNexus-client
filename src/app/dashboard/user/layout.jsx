import { RoleController } from "@/components/role/RoleController"

const UserLayout = async({children}) => {
  await RoleController("user")
  return children
}

export default UserLayout