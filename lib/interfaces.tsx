// Intereface for user credentials
export interface IUserCredentials {
  username: string,
  password: string
}

// Intereface for user session object details
export interface IUser extends IUserCredentials {
  id_role: number,
  profile_img: string,
  name: string,
  last_name: string,
  email: string,
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
  isAdmin: boolean
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
  screens: Array<IRolesScreensObj>
}