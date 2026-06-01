import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoanHistoryCard } from '@/components/BookDetailModal/LoanHistoryCard'

const defaultProps = {
  id: '1',
  nomeCliente: 'Fábio Ferreira',
  emailCliente: 'fabio@email.com',
  dataLocacao: '2026-05-01T00:00:00.000Z',
  dataPrevistaDevolucao: '2026-05-15T00:00:00.000Z',
  status: 'Em_andamento' as const,
  onEnviarLembrete: jest.fn(),
  onDevolver: jest.fn(),
  lembreteLoading: false,
  devolucaoLoading: false,
}

beforeEach(() => jest.clearAllMocks())

test('render the client name', () => {
  render(<LoanHistoryCard {...defaultProps} />)
  expect(screen.getByText('Fábio Ferreira')).toBeInTheDocument()
})

test('render the client email', () => {
  render(<LoanHistoryCard {...defaultProps} />)
  expect(screen.getByText('fabio@email.com')).toBeInTheDocument()
})

test('render the status badge "Em andamento"', () => {
  render(<LoanHistoryCard {...defaultProps} />)
  expect(screen.getByText('Em andamento')).toBeInTheDocument()
})

test('render the status badge "Atrasado"', () => {
  render(<LoanHistoryCard {...defaultProps} status="Atrasado" />)
  expect(screen.getByText('Atrasado')).toBeInTheDocument()
})

test('render the status badge "Devolvido"', () => {
  render(<LoanHistoryCard {...defaultProps} status="Devolvido" />)
  expect(screen.getByText('Devolvido')).toBeInTheDocument()
})

test('shows "Marcar como Devolvido" button when the status is Em_andamento', () => {
  render(<LoanHistoryCard {...defaultProps} />)
  expect(screen.getByText('Marcar como Devolvido')).toBeInTheDocument()
})

test('do not show "Enviar lembrete" button when the status is "Em andamento"', () => {
  render(<LoanHistoryCard {...defaultProps} />)
  expect(screen.queryByText('Enviar Lembrete')).not.toBeInTheDocument()
})

test('do not show action buttons when the status is "Devolvido"', () => {
  render(<LoanHistoryCard {...defaultProps} status='Devolvido'/>)
  expect(screen.queryByText('Marcar como Devolvido')).not.toBeInTheDocument()
  expect(screen.queryByText('Enviar Lembrete')).not.toBeInTheDocument()
})

test('trigger onDevolver when "Marcar como Devolvido" is clicked', async() => {
    const user = userEvent.setup()
    const onDevolver = jest.fn()
    render(<LoanHistoryCard {...defaultProps} onDevolver={onDevolver} />)
    await user.click(screen.getByText('Marcar como Devolvido'))
    expect(onDevolver).toHaveBeenCalledWith('1')
})

test('trigger onEnviarLembrete when "Enviar lembrete" is clicked', async() => {
    const user = userEvent.setup()
    const onEnviarLembrete = jest.fn()
    render(<LoanHistoryCard {...defaultProps} status='Atrasado' onEnviarLembrete={onEnviarLembrete} />)
    await user.click(screen.getByText('Enviar Lembrete'))
    expect(onEnviarLembrete).toHaveBeenCalledWith('1')
})

test('shows "Enviando..." when lembreteLoading is true', () => {
  render(<LoanHistoryCard {...defaultProps} status="Atrasado" lembreteLoading={true} />)
  expect(screen.getByText('Enviando...')).toBeInTheDocument()
})
 
test('shows "Processando..." when devolucaoLoading is true', () => {
  render(<LoanHistoryCard {...defaultProps} devolucaoLoading={true} />)
  expect(screen.getByText('Processando...')).toBeInTheDocument()
})