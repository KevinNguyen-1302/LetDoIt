const Pomodoro = () => {
    return (
        <div className="max-w-7xl mx-auto h-full flex flex-col p-6 justify-center items-center bg-amber-100 ">
            <div className="text-4xl font-bold mb-4">
                Break time! New session starts in:
            </div>
            <div className=" rounded-lg border-4 border-amber-600 p-6 text-center text-4xl font-bold bg-[#f5f5f5] shadow-[20px_20px_0px_0px_rgba(120,69,0,1)]">
                25:00
            </div>
        </div>
    )
}

export default Pomodoro