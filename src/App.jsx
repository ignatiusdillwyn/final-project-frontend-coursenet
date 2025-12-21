import './styles/App.css'
import { RouterProvider } from 'react-router-dom'
import route from './routers/index'

function App() {
  
  return (
    <>
      <RouterProvider router={route}></RouterProvider>
    </>
  )
}

export default App
