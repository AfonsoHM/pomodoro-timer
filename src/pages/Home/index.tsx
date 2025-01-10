import { HandPalm, Play } from "phosphor-react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useEffect, useState } from "react";
import {differenceInSeconds} from 'date-fns'

import { 
  CountdownContainer, 
  FormContainer, 
  HomeContainer, 
  MinutesAmountInput, 
  Separator, 
  StartCountdownButton, 
  StopCountdownButton, 
  TaskInput 
} from "./styles";


const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
  .min(1, 'ciclo precisa ser de no mínimo 5 minutos.' )
  .max(60, 'ciclo precisa ser de no máximo 60 minutos.'),
})


type NewCycleFormDate = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptDate?: Date;
  finishDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormDate>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  const activeCycle = cycles.find((cycles) => cycles.id === activeCycleId)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    let interval: number

    if(activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)


        if(secondsDifference >= totalSeconds) {
          setCycles((state) => state.map((cycle) => {
              if(cycle.id === activeCycleId) {
                return {...cycle, finishDate: new Date()}
              } else {
                return cycle
              }
            }),
          )
          setAmountSecondsPassed(totalSeconds)

          clearInterval(interval)

        } else {
          setAmountSecondsPassed( secondsDifference )
        }

      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }

  }, [activeCycle, totalSeconds, activeCycle])

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


  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, '0');
  const seconds = String(secondsAmount).padStart(2, '0');

  useEffect(() => {
    if(activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  },[minutes, seconds, activeCycle])


  const task = watch('task')
  // Auxiliary variable for disable
  const isSubmitDisabled = !task;
 
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput 
            id="task" 
            type="text" 
            list="task-suggestion"
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycle}
            {...register('task')}
          />

          <datalist id="task-suggestion">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput 
            id="minutesAmount" 
            type="number" 
            placeholder="00" 
            disabled={!!activeCycle}
            step={5}
            min={1}
            max={60}
            {...register('minutesAmount', { valueAsNumber:true })}
          />

          <span>minutos.</span>
        </FormContainer>
      

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterrupter}> 
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit" onClick={handleSubmit(handleCreateNewCycle)}> 
            <Play size={24} />
            Começar
        </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
    
  )
}