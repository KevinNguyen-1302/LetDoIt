import googleLogo from "../../../LetDoIt.Frontend/public/google-logo-search-new-svgrepo-com.svg";

const LoginWithGoogleButton = () => {
  const handleLoginWithGoogle = () => {
    window.location.href =
      "http://localhost:5112/api/account/login/google?returnUrl=http://localhost:5173/login-success";
  };
  return (
    <>
      <button
        className="cursor-pointer border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
        onClick={handleLoginWithGoogle}
      >
        <img className="w-6 h-6 mr-2" src={googleLogo} alt="Google Logo" />
        Login with Google
      </button>
    </>
  );
};

export default LoginWithGoogleButton;
