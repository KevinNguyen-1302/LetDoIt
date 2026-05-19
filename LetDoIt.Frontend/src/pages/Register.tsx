import { useEffect, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/toastHelper";
import { toast } from "react-toastify";

const Register = () => {

  const [displayname, setFullName] = useState("");                //|
  const [username, setUsername] = useState("");                   //|
  const [email, setEmail] = useState("");                         //|     
  const [phonenumber, setPhoneNumber] = useState("");             //|Các trường thông tin của form đăng ký
  const [dob, setDateOfBirth] = useState("");                     //|
  const [password, setPassword] = useState("");                   //|
  const [confirmPassword, setConfirmPassword] = useState("");     //|

  const [showPassword, setShowPassword] = useState(false);        //|Hiển thị mật khẩu hay không, mặc định là ẩn
 
  const [step, setStep] = useState(1);//|Quản lý bước của form đăng ký, mặc định là bước 1 (thông tin tài khoản)

  // Validation states for real-time feedback
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const validateEmail = (email : string) => {
    // Kiểm tra định dạng chuẩn: ten@mien.com
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value === "") {
      setEmailError("");
    } else if (!validateEmail(value)) {
      setEmailError("Email không hợp lệ!");
    } else {
      setEmailError("");
    }
  };

  const validatePhone = (phone : string) => {
    // Kiểm tra đầu số VN (03, 05, 07, 08, 09) và có đúng 10 số
    const phoneRegex = /^0[35789]\d{8}$/;
    const isValid = phoneRegex.test(phone);
    console.log("📞 Phone validation - Input:", phone, "Valid:", isValid);
    return isValid;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    
    if (value === "") {
      setPhoneError("");
    } else if (!validatePhone(value)) {
      setPhoneError("Số điện thoại không hợp lệ! (10 số, bắt đầu bằng 03, 05, 07, 08, 09)");
    } else {
      setPhoneError("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value && password !== value) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  const handleNext = () => {
    if (!username || !email || !password || !confirmPassword) {
      toast.warning("Vui lòng điền đầy đủ thông tin tài khoản!");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Email không hợp lệ!");
      toast.warning("Email không hợp lệ!");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      toast.warning("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    setStep(2);
  };

  const handlePrev = () => {
    setStep(1);
  };

  const [rules, setRules] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
    number: false,
  });  

  useEffect(() => {
    setRules({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
      number: /\d/.test(password),
    });
  }, [password]);

  const RuleItem = ({ isPassed, text }: { isPassed: boolean; text: string }) => (
    <div className={`flex items-center text-xs mt-1 transition-colors duration-300 ${isPassed ? 'text-green-500' : 'text-gray-400'}`}>
      <span className="mr-2">
        {isPassed ? '●' : '○'} 
      </span>
      {text}
    </div>
  );

  const navigate = useNavigate(); // Dùng navigate để chuyển hướng sau khi đăng ký thành công

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    console.log("📋 Form submitted - Current step:", step);

    if (step === 1) {
        console.log("📋 Step 1 - Moving to step 2");
        handleNext();
        return; 
    }

    console.log("📋 Step 2 - Starting validation");
    console.log("📋 Phone:", phonenumber, "Display Name:", displayname, "DOB:", dob);

    // Check validation states
    if (phoneError) {
        console.warn("❌ Phone has validation error:", phoneError);
        toast.error(phoneError);
        return;
    }

    if (step === 2) {
      // Validate trang 2 trước khi submit
      if (!displayname || !dob) {
        console.warn("❌ Missing required fields - displayname:", displayname, "dob:", dob);
        toast.warning("Vui lòng điền đầy đủ thông tin cá nhân!");
        return;
      }

      try {
        console.log("🚀 Sending register request to http://localhost:5112/api/user/register");
        const response = await fetch("http://localhost:5112/api/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            displayname,
            username,
            email,
            phonenumber,
            dob,
            password,
          }),
        });

        console.log("✅ Response received - Status:", response.status);
        const data = await response.json();

        if (response.ok) {
          console.log("✅ Registration successful!");
          navigate("/login");
          toast.success("Đăng ký thành công!");
        } else {
          console.error("❌ Registration failed:", data.message);
          handleApiError(response.status, data.message);
        }
      } catch (error) {
        console.error("❌ Network error or system error:", error);
        handleApiError(500);
      }
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

        <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="py-8">
              <center>
                <span className="text-3xl font-semibold">Register</span>
                <p className="text-gray-500 text-sm mt-2">Bước {step} của 2</p>
              </center>
            </div>

            {/* STEP 1: Username, Email, Password */}
            {step === 1 && (
              <div className="grid grid-cols-1">
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
                    onChange={handleEmailChange}
                    className={`w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] transition-colors ${emailError ? 'border-red-500 bg-red-50' : 'border-gray-800'}`}
                    required
                  />
                  {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
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
                          <path d="M12 4.998c-1.836 0-3.356.389-4.617.971L3.707 2.293 2.293 3.707l3.315 3.316c-2.613 1.952-3.543 4.618-3.557 4.66l-.105.316.105.316C2.073 12.382 4.367 19 12 19c1.835 0 3.354-.389 4.615-.971l3.678 3.678 1.414-1.414-3.317-3.317c2.614-1.952 3.545-4.618 3.559-4.60l.105-.316-.105-.316c-.022-.068-2.316-6.686-9.949-6.686zM4.074 12c.103-.236.274-.586.521-.989l5.867 5.867C6.249 16.23 4.523 13.035 4.074 12zm9.247 4.907-7.48-7.481a8.138 8.138 0 0 1 1.188-.982l8.055 8.054a8.835 8.835 0 0 1-1.763.409zm3.648-1.352-1.541-1.541c.354-.596.572-1.28.572-2.015 0-.474-.099-.924-.255-1.349A.983.983 0 0 1 15 11a1 1 0 0 1-1-1c0-.439.288-.802.682-.936A3.97 3.97 0 0 0 12 7.999c-.735 0-1.419.218-2.015.572l-1.07-1.07A9.292 9.292 0 0 1 12 6.998c5.351 0 7.425 3.847 7.926 5a8.573 8.573 0 0 1-2.957 3.557z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className=" p-3 mb-4 bg-gray-50 rounded-md border border-gray-100">
                  <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Độ bảo mật cần thiết:</p>
                  <RuleItem isPassed={rules.length} text="Ít nhất 8 ký tự" />
                  <RuleItem isPassed={rules.uppercase} text="Ít nhất 1 chữ in hoa" />
                  <RuleItem isPassed={rules.lowercase} text="Ít nhất 1 chữ thường" />
                  <RuleItem isPassed={rules.specialChar} text="Ít nhất 1 ký tự đặc biệt (@$!%*?&)" />
                  <RuleItem isPassed={rules.number} text="Ít nhất 1 con số" />
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
                      onChange={handleConfirmPasswordChange}
                      className={`w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] transition-colors ${!passwordsMatch && confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      required
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
                          <path d="M12 4.998c-1.836 0-3.356.389-4.617.971L3.707 2.293 2.293 3.707l3.315 3.316c-2.613 1.952-3.543 4.618-3.557 4.66l-.105.316.105.316C2.073 12.382 4.367 19 12 19c1.835 0 3.354-.389 4.615-.971l3.678 3.678 1.414-1.414-3.317-3.317c2.614-1.952 3.545-4.618 3.559-4.60l.105-.316-.105-.316c-.022-.068-2.316-6.686-9.949-6.686zM4.074 12c.103-.236.274-.586.521-.989l5.867 5.867C6.249 16.23 4.523 13.035 4.074 12zm9.247 4.907-7.48-7.481a8.138 8.138 0 0 1 1.188-.982l8.055 8.054a8.835 8.835 0 0 1-1.763.409zm3.648-1.352-1.541-1.541c.354-.596.572-1.28.572-2.015 0-.474-.099-.924-.255-1.349A.983.983 0 0 1 15 11a1 1 0 0 1-1-1c0-.439.288-.802.682-.936A3.97 3.97 0 0 0 12 7.999c-.735 0-1.419.218-2.015.572l-1.07-1.07A9.292 9.292 0 0 1 12 6.998c5.351 0 7.425 3.847 7.926 5a8.573 8.573 0 0 1-2.957 3.557z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  {!passwordsMatch && confirmPassword && <p className="text-red-500 text-xs mt-1">Mật khẩu xác nhận không khớp!</p>}
                </div>
              </div>
            )}

            {/* STEP 2: Full Name, Phone Number, DOB */}
            {step === 2 && (
              <div className="grid grid-cols-1">
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
                    onChange={handlePhoneChange}
                    className={`w-full rounded-md py-2.5 px-4 border text-sm outline-[#f84525] transition-colors ${phoneError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                  {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
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
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-8">
              {step === 2 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center px-4 py-2 bg-gray-400 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-500 focus:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                  Previous
                </button>
              )}

              <div className="flex items-center gap-4 ml-auto">
                {step === 1 && (
                  <a
                    className="hover:underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    href="/login"
                  >
                    Already have an account?
                  </a>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                  {step === 1 ? "Next" : "Register"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
