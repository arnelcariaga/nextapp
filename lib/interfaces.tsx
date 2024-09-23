// Intereface for user credentials
export interface IUserCredentials {
  username: string,
  password: string
}

// Intereface for user session object details
export interface IUser extends IUserCredentials {
  id: string
  id_role: number,
  profile_img: string,
  name: string,
  last_name: string,
  email: string,
  role_name: string
  role: {
    name: string
  }
  token: string
}

// Intereface for session on sign in
export interface ISession {
  session: {
    user: IUser
  } | null
}

// Interface add rol fields
export interface IAddRol {
  name: string,
  isAdmin: boolean,
  status: number
}

// Interface for list of screens modules when adding a new rol in modal
export interface IModules {
  id: number
  name: string
  permissions: {
    id_screen: number
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
  }
}

// Interface for roles list with screens
export interface IRolesScreensObj {
  id: number
  name: string
}
export interface IRolesScreens {
  id: number
  name: string
  is_admin: boolean
  updated_at: string
  status: number
  screens: Array<IRolesScreensObj>
}

// Interface for users list with roles
export interface ISai {
  id: number,
  created_at: string,
  updated_at: string,
  type: string,
  component: string,
  name: string,
  region: string,
  province_id: number,
  municipe_id: number,
  status: number
  province: {
    id: number,
    name: string,
    created_at: string,
    updated_at: string
  },
  municipe: {
    id: number,
    name: string
    created_at: string,
    updated_at: string,
    province_id: number
  }
}

export interface IRoles {
  id: number,
  name: string,
  created_at: string,
  updated_at: string,
  is_admin: boolean
}

export interface IStatus {
  id: number,
  name: string,
  value: number,
}

export interface IUserData {
  id: number,
  profile_img: string,
  name: string,
  last_name: string,
  doc_id: string,
  email: string,
  status: number,
  statusList: IStatus
  created_at: string,
  updated_at: string,
  username: string,
  id_sai: number,
  id_role: number,
  role: IRoles
  sai: ISai
}

export interface IAddUserForm extends IUserData {
  password: string
  repeatPassword: string
}