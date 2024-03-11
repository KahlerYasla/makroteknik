import React from 'react';

const LatestNewsGrid = () => {
    const index = 44; // pattern index
    const imageUrl = process.env.PUBLIC_URL + `/patterns/${index}.png`;

    return (
        <div className="text-primary pb-14 px-6 lg:px-44 bg-orange-200 border-t-2 border-primary"
            style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: '7px',
                backgroundPosition: 'center',
                backgroundRepeat: 'repeat',
            }}
        >
            <div className='flex flex-row justify-between items-center py-8' >
                <p className="text-sm lg:text-lg font-bold text-primary text-center py-1 backdrop-blur-sm">Latest Feeds:</p>
                <button className="text-sm backdrop-blur-sm text-primary py-2 px-4 rounded-lg shadow-lg transition-colors duration-500 hover:bg-orange-600 hover:text-black border-2 border-primary">
                    List All Feeds
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-[0.7rem] sm:text-sm" style={{ color: '#f2f2f2' }} >
                <div className="bg-black bg-opacity-80 p-4 shadow-lg border-l-4 border-orange-600 ">
                    <h3 className="text-sm font-bold mb-2">Headline lorem ipsum dolor sit amet...</h3>
                    <hr className="border-[0.1px] border-white border-opacity-30 mb-2" />
                    <p className="">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                    </p>
                </div>
                <div className="bg-black bg-opacity-80 p-4 shadow-lg border-l-4 border-orange-600 ">
                    <h3 className="text-sm font-bold mb-2">Headline lorem ipsum dolor sit amet...</h3>
                    <hr className="border-[0.1px] border-white border-opacity-30 mb-2" />
                    <p className="">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                    </p>
                </div>
                <div className="bg-black bg-opacity-80 p-4 shadow-lg border-l-4 border-orange-600 ">
                    <h3 className="text-sm font-bold mb-2">Headline lorem ipsum dolor sit amet...</h3>
                    <hr className="border-[0.1px] border-white border-opacity-30 mb-2" />
                    <p className="">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                    </p>
                </div>
            </div >
        </div>
    );
};

export default LatestNewsGrid;