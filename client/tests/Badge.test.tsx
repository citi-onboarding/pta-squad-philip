import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/bagde'
import '@testing-library/jest-dom' 

test('render the text "Em Andamento" when you receive the status="Em Andamento"', () => {
  render(<Badge status="Em andamento" />)
  expect(screen.getByText('Em andamento')).toBeInTheDocument()
})

test('render the text "Devolvido" when you receive the status="Devolvido"', () => {
  render(<Badge status="Devolvido" />)
  expect(screen.getByText('Devolvido')).toBeInTheDocument()
})

test('render the text "Atrasado" when you receive the status="Atrasado"', () => {
  render(<Badge status="Atrasado" />)
  expect(screen.getByText('Atrasado')).toBeInTheDocument()
})