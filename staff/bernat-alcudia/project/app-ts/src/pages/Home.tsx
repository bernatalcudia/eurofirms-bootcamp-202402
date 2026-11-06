import React from 'react';
import Products from '../components/Products';

interface HomeProps {
    searchQuery?: string
}

function Home({ searchQuery = '' }: HomeProps) {
    return <Products searchQuery={searchQuery} />
}

export default Home