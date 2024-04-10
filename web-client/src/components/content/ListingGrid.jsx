import React, { useState, useEffect } from 'react';
import { ShoppingCart } from '@mui/icons-material';

const categoriesListUrl = process.env.PUBLIC_URL + '/data/categories.json';

const ListingGrid = ({ productsList, isFeatured }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Kategorileri yükle
        fetch(categoriesListUrl)
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error loading categories:', error));
    }, []);

    if (!isFeatured) {
        return (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {categories.map(category => {
                    const categoryProducts = productsList.filter(product => product.categoryId === category.categoryId);
                    const shouldHide = categoryProducts.length === 0;

                    return (
                        <React.Fragment key={category.categoryName}>
                            {!shouldHide && (
                                <h1 className="text-start bg-opacity-100 bg-white border-b-2 border-secondary font-bold text-secondary mt-2 my-4 lg:mt-0 col-span-full pl-2">
                                    {category.categoryName}
                                </h1>
                            )}
                            {categoryProducts.map(product => (
                                <div key={product.code} className="bg-white flex flex-col text-sm hover:scale-105 hover:-translate-y-5 hover:bg-blue-100 duration-500 h-90 shadow-lg">
                                    <img src={process.env.PUBLIC_URL + product.imageUrl} alt={product.title} className="w-full h-36 object-contain" />
                                    <div className="p-4">
                                        <h2 className="text-sm mb-2 text-black font-bold">{product.title}</h2>
                                        <p className="text-gray-500 mb-2">{product.code}</p>
                                        <p className="text-gray-500 text-sm line-clamp-3">{product.description}</p>
                                        <div className="flex justify-between sm:mt-auto items-center align-bottom gap-4">
                                            <button className="text-black p-1 mt-4 w-full text-sm">
                                                <ShoppingCart className="mr-2" sx={{ fontSize: '0.9rem' }} />
                                                Add to cart
                                            </button>
                                            <button className="text-black p-1 mt-4 w-full text-sm underline">View details</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }
    else {
        const featuredProducts = productsList.filter(product => product.isFeatured);

        return (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {featuredProducts.map(product => (
                    <div key={product.code} className="bg-white flex flex-col text-sm hover:scale-105 hover:-translate-y-5 hover:bg-blue-100 duration-500 h-90 border-b-4 border-secondary">
                        <img src={process.env.PUBLIC_URL + product.imageUrl} alt={product.title} className="w-full h-36 object-contain" />
                        <div className="p-4">
                            <h2 className="text-sm mb-2 text-gray-600">{product.title}</h2>
                            <p className="text-gray-400 mb-2">{product.code}</p>
                            <p className="text-gray-400 text-sm line-clamp-3">{product.description}</p>
                            <div className="flex justify-between sm:mt-auto items-center align-bottom gap-4">
                                <button className="text-black border p-2 mt-4 w-full text-sm">
                                    <ShoppingCart className="mr-2" sx={{ fontSize: '0.9rem' }} />
                                    Add to cart
                                </button>
                                <button className="text-black border p-2 mt-4 w-full text-sm">View details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
};

export default ListingGrid;
