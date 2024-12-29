
const Otp = () => {
    return (
        <div className={'flex justify-center gap-2'}>
            <SubOtpBox />
            <SubOtpBox />
            <SubOtpBox />
            <SubOtpBox />
            <SubOtpBox />
            <SubOtpBox />

        </div>
    )
}

const SubOtpBox = () => {
    return (
        <>
            <input className={'w-[40px] h-[50px] rounded-md' }/>
        </>
    )
}

export default Otp


