import { useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/toastHelper";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import LoginWithGoogleButton from "../components/LoginWithGoogleButton";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5112/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🔍 Debug: kiểm tra cấu trúc response
        console.log("Response data:", data);

        // ✅ Lưu token và refresh token (lấy từ data.data vì middleware wrap)
        const accessToken = data.data?.accessToken || data.accessToken;
        const refreshToken = data.data?.refreshToken || data.refreshToken;

        if (!accessToken) {
          console.error("accessToken không tồn tại trong response");
          handleApiError(500, "Lỗi: Không nhận được token từ server");
          return;
        }

        // Điều hướng sang trang LoginSuccess để xử lý chung logic lưu Token
        navigate(`/login-success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
      } else {
        handleApiError(response.status, data.message);
      }
    } catch (error) {
      console.error("Lỗi kết nối login:", error);
      handleApiError(500);
    }
  };

  return (
    <div className=" text-gray-900 antialiased">
      <div className="min-h-screen flex flex-col sm:justify-center items-center sm:pt-0 bg-[#f8f4f3]">
        <div>
          <h2 className="font-bold text-4xl">
            Let's{" "}
            <span className="bg-[#eff759] text-black px-2 rounded-md">
              DoIt
            </span>
          </h2>
        </div>

        <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="py-4">
              <center>
                <span className="text-3xl font-semibold">Log In</span>
              </center>
            </div>

            {/* Username Field */}
            <div className="mb-4">
              <label
                className="block font-medium text-sm text-gray-700"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Insert your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                className="block font-medium text-sm text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Insert your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]"
                required
              />
            </div>

            {/* Password Field */}
            <div className="mt-4">
              <label
                className="block font-medium text-sm text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Insert your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]"
                />

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-900 focus:outline-none focus:text-gray-600 hover:text-gray-600"
                  >
                    {/* Icon Eye / Eye-off */}
                    {showPassword ? <Eye /> : <EyeOff />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me
            <div className="block mt-4">
              <label htmlFor="remember_me" className="flex items-center">
                <input
                  type="checkbox"
                  id="remember_me"
                  name="remember"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                />
                <span className="ms-2 text-sm text-gray-600">Remember Me</span>
              </label>
            </div> */}

            <div className="mt-4 text-center ">
              No account yet?{" "}
              <a
                href="/register"
                className="text-md text-[#f84525] hover:text-red-800 font-medium transition-colors underline"
              >
                Register here
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end mt-4">
              <a
                className="hover:underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                href="/forgot-password"
              >
                Forgot your password?
              </a>
              <button
                type="submit"
                className="ms-4 inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
              >
                Sign In
              </button>
            </div>
          </form>
          <span className="mt-2 mb-4 flex text-center items-center">
            <hr className="flex-1" />
            <span className="mx-2 font-medium">Or</span>
            <hr className="flex-1" />
          </span>
          <div className="flex items-center justify-center mb-4">
            <LoginWithGoogleButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
