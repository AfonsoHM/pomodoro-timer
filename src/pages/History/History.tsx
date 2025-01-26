import { useContext } from "react";
import {formatDistanceToNow} from 'date-fns'
import {ptBR} from 'date-fns/locale/pt-BR'
import { HistoryContainer, HistoryList, Status } from "./styles";
import { CyclesContext } from "../../contexts/CyclesContext";

export function History() {
  const {cycles} = useContext(CyclesContext)

  return (
    <HistoryContainer> 
      <h1>Meu histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <th>Tarefa</th>
            <th>Duração</th>
            <th>Início</th>
            <th>Status</th>
          </thead>

          <tbody>
            {cycles.map((cycle) => (
              <tr key={cycle.id}>
                <td>{cycle.task}</td>
                <td>{cycle.minutesAmount} minutos</td>
                <td>{formatDistanceToNow(new Date(cycle.startDate), {
                  addSuffix: true,
                  locale: ptBR,
                })}</td>
                <td>
                  {cycle.finishDate && 
                    <Status statusColor="green" >Concluído</Status>
                  }
                  {cycle.interruptDate &&
                    <Status statusColor="red" >Interrompido</Status>
                  }
                  {!cycle.interruptDate && !cycle.finishDate &&
                     <Status statusColor="yellow" >Em andamento</Status>
                  }
                </td>
            </tr>
            ))}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}