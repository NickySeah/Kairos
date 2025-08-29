import { useCallback, useEffect, useState } from '@lynx-js/react'

import './App.css'
import Calendar from './components/Calendar.js'
import EventModal from './components/EventModal.js'
import Button from './components/Button.js'
import arrow from './assets/arrow.png'
import lynxLogo from './assets/lynx-logo.png'
import reactLynxLogo from './assets/react-logo.png'

export function App() {

  return (
    <view>
      <Calendar />
    </view>
  )
}

export default App;
