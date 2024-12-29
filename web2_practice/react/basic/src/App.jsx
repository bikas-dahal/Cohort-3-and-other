import {useState, useEffect, useRef, createContext, useContext} from 'react'
import './App.css'
import Navbar from "./components/Navbar.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useCounter } from './hooks/useCounter.js'
import {useFetch, useTodoFetch} from "./hooks/useFetch.js";
import {usePrev} from "./hooks/usePrev.js";
import {useDebounce} from "./hooks/useDebounce.js";
import {RecoilRoot, useRecoilValue, useSetRecoilState} from "recoil";
import {counterAtom, evenSelector} from "./store/atoms/counter.js";
import Otp from "./components/Otp.jsx";

const BulbContext = createContext();

const BulbProvider = ({ children }) => {
    const [bulbOn, setBulbOn] = useState(false);
    return (
        <BulbContext.Provider value={{
            bulbOn,
            setBulbOn
        }}>
            {children}
        </BulbContext.Provider>
    )
}

function App() {
  // const [count, setCount] = useState(0)
  //
  // const increaseCount = () => {
  //   setCount((prevCount) => prevCount + 1)
  // }
  //
  //
  // useEffect(() => {
  //   const interval = setInterval(increaseCount, 1000)
  //
  //   return () => clearInterval(interval)
  // }, []);


  return (
    // <BulbProvider>
      <RecoilRoot>
      <Router>
        <Navbar />
          <Routes>
              <Route path="/" element={App} />
              <Route path={'/check'} element={
                  <Check />
              } />
              <Route path={'/timer'} element={<Timer />} />
          </Routes>
      </Router>
      </RecoilRoot>
    /*</BulbProvider>*/
  )
}

const Timer = () => {
    const [currentCount, setCurrentCount] = useState(0)
    const timerRef = useRef()

    const onStart = () => {
        let value = setInterval( () => setCurrentCount(currentCount => currentCount + 1 ), 1000)
        timerRef.current = value
    }

    const onStop = () => {
        clearInterval(timerRef.current)
    }


    return (
        <div className={'mx-20'}>
            <span className={'bg-pink-200 text-3xl p-2 ml-16 m-2 rounded-xl'}>{currentCount} </span>
            <br/>
            <div className={'flex gap-x-5 m-3 text-xl '}>
                <button className={'border p-2 bg-blue-400 rounded-md'} onClick={onStart}>Start</button>
                <button className={'border px-2 bg-red-400 rounded-md'} onClick={onStop}>Stop</button>

            </div>
        </div>

    )
}

const Check = () => {

    const inputRef = useRef()
    // const [bulbOn, setBulbOn] = useState(false)

    const focusOnInput = () => {
        inputRef.current.focus()
    }

    const { count, increaseCount } = useCounter();
    const prev = usePrev(count)
    const {title} = useTodoFetch()
    const {data, loading} = useFetch('https://jsonplaceholder.typicode.com/todos/1')
    // console.log(todo)

    // recoil part



    function sendDataToBackend() {
        console.log('Backend request sent')
    }

    const debouncedFn = useDebounce(sendDataToBackend, 1000)

    return <>

        <div className={'flex gap-2 p-3'}>
            <div className={' bg-gray-50 p-2 m-2 rounded-xl'}>
                {/*<BulbContext.Provider value={{*/}
                {/*    bulbOn,*/}
                {/*    setBulbOn*/}
                {/*}}>*/}
                <BulbProvider>
                    <BulbState/>
                    <ToggleBulbState/>
                </BulbProvider>
                {/*</BulbContext.Provider>*/}
            </div>
            <input onChange={debouncedFn} ref={inputRef}/>
            <input/>
            <button onClick={focusOnInput} className={'bg-blue-400 rounded-md p-2'}>Check</button>


        </div>
        Otp like component
        <Otp />
        <div className={'flex border-2 border-pink-400 p-2 rounded-md bg-gray-300 flex-col gap-x-5 m-3 text-xl '}>
            Using Recoil for state management
            <div className={'flex justify-evenly'}>
                Using Recoil
                <CurrentCount />
                <div className={'border-2 p-2 rounded-xl'}>
                    <IncreaseCount />
                </div>
                <div className={'border-2 p-2 rounded-xl'}>
                    <DecreaseCount />
                </div>
                <IsEven />
            </div>
        </div>
        <span className={'m-2 p-2 bg-pink-200 rounded-xl'}> hi {count}</span>
        <span>Previous count with usePrev hook is {prev}</span>
        <button className={'bg-gray-500 m-3 p-2 rounded-md'} onClick={increaseCount}>Increase count</button>
        fetched todo title <span className={'highlight p-1 bg-blue-100 rounded-md'}> {title}</span>
        <div>
            from useFetch hook { loading ? 'Loading' : data.title}

        </div>
    </>
}

const CurrentCount = () => {

    const count = useRecoilValue(counterAtom)

    return (
        <div>
            Count: {count}
        </div>
    )
}

const IncreaseCount = () => {

    const setCount = useSetRecoilState(counterAtom)

    const increase = () => {
        setCount(count =>count + 2)
    }

    return (
        <button onClick={increase}>
            increase count
        </button>
    )
}

const DecreaseCount = () => {

    const setCount = useSetRecoilState(counterAtom)

    const decrease = () => {
        setCount(count =>count - 1)
    }

    return (
        <button onClick={decrease}>
            Decrease count
        </button>
    )
}

const IsEven = () => {

    const value = useRecoilValue(evenSelector)

    return (
        <div className={'text-red-700'}>
            <span className={'text-xl text-purple-600 bg-gray-300 m-2 p-1 rounded-md'}>This one using recoil selector.</span>
            {value ? 'Even' : "Odd"}
        </div>
    )
}

const BulbState = () => {
    const {bulbOn} = useContext(BulbContext)
    return (
        <div>
            {bulbOn ? 'Bulb on' : 'Bulb off'}
        </div>
    )
}

const ToggleBulbState = () => {

    const { setBulbOn } = useContext(BulbContext)

    const onChange = () => (
        setBulbOn(prevState => !prevState)
    )


    return (
        <div>
            <button className={'bg-blue-100 rounded-md p-2'} onClick={onChange}>Toggle light state</button>
        </div>
    )
}

export default App
