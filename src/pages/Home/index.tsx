import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from 'react-hook-form'
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
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
  .min(1, 'ciclo precisa ser de no mínimo 5 minutos.' )
  .max(60, 'ciclo precisa ser de no máximo 60 minutos.'),
})

type NewCycleFormDate = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const newCycleForm = useForm<NewCycleFormDate>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm

  const activeCycle = cycles.find((cycles) => cycles.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

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

  function handleCreateNewCycle(data: NewCycleFormDate) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)

    reset()
  }

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

  const task = watch('task')
  //Auxiliary variable for disable
  const isSubmitDisabled = !task;
 
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}  action="">
        <CyclesContext.Provider value={{activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed}}>
          <FormProvider {...newCycleForm}>
            <NewCycleForm /> 
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterrupter}> 
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit"> 
            <Play size={24} />
            Começar
        </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
    
  )
}