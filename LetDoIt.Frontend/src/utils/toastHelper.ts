import { toast } from "react-toastify";

export const handleApiError = (status: number, message?: string) => {
  switch (status) {
    case 201:
      toast.success("Tạo tài khoản thành công rồi nhe!", {
        theme: "colored", 
        style: { backgroundColor: "#25F8AE" }, 
      });
      break;
    case 400:
      toast.error("Dữ liệu không hợp lệ, check lại nhe bro!", {
        theme: "colored", 
        style: { backgroundColor: "#F84525" }, 
      });
      break;
    case 401:
      toast.warning("Tài khoản hoặc mật khẩu sai rồi kìa!", {
        theme: "colored", 
        style: { backgroundColor: "#D8F825" }, 
      });
      break;
    case 403:
      toast.error("Bro không có quyền truy cập khu vực này!", {
        theme: "colored", 
        style: { backgroundColor: "#F84525" }, 
      });
      break;
    case 404:
      toast.info("Không tìm thấy dữ liệu yêu cầu.", {
        theme: "colored", 
        style: { backgroundColor: "#4525F8" }, 
      });
      break;
    case 409:
      toast.error("Dữ liệu này đã tồn tại trên hệ thống", {
        theme: "colored", 
        style: { backgroundColor: "#4525F8" }, 
      });
      break;
    case 500:
      toast.error("Server đang gặp sự cố ròiiiii, thử lại sau nhe!", {
        theme: "colored", 
        style: { backgroundColor: "#F84525" },
      });
      break;
    default:
      toast.error(message || "Có lỗi gì đó lạ lắm, kiểm tra console thử đi!");
  }
};
