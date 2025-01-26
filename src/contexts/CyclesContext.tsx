import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { Cycle, cycleReducer } from "../reducers/cycles/reducer";
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";

interface CreateCycleData {
  task: string;
  minutesAmount: number
}


interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}


export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}


export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

    const [cyclesState, dispatch] = useReducer(cycleReducer,
    {
      cycles: [],
      activeCycleId: null
    }, (initialState) => {
      const storedStateAsJSON = localStorage.getItem('@pomodoro-time:cycles-state-1.0.0')

      if(storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

      return initialState
    });
    
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    useEffect(() => {
      const stateJSON = JSON.stringify(cyclesState)

      localStorage.setItem('@pomodoro-time:cycles-state-1.0.0', stateJSON)
    }, [cyclesState])

    const {cycles, activeCycleId} = cyclesState
    const activeCycle = cycles.find((cycles) => cycles.id === activeCycleId)

    function setSecondsPassed(seconds: number) {
      setAmountSecondsPassed(seconds)
    }
  
    function markCurrentCycleAsFinished() {
      dispatch(markCurrentCycleAsFinishedAction())
        // setCycles((state) => state.map((cycle) => {
        //     if(cycle.id === activeCycleId) {
        //       return {...cycle, finishDate: new Date()}
        //     } else {
        //       return cycle
        //     }
        //   }),
        // )
    }

    function createNewCycle(data: CreateCycleData) {
      const id = String(new Date().getTime());
  
      const newCycle: Cycle = {
        id,
        task: data.task,
        minutesAmount: data.minutesAmount,
        startDate: new Date(),
      }
  
      dispatch(addNewCycleAction(newCycle))
      // setCycles((state) => [...state, newCycle])
      setAmountSecondsPassed(0)
  
    }
  
    function interruptCurrentCycle() {
      // setCycles((state) => state.map((cycle) => {
      //     if(cycle.id === activeCycleId) {
      //       return {...cycle, interruptDate: new Date()}
      //     } else {
      //       return cycle
      //     }
      //   }),
      // )

      dispatch(interruptCurrentCycleAction())

    }

  return (
    <CyclesContext.Provider 
      value={{
        cycles,
        activeCycle, 
        activeCycleId, 
        markCurrentCycleAsFinished, 
        amountSecondsPassed, 
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        }}>
          {children}
      </CyclesContext.Provider>
  )
}