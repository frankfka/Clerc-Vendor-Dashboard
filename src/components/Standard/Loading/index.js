import React from 'react';
import Spinner from 'react-spinkit'

const Loading = ({doFadeIn}) => (
    <Spinner color="#00796B" fadeIn={doFadeIn ? 'full' : 'none'}/>
);

export default Loading;