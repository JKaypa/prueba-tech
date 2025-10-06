'use client'
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { useUserStore } from "../../store/user.store";
import { useCartStore } from "../../store/cart.store";

const Header: React.FC = () => {
  const { authUser, logout } = useUserStore();
  const { clearCart: clear } = useCartStore()
  const router = useRouter();

  const handleLogout = () => {
    logout();
    clear()
    router.push('/login');
  }

  return <header className="p-4 border-b border-gray-200 flex items-center justify-between">
    <h1 className="text-2xl font-bold">Your Products App</h1>

    <div className="flex items-center">
      <nav>
        <Link href="/" className="text-gray-600 hover:text-gray-800">Products</Link>

        {authUser?.role === 'user' &&
          <Link href="/orders" className="ml-4 text-gray-600 hover:text-gray-800">My Orders</Link>}
        {authUser?.role === 'admin' && (
          <Link href="/admin" className="ml-4 text-gray-600 hover:text-gray-800">Admin</Link>
        )}
      </nav>

      {authUser && (
        <>
          <p className="ml-6">{authUser.username}</p>
          <button onClick={handleLogout} className="ml-4 text-sm text-red-600">Logout</button>
        </>
      )}

    </div>
  </header>
}

export default Header;