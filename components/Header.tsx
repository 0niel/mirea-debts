import { HeaderNavbar } from "./HeaderNavbar"
import { ThemeCommandMenu } from "./ThemeCommandMenu"
import { UserNav } from "./UserNav"

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-between px-4 sm:mx-6">
        <HeaderNavbar />
        <div className="flex items-center space-x-4">
          <ThemeCommandMenu />
          <UserNav />
        </div>
      </div>
    </div>
  )
}
