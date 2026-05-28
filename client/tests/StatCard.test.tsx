import { render, screen } from '@testing-library/react'
import { StatCard } from '@/components/statCard'
import { BookOpen, Clock, AlertTriangle } from 'lucide-react'

test('render the "Total de Livros" label and the value', () => {
  render(<StatCard typeCard="Total de Livros" icon={BookOpen} value={42} />)
  expect(screen.getAllByText('Total de Livros').length).toBeGreaterThan(0)
  expect(screen.getByText('42')).toBeInTheDocument()
})
 
test('render the "Empréstimos Ativos" label and the value', () => {
  render(<StatCard typeCard="Empréstimos Ativos" icon={Clock} value={10} />)
  expect(screen.getAllByText('Empréstimos Ativos').length).toBeGreaterThan(0)
  expect(screen.getByText('10')).toBeInTheDocument()
})
 
test('render the "Livros Atrasados" label and the value', () => {
  render(<StatCard typeCard="Livros Atrasados" icon={AlertTriangle} value={5} />)
  expect(screen.getAllByText('Livros Atrasados').length).toBeGreaterThan(0)
  expect(screen.getByText('5')).toBeInTheDocument()
})
 
test('render the value passed as string', () => {
  render(<StatCard typeCard="Total de Livros" icon={BookOpen} value="100" />)
  expect(screen.getByText('100')).toBeInTheDocument()
})