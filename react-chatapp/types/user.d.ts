export interface userInfo {
    userName: string
    userId: string
    avatar?: string
}

export interface userLogin {
    username: string
    password: string
}

export interface updatePassWord {
    password: string
    confirmPassword: string
}