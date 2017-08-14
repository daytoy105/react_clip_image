import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from 'containers/edit.js';
import 'assets/css/public.css'
import 'assets/js/flexible.min.js'

const render = (Component) => {
    ReactDOM.render(
        <Component />,
        document.getElementById('app')
    );
}

render(AppContainer)

if(module.hot) {
    module.hot.accept('containers/edit', () => { render(AppContainer) });
}