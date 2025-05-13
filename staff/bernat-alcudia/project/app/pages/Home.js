import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { errors } from '../com';
import Products from '../components/Products';

const { ContentError } = errors

function Home({ searchQuery }) {

    return <Products searchQuery={searchQuery} stamp={''} />


}

export default Home