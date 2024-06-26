import React, { useState, useEffect } from 'react';
import { ShoppingCart, Close } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

const DetailedProductModal = ({ isModalOpen, selectedProduct, setIsModalOpen, addProducts }) => {

    return (
        <div
            className={`fixed top-0 left-0 w-screen h-screen bg-black backdrop-blur-sm bg-opacity-80 z-50
                flex justify-center items-center
                 ${isModalOpen ? '' : 'transition-opacity duration-[1.6s] opacity-0 pointer-events-none'
                }`}
            onClick={() => {
                // close modal
                console.log('close modal');
                setIsModalOpen(false);
            }}
        >
            {isModalOpen && (
                <div
                    className="relative bg-white md:w-4/6 h-[85%] md:h-fit mt-16 md:mt-0 md:max-h-none p-4 m-4 md:m-0 rounded-md shadow-lg overflow-y-scroll"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="md:absolute fixed right-10 top-[15%] md:top-4 flex rounded-full bg-slate-50 bg-opacity-50">
                        <h2 className="text-2xl text-black font-bold mb-2 mt-2 ml-auto"></h2>
                        <IconButton
                            className="absolute ml-auto text-black bg-red-500"
                            onClick={() => {
                                setIsModalOpen(false);
                            }}
                        >
                            <Close />
                        </IconButton>
                    </div>
                    <div className="flex flex-col md:flex-row items-center h-full">
                        <img
                            src={process.env.PUBLIC_URL + selectedProduct.imageUrl}
                            alt={selectedProduct.title}
                            className="md:w-1/2 object-cover rounded-md mr-0 mb-4 md:my-0 shadow-lg"
                        />
                        {renderProductDetails()}
                    </div>
                </div>
            )}
        </div>
    );

    function renderProductDetails() {
        return <div className="flex flex-col md:w-1/2 justify-between h-full md:ml-8 md:mr-4 pb-6">
            <h2 className="text-2xl text-black font-bold mb-2">{selectedProduct.title}</h2>
            <p className="text-sm text-gray-500 mb-1">{selectedProduct.code}</p>
            <p className="text-sm text-gray-500 mb-4">{selectedProduct.description}</p>
            <div className="font-extrabold text-xl mb-4 text-black">£ 33.00</div>
            <button
                className="bg-black text-white font-bold px-4 py-2 rounded-md w-full shadow-lg"
                onClick={() => {
                    addProducts(selectedProduct.productId);
                    console.log('added product:', selectedProduct.productId);
                }}
            >
                <ShoppingCart className="text-white mr-2" sx={{ fontSize: '1rem' }} />
                Add to Cart
            </button>
        </div>;
    }
};

export default DetailedProductModal;
