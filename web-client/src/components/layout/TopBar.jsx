import React from 'react';
import { Call, Mail } from '@mui/icons-material';

const TopBar = () => {
    return (
        <div className="bg-primary py-2 px-4 lg:px-44 top-0 text-white text-sx w-full fixed z-50">
            <div className="container mx-auto flex flex-row justify-between items-center">
                <div className="flex flex-col lg:flex-row gap-2 lg:gap-6 items-center text-xs">
                    <div className="flex flex-row gap-2 items-center">
                        <Mail sx={{ fontSize: '1.5rem', '@media (max-width: 1024px)': { fontSize: '1rem' } }} />
                        <div className="">info@makroteknik.com.uk</div>
                    </div >
                    <div className="flex flex-row gap-2 items-center">
                        <Call sx={{ fontSize: '1.5rem', '@media (max-width: 1024px)': { fontSize: '1rem' } }} />
                        <div className="">+44 216 313 08 08</div>
                    </div>
                </div>
                <button className="border-2 border-secondary rounded-md p-2 text-xs shadow-lg shadow-black">Get An Offer</button>
            </div>
        </div>
    );
};

export default TopBar;