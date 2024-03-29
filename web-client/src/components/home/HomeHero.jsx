import React from 'react';

const HomeHero = () => {
    const index = 22; // or any other index value
    const imageUrl = process.env.PUBLIC_URL + `images/heros/${index}.jpg`;

    return (
        <div className="text-white lg:px-44 h-[450px] lg:h-[500px] flex-row-reverse bg-center relative"
            style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                alt: 'hero image backround white ducting store',
            }}
        >
            <div className="text-start absolute mx-6 sm:mx-24 lg:mx-0 top-[10.5rem] sm:top-[12rem] py-6 sm:py-9 lg:h-[14rem] lg:w-[30rem] overflow-hidden bg-black shadow-2xl shadow-black bg-opacity-[0.85] z-10">
                <div className="flex flex-col justify-center">
                    <h2 className="text-base px-6 sm:px-10 mb-3">
                        It's All About Trust...
                    </h2>
                    <p className="text-sm mb-4 px-6 sm:px-10 sm:text-sm" >
                        We are more than just a supplier of HVAC products. We are your partner in creating comfortable, efficient, and sustainable indoor environments.
                    </p>
                    <div className="grid grid-cols-2 gap-4 px-6 sm:px-10 text-xs sm:text-sm" >
                        <button className="border-secondary border-2 text-white py-2 px-2 shadow-lg shadow-black hover:bg-black rounded-lg">
                            Inspectate Our Products
                        </button>
                        <button className="bg-secondary text-black shadow-black py-2 px-2 shadow-lg hover:bg-white hover:text-black transition-colors duration-500 rounded-lg">
                            Get An Offer
                        </button>
                    </div>
                </div>
            </div>
            <img src={process.env.PUBLIC_URL + `images/heros/5.png`} alt="two engineer are handshaking image" className="h-[320px] lg:h-[350px] absolute bottom-0 right-[5%] md:right-[10%] lg:right-[20%] z-0" />
        </div >
    );
};

export default HomeHero;