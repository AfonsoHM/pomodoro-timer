import { HistoryContainer, HistoryList } from "./styles";

export function History() {
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
            <tr>
              <td>Tarefa</td>
              <td>20 minutes</td>
              <td>Há dois meses</td>
              <td>Concluido</td>
            </tr>

            <tr>
              <td>Tarefa</td>
              <td>20 minutes</td>
              <td>Há dois meses</td>
              <td>Concluido</td>
            </tr>

            <tr>
              <td>Tarefa</td>
              <td>20 minutes</td>
              <td>Há dois meses</td>
              <td>Concluido</td>
            </tr>
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}