import { HandPalm, Play } from "phosphor-react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { createContext, useEffect, useState } from "react";
import {differenceInSeconds} from 'date-fns'

import { HomeContainer, StartCountdownButton, StopCountdownButton} from "./styles";
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finishDate?: Date;
}

interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)


  const activeCycle = cycles.find((cycles) => cycles.id === activeCycleId)

  function markCurrentCycleAsFinished() {
      setCycles((state) => state.map((cycle) => {
          if(cycle.id === activeCycleId) {
            return {...cycle, finishDate: new Date()}
          } else {
            return cycle
          }
        }),
      )
  }

  // function handleCreateNewCycle(data: NewCycleFormDate) {
  //   const id = String(new Date().getTime());

  //   const newCycle: Cycle = {
  //     id,
  //     task: data.task,
  //     minutesAmount: data.minutesAmount,
  //     startDate: new Date(),
  //   }

  //   setCycles((state) => [...state, newCycle])
  //   setActiveCycleId(id)
  //   setAmountSecondsPassed(0)

  //   reset()
  // }

  function handleInterrupter() {
    setCycles((state) => state.map((cycle) => {
        if(cycle.id === activeCycleId) {
          return {...cycle, interruptDate: new Date()}
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  // const task = watch('task')
  // Auxiliary variable for disable
  // const isSubmitDisabled = !task;
 
  return (
    <HomeContainer>
      <form /*onSubmit={handleSubmit(handleCreateNewCycle)} */ action="">
        <CyclesContext.Provider value={{activeCycle, activeCycleId, markCurrentCycleAsFinished}}>
          {/* <NewCycleForm /> */}
          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterrupter}> 
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton /*disabled={isSubmitDisabled}*/ type="submit"> 
            <Play size={24} />
            Começar
        </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
    
  )
}