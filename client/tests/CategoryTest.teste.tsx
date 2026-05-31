import { render, screen } from '@testing-library/react'
import CategoryChart from '@/components/categoryChart'

jest.mock('recharts', () => ({
  Bar: () => null,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
}))
 
jest.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children }: any) => <div>{children}</div>,
}))
 
const dataComLivros = [
  { categoria: 'Romance', quantidade: 5 },
  { categoria: 'Tecnologia', quantidade: 3 },
  { categoria: 'Historia', quantidade: 2 },
  { categoria: 'Ciencias', quantidade: 0 },
  { categoria: 'Infantil', quantidade: 1 },
]
 
const dataVazia = [
  { categoria: 'Romance', quantidade: 0 },
  { categoria: 'Tecnologia', quantidade: 0 },
  { categoria: 'Historia', quantidade: 0 },
  { categoria: 'Ciencias', quantidade: 0 },
  { categoria: 'Infantil', quantidade: 0 },
]
 
test('shows a message if there are not registered books', () => {
  render(<CategoryChart data={dataVazia} />)
  expect(screen.getByText('Nenhum livro cadastrado ainda.')).toBeInTheDocument()
})
 
test('do not show an empty message when there are books', () => {
  render(<CategoryChart data={dataComLivros} />)
  expect(screen.queryByText('Nenhum livro cadastrado ainda.')).not.toBeInTheDocument()
})
 
test('render the chart when there are data', () => {
  render(<CategoryChart data={dataComLivros} />)
  expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
})
 