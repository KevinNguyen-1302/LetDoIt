import React, { useState } from "react";

const Register = () => {
  const [displayname, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [dob, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add register logic here

    try { const registrationData = await fetch(
        "http://localhost:5112/api/user/register",
        {
            method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayname,
          username,
          email,
          phonenumber,
          dob,
          password,
        }),
        },
      );

      if (registrationData.ok) {
        alert("Đăng ký thành công! Đang chuyển hướng...");
        // Dùng useNavigate của react-router-dom để về trang login
      } else {
        const errorData = await registrationData.json();
        alert(`Lỗi: ${errorData.message || "Đăng ký thất bại"}`);
      }
      if (!registrationData.ok) {
      throw new Error("Registration failed");
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    const responseData = await registrationData.json();
    console.log("Registration successful:", responseData);
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
    
  };
  return (
    <div className=" text-gray-900 antialiased">
      <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f8f4f3]">
        <div>
          <a href="/">
            <h2 className="font-bold text-4xl">
              Let's{" "}
              <span className="bg-[#eff759] text-black px-2 rounded-md">
                DoIt
              </span>
            </h2>
          </a>
        </div>

        <div className="w-full sm:max-w-4xl mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="py-8">
              <center>
                <span className="text-3xl font-semibold">Register</span>
              </center>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* LEFT COLUMN */}
              <div>
                {/* Full Name Field */}
                <div className="mb-4">
                  <label
                    className="block font-medium text-sm text-gray-700"
                    htmlFor="fullName"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Insert your full name"
                    value={displayname}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]"
                    required
                  />
                </div>

                {/* Phone Number Field */}
                <div className="mb-4">
                  <label
                    className="block font-medium text-sm text-gray-700"
                    htmlFor="phoneNumber"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Insert your phone number"
                    value={phonenumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]"
                  />
                </div>

                {/* Date of Birth Field */}
                <div className="mb-4">
                  <label
                    className="block font-medium text-sm text-gray-700"
                    htmlFor="dateOfBirth"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={dob}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]"
                    required
                  />
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div>
                {/* Username Field */}
                <div className="mb-4">
                  <label
                    className="block font-medium text-sm text-gray-700"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
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
                <div className="mb-4">
                  <label
                    className="block font-medium text-sm text-gray-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
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
                <div className="mb-4">
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
                        className="text-gray-500 focus:outline-none focus:text-gray-600 hover:text-gray-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          style={{ fill: "rgba(0, 0, 0, 1)" }}
                        >
                          <path d="M12 4.998c-1.836 0-3.356.389-4.617.971L3.707 2.293 2.293 3.707l3.315 3.316c-2.613 1.952-3.543 4.618-3.557 4.66l-.105.316.105.316C2.073 12.382 4.367 19 12 19c1.835 0 3.354-.389 4.615-.971l3.678 3.678 1.414-1.414-3.317-3.317c2.614-1.952 3.545-4.618 3.559-4.66l.105-.316-.105-.316c-.022-.068-2.316-6.686-9.949-6.686zM4.074 12c.103-.236.274-.586.521-.989l5.867 5.867C6.249 16.23 4.523 13.035 4.074 12zm9.247 4.907-7.48-7.481a8.138 8.138 0 0 1 1.188-.982l8.055 8.054a8.835 8.835 0 0 1-1.763.409zm3.648-1.352-1.541-1.541c.354-.596.572-1.28.572-2.015 0-.474-.099-.924-.255-1.349A.983.983 0 0 1 15 11a1 1 0 0 1-1-1c0-.439.288-.802.682-.936A3.97 3.97 0 0 0 12 7.999c-.735 0-1.419.218-2.015.572l-1.07-1.07A9.292 9.292 0 0 1 12 6.998c5.351 0 7.425 3.847 7.926 5a8.573 8.573 0 0 1-2.957 3.557z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="mb-4">
                  <label
                    className="block font-medium text-sm text-gray-700"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525]"
                    />

                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 focus:outline-none focus:text-gray-600 hover:text-gray-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                          style={{ fill: "rgba(0, 0, 0, 1)" }}
                        >
                          <path d="M12 4.998c-1.836 0-3.356.389-4.617.971L3.707 2.293 2.293 3.707l3.315 3.316c-2.613 1.952-3.543 4.618-3.557 4.66l-.105.316.105.316C2.073 12.382 4.367 19 12 19c1.835 0 3.354-.389 4.615-.971l3.678 3.678 1.414-1.414-3.317-3.317c2.614-1.952 3.545-4.618 3.559-4.66l.105-.316-.105-.316c-.022-.068-2.316-6.686-9.949-6.686zM4.074 12c.103-.236.274-.586.521-.989l5.867 5.867C6.249 16.23 4.523 13.035 4.074 12zm9.247 4.907-7.48-7.481a8.138 8.138 0 0 1 1.188-.982l8.055 8.054a8.835 8.835 0 0 1-1.763.409zm3.648-1.352-1.541-1.541c.354-.596.572-1.28.572-2.015 0-.474-.099-.924-.255-1.349A.983.983 0 0 1 15 11a1 1 0 0 1-1-1c0-.439.288-.802.682-.936A3.97 3.97 0 0 0 12 7.999c-.735 0-1.419.218-2.015.572l-1.07-1.07A9.292 9.292 0 0 1 12 6.998c5.351 0 7.425 3.847 7.926 5a8.573 8.573 0 0 1-2.957 3.557z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end mt-8">
              <a
                className="hover:underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                href="/login"
              >
                Already have an account?
              </a>

              <button
                type="submit"
                className="ms-4 inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
