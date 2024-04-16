import React, { useState, useEffect } from 'react';
import HomeHero from '../components/home/HomeHero';
import LatestNewsGrid from '../components/home/LatestNewsGrid';
import ListingGrid from '../components/content/ListingGrid';

const productsListUrl = process.env.PUBLIC_URL + '/data/products.json';
const videoUrl = process.env.PUBLIC_URL + '/videos/hero.mp4';

const HomePage = () => {
    const [productsList, setProductsList] = useState([]);

    useEffect(() => {
        // Ürünleri yükle
        fetch(productsListUrl)
            .then(response => response.json())
            .then(data => setProductsList(data))
            .catch(error => console.error('Error loading products:', error));
    }, []);


    return (
        <div className='text-center'>
            <div className='lg:h-screen'>
                <HomeHero imageIndex={22} />
                <div className=''>
                    <LatestNewsGrid />
                </div>
            </div>
            <video autoPlay loop muted className='overflow-hidden flex mx-auto h-[450px] lg:h-[500px] w-full bg-black shadow-lg'>
                <source src={videoUrl} type="video/mp4" />
            </video>
            <div className="text-start text-white pb-12 mx-4 lg:px-64">
                <ListingGrid productsList={productsList} isFeatured={true} />
            </div>
        </div >
    );
};

export default HomePage;