import React, { useEffect, useState } from 'react';
import ListingGrid from "../components/content/ListingGrid";
import TopBanner from "../components/content/TopBanner";
import { useCartStore } from "../stores/CartStore";

const ProductsPage = () => {
    const cartProductIds = useCartStore((state) => state.cartProductIds);
    const loadCartFromLocalStorage = useCartStore((state) => state.loadCartFromLocalStorage);

    useEffect(() => {
        loadCartFromLocalStorage();
        console.log('loaded products:', cartProductIds);
    }, []);

    return (
        <div>
            <TopBanner />
            <div className="w-screen mt-4 px-0 md:px-64 pt-4 pb-10 min-h-96">
                <div className="mx-4">
                    <ListingGrid cartProductIds={cartProductIds} />
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;