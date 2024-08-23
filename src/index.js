import React from 'react'
import ReactDOM from 'react-dom/client'
import AppUsingContextApi from './AppUsingContextApi'
import {MovieContextApi} from './MovieContextApi'

const root = ReactDOM.createRoot(document.getElementById('root'))


root.render(<>
<MovieContextApi>
    <AppUsingContextApi/>
</MovieContextApi>
    </>
)