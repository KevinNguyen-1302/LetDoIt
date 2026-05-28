const Footer = () => {
  return (
    <div className="text-center mt-4 mb-4 text-gray-500">
      <p>
        Let's{" "}
        <span className="bg-[#eff759] text-black px-2 rounded-md">DoIt</span>
        {new Date().getFullYear()}
        <span className="mx-2">|</span>
        <span>All rights reserved.</span>
      </p>
    </div>
  );
};

export default Footer;
