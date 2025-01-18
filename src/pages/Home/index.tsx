import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {  useContext } from "react";

import { HomeContainer, StartCountdownButton, StopCountdownButton} from "./styles";
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";




const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
  .min(1, 'ciclo precisa ser de no mínimo 5 minutos.' )
  .max(60, 'ciclo precisa ser de no máximo 60 minutos.'),
})

type NewCycleFormDate = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const {activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormDate>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;


  const task = watch('task')
  //Auxiliary variable for disable
  const isSubmitDisabled = !task;
 
  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(createNewCycle)}  action="">
          <FormProvider {...newCycleForm}>
            <NewCycleForm /> 
          </FormProvider>
          <Countdown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptCurrentCycle}> 
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