import React from "react"
import { Call, Mail } from "@mui/icons-material"

const TopBar = () => {
    const logo = process.env.PUBLIC_URL + "/logo.svg"

    return (
        <div className="flex border-b border-black border-opacity-20 flex-row bg-black text-white py-[8px] px-2 md:px-[16rem] 2xl:px-[25rem] top-0 text-sx w-full fixed z-[1000]">
            <div className="ml-4 flex flex-row items-center w-full">
                <div className="flex flex-col lg:flex-row gap-1 lg:gap-6 lg:items-center text-xs">
                    <div className="flex flex-row gap-2 items-center">
                        <Mail
                            sx={{
                                fontSize: "1.3rem",
                                "@media (max-width: 1024px)": {
                                    fontSize: "1rem",
                                },
                            }}
                        />
                        <div className="text-[0.7rem] text-white">
                            info@makroteknik.com.uk
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <Call
                            sx={{
                                fontSize: "1.3rem",
                                "@media (max-width: 1024px)": {
                                    fontSize: "1rem",
                                },
                            }}
                        />
                        <div className="text-[0.7rem] text-white">
                            +44 216 313 08 08
                        </div>
                    </div>
                </div>
                <button className="flex ml-auto border-white border px-3 py-1 text-xs shadow-md text-white rounded-full">
                    Get An Offer
                </button>
            </div>
        </div>
    )
}

export default TopBar
