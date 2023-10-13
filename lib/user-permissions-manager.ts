import { User } from "@supabase/supabase-js"

export enum UserRole {
  EMPLOYEE = "employee",
  STUDENT = "student",
}

export class UserPermissionsManager {
  private roles: UserRole[]

  constructor(private user: User) {
    this.roles = []

    const role = this.getRoleFromEmail()
    if (role) {
      this.roles.push(role)
    }
  }

  public getRoles(): UserRole[] {
    return this.roles
  }

  public addRole(role: UserRole): void {
    if (!this.roles.includes(role)) {
      this.roles.push(role)
    }
  }

  public removeRole(role: UserRole): void {
    const index = this.roles.indexOf(role)
    if (index !== -1) {
      this.roles.splice(index, 1)
    }
  }

  public hasRole(role: UserRole): boolean {
    return this.roles.includes(role)
  }

  public isEmployee(): boolean {
    return this.hasRole(UserRole.EMPLOYEE)
  }

  public isStudent(): boolean {
    return this.hasRole(UserRole.STUDENT)
  }

  private getRoleFromEmail(): UserRole | null {
    if (this.user.email?.includes("@edu.mirea.ru")) {
      return UserRole.STUDENT
    } else if (this.user.email?.includes("@mirea.ru")) {
      return UserRole.EMPLOYEE
    }

    return null
  }
}
