import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MemberBioMarquee from './assets/MemberBio'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MemberBioMarquee/>
    </>
  )
}

export default App