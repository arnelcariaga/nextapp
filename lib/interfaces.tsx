// Intereface for user credentials
export interface IUserCredentials {
  username: string,
  password: string
}

export interface IUserSignInAdCredentials {
  impersonatedBy: string
  to_user_id: number,
  rol_name: string,
  from_user_id: number
  from_username: string
}

// Intereface for user session object details
export interface IUser extends IUserCredentials {
  id: string
  id_role: number,
  id_sai: number
  profile_img: string,
  name: string,
  last_name: string,
  email: string,
  role_name: string
  role: {
    name: string
    screens: IModules[]
  }
  token: string
  screens: IModules[]
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
  path: string
  permissions: {
    id_screen: number
    view: string
    create: string
    edit: string
    delete: string
  }
}

// Interface for roles list with screens
export interface IRolesScreensObj extends IModules {

}
export interface IRolesScreens {
  id: number
  name: string
  is_admin: boolean
  updated_at: string
  screens: Array<IRolesScreensObj>
}

export interface IProvinces {
  id: number,
  name: string,
  created_at: string,
  updated_at: string
}

export interface IMunicipalities {
  id: number,
  name: string
  created_at: string,
  updated_at: string,
  province_id: number
}

export interface ISai {
  id: number,
  created_at: string,
  updated_at: string,
  type: string,
  component: string,
  name: string,
  region: string,
  province_id: number,
  municipe_id: number
  province: IProvinces
  municipe: IMunicipalities
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

export interface IAuditLogs {
  id: number,
  action: string
  before_update_data: string
  after_update_data: string
  details: string
  created_at: string
  updated_at: string
  user: {
    id: number,
    username: string
  }
  screen: [
    {
      id: number,
      name: string
      created_at: string
      updated_at: string
    }
  ]
}

export interface IShifts {
  id: number
  name: string
}

export interface ICommunityOperationTypes extends IShifts { }
export interface IMunicipalytyPlaces extends IShifts { }

export interface IFormstep {
  name: string
  label: string
  type: string
  validation?: { required: string }
  options?: { readOnly: boolean }
}

export interface IAddCommunityOperation {
  fields: Array<IFormstep>
}

export interface ICommunityOperationDataForm {
  province: number
  municipality: number | string
  municipality_place: string
  date: string
  shift: number
  no_team: number
  operation_type: number
}

interface ICommunityOperationType {
  id: number,
  name: string
}

export interface ICommunityOperationDataTable {
  id: number
  province_id: number
  municipe_id: number
  municipality_place_id: number
  activity_location: string
  date: Date,
  created_at: Date
  shift_id: number
  no_of_team: number
  community_operation_type_id: number
  province: IProvinces,
  municipality: IMunicipalities
  sai: ISai
  community_operation_type: ICommunityOperationType
  community_operation_users_count: number
}


export interface ICommunityOperationUsersDataTable {
  id: number
  created_at: string
  updated_at: string
  referral_number: number
  name: string
  last_name: string
  doc_id: string
  referral_type_id: number
  birth_date: Date
  age: number
  genre_id: number
  trial_promotion_talk_received: number
  tel: string
  hiv_test_in_last_twelve_mount: number
  beneficiary_nationality: number
  beneficiary_mother_nationality: number
  beneficiary_father_nationality: number
  serology_status_id: number
  user_id: number
  sai_id: number
  tester: string
  observation: string
  community_operation_id: number
  referral_type: ICommunityOperationType
  serology_status: ICommunityOperationType
  is_pregnant: number
}

export interface ICommunityOperationUsers {
  id: number
  name: string
  last_name: string
  referral_number: number
  created_at: string
  fapps_id: number
  referral_type: {
    id: number
    name: string
  }
  serology_status: {
    id: number
    name: string
  }
  community_operation: {
    date: string
    sai: {
      id: number
      name: string
    }
    province: {
      id: number
      name: string
    }
    municipality: {
      id: number
      name: string
    }
  }
}

export interface ICommunityOperationUserDetails extends ICommunityOperationUsersDataTable {
  fapps_id: number
  trackings_count: number
  enrolling_count: number
  enrolled_to_sai_id: number
  sai: {
    id: number
    name: string
  }
  genre: {
    id: number
    name: string
  }
  nationality: {
    id: number
    name: string
  }
}

export interface IUserCommunityUserTracking {
  id: number
  sai: {
      id: number
      name: string
  }
  date: Date
  enrolling_type: {
      id: number
      name: string
  }
  observations: string
}

export interface IUserCommunityUserEnrolling {
  id: number
  fapps_id: number
  sai: {
      id: number
      name: string
  }
  enrolling_date: Date
  treatment_start_date: Date
  tester: string
}