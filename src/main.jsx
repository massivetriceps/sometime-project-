import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 기존 index.css 대신, 통합된 스타일 파일을 불러오세요
import './styles/global.css' 
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
