// sign up
export interface SignUpParams {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  confirm_success_url: string
}

// sign in
export interface SignInParams {
  email: string
  password: string
}

// user
export interface User {
  id: number
  uid: string
  provider: string
  email: string
  name: string
  nickname?: string
  image?: string
  allowPasswordChange: boolean
  created_at: Date
  updated_at: Date
}

export interface Project {
  id: number
  title: string
  created_at: Date
  updated_at: Date
}
