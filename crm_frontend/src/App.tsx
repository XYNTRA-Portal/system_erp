import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './layouts/LoginPage'
import HomePage from './layouts/HomePage'
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage/>}></Route>
          <Route path='/home' element={<HomePage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
