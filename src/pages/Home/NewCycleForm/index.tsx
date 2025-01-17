import {  useFormContext } from "react-hook-form";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { useContext } from "react";
import { CyclesContext } from "..";


export function NewCycleForm() {
  const {activeCycle} = useContext(CyclesContext)
  const {register} = useFormContext()

  return (
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
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber:true })}
          />

        <span>minutos.</span>
    </FormContainer>
  )
}