import React, { useEffect, useState } from 'react';
import ListingGrid from "../components/content/ListingGrid";
import FilterSection from "../components/content/FilterSection";
import { useCategoryStore } from '../stores/CategoryStore';
import TopBanner from "../components/content/TopBanner";
import CategoryCards from "../components/content/CategoryCards";
import CategoryQuickAccesses from "../components/content/CategoryQuickAccesses";

const ProductsPage = () => {
    // states
    const [productsList, setProductsList] = useState([]);
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    // stores
    const selectedCategories = useCategoryStore((state) => state.selectedCategories);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/products.json')
            .then(response => response.json())
            .then(data => setProductsList(data))
            .catch(error => console.error('Error loading products:', error));

        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollToTop(true);
            } else {
                setShowScrollToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredProductsList = productsList

    return (
        <div>
            <div className="h-12 md:h-24" />
            <CategoryCards />
            <div
                className="w-screen mt-4 px-0 md:px-64 pt-4 pb-10 min-h-96"
            >
                <div className="mx-4">
                    <ListingGrid productsList={filteredProductsList} />
                </div>
            </div>
            {showScrollToTop && (
                <button
                    className="fixed bottom-20 md:bottom-8 right-6 md:right-64 p-2 bg-secondary text-white
                     text-xs shadow-lg hover:bg-black hover:scale-125 transition-all duration-1000 focus:outline-none z-30"
                    onClick={handleScrollToTop}
                >
                    Scroll to Top
                </button>
            )}
        </div>
    );
};

export default ProductsPage;
