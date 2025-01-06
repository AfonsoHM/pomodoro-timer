import { Play } from "phosphor-react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useState } from "react";

import { 
  CountdownContainer, 
  FormContainer, 
  HomeContainer, 
  MinutesAmountInput, 
  Separator, 
  StartCountdownButton, 
  TaskInput 
} from "./styles";


const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
  .min(5, 'ciclo precisa ser de no mínimo 5 minutos.' )
  .max(60, 'ciclo precisa ser de no máximo 60 minutos.'),
})


type NewCycleFormDate = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormDate>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  function handleCreateNewCycle(data: NewCycleFormDate) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)

    reset()
  }

  const activeCycle = cycles.find((cycles) => cycles.id === activeCycleId)

  console.log(activeCycle)

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
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber:true })}
          />

          <span>minutos.</span>
        </FormContainer>
      

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

         <StartCountdownButton disabled={isSubmitDisabled} type="submit" onClick={handleSubmit(handleCreateNewCycle)}> 
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
    
  )
}