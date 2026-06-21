import { RoleController } from "@/components/role/RoleController"

const UserLayout = async({children}) => {
  await RoleController("admin")
  return children
}

export default UserLayout