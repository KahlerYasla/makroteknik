import React, { useEffect, useState, useRef } from 'react';
import { Home, Groups, PrecisionManufacturing, ShoppingCart, FilterAlt } from '@mui/icons-material';
import { Link } from "react-router-dom";
import { useCategoryStore } from '../../stores/CategoryStore';
import { useCartStore } from '../../stores/CartStore';

const NavBar = () => {
    // states
    const [categories, setCategories] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    // stores
    const resetCategories = useCategoryStore((state) => state.resetCategories);
    const addCategories = useCategoryStore((state) => state.addCategories);
    const cartProducts = useCartStore((state) => state.cartProducts);

    // refs
    const previouscartProductsLength = useRef(cartProducts.length);

    useEffect(() => {
        fetch('/data/categories.json')
            .then((response) => response.json())
            .then((data) => setCategories(data))
    }, []);

    useEffect(() => {
        if (cartProducts.length > previouscartProductsLength.current) {
            setDialogMessage('Added to cart');
        }
        else if (cartProducts.length < previouscartProductsLength.current) {
            console.log(cartProducts.length, previouscartProductsLength.current)
            setDialogMessage('Removed from cart');
        }
        else {
            return;
        }
        previouscartProductsLength.current = cartProducts.length;
        setShowDialog(true);
        const timer = setTimeout(() => setShowDialog(false), 2000);
        return () => clearTimeout(timer);
    }, [cartProducts]);

    return (
        <nav className="bg-white md:bg-white md:bg-opacity-100 flex h-14 lg:mb-4 py-4 pt-4 lg:py-0 px-6 lg:px-64 flex-row items-center 
        justify-center md:justify-between w-full fixed bottom-0 sm:top-[40px] z-40 text-center md:border-b border-t md:border-t-0">
            <div className="hidden md:flex items-center justify-center md:mx-0 text-secondary">
                <a href="https://www.makroteknik.com.tr" target="_blank" rel="noreferrer">
                    <img src={process.env.PUBLIC_URL + '/logo.svg'} className="mt-1 h-[45px]" alt="logo" />
                </a>
            </div>
            <div className="w-full flex text-secondary">
                <ul className="flex w-full justify-evenly md:justify-end md:space-x-6">
                    <li>
                        <Link
                            to=""
                            className="flex-row items-center text-black hover:text-secondary"
                            onClick={() => resetCategories()}
                        >
                            <Home
                                className='text-secondary'
                                sx={{ fontSize: '1.3rem', '@media (max-width: 1024px)': { fontSize: '1.2rem' } }}
                            />
                            <p
                                className='text-[0.7rem]'
                            >
                                Home
                            </p>
                        </Link>
                    </li>
                    <li >
                        <Link
                            to="/about"
                            className="flex-row items-center text-black hover:text-secondary"
                            onClick={() => resetCategories()}
                        >
                            <Groups
                                className='text-secondary'
                                sx={{ fontSize: '1.3rem', '@media (max-width: 1024px)': { fontSize: '1.2rem' } }}
                            />
                            <p
                                className='text-[0.7rem]'
                            >
                                About
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/products"
                            className="flex-row items-center text-black hover:text-secondary"
                            onClick={() => {
                                categories.map((category) => addCategories(category.categoryId));
                                // scroll to top
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                            }
                        >
                            <PrecisionManufacturing
                                className='text-secondary'
                                sx={{ fontSize: '1.3rem', '@media (max-width: 1024px)': { fontSize: '1.2rem' } }}
                            />
                            <p
                                className='text-[0.7rem]'
                            >
                                Products
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/cart"
                            className="flex-row items-center text-black hover:text-secondary"
                            onClick={() => resetCategories()}
                        >
                            <div className="relative z-50">
                                {Object.keys(cartProducts).length > 0 &&
                                    <div className="absolute -top-[3px] -right-[3px] rounded-full
                                    text-white text-[0.65rem] flex items-center justify-center">
                                        <span class="relative flex h-4 w-4">
                                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75">
                                            </span>
                                            <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                                        </span>
                                        <span className="absolute text-xs">
                                            {Object.keys(cartProducts).length}
                                        </span>
                                    </div>
                                }
                                {showDialog && (
                                    <div className="absolute bottom-3 md:top-10 -right-6 bg-black text-white bg-opacity-70 h-fit text-xl p-2 z-50">
                                        {dialogMessage}
                                    </div>
                                )}
                            </div>
                            <ShoppingCart
                                className='text-secondary relative'
                                sx={{ fontSize: '1.3rem', '@media (max-width: 1024px)': { fontSize: '1.2rem' } }}
                            />
                            <p className='text-[0.7rem]'>
                                Cart
                            </p>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav >
    );
};

export default NavBar;
