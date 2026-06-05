import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const LoginSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Decode token để lấy userId giống như luồng đăng nhập thường
      try {
        const decoded: any = jwtDecode(accessToken);
        const userId =
          decoded.sub || decoded.nameid || decoded.userId || decoded.id;
        if (userId) {
          localStorage.setItem("userId", userId);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }

      // Thông báo cho App.tsx cập nhật state isAuth = true
      window.dispatchEvent(new Event("authChange"));

      // Tạo delay 3s trước khi điều hướng về Home để có hiệu ứng UI chuyển cảnh mượt mà
      setTimeout(() => {
        navigate("/home");
        toast.success("Đăng nhập thành công!");
      }, 3000);
    } else {
      // Trở về trang login nếu lỗi
      navigate("/login");
      toast.error("Đăng nhập thất bại!");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen bg-zinc-900 text-white">
      <p className="text-xl animate-pulse">Processing your login request...</p>
      <p className="text-xl animate-pulse">Please wait a few seconds</p>
    </div>
  );
};

export default LoginSuccess;
