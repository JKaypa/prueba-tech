'use client'

import Link from 'next/link';
import { FormEvent, useState } from "react";
import { useUserStore } from '../store/user.store';
import { useRouter } from 'next/dist/client/components/navigation';


const Login: React.FC = () => {

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { login } = useUserStore();
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isAuth = await login(user);

    if (isAuth) {
      router.push('/')
    }

  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  placeholder="Your email address"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  placeholder="******"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={user.password}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>

          <div className="text-center">
            <Link href="/register" className="text-indigo-600 hover:text-indigo-500">
              Don&#39;t have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;