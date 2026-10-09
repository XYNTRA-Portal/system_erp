import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './layouts/LoginPage'
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
