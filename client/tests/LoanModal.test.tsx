import { render, screen } from '@testing-library/react'
import { LoanModal } from '@/components/loanModal'
import userEvent from '@testing-library/user-event'

const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    bookTitle: 'Orgulho e Preconceito',
    apiError: null,
    onConfirm: jest.fn(),
}

test('do not render when open is false', () => {
    render(<LoanModal {...defaultProps} open={false} />)
    expect(screen.queryByText('Realizar empréstimo')).not.toBeInTheDocument()
})

test('render the book title when open is true', () => {
    render(<LoanModal {...defaultProps} open={true} />)
    expect(screen.getByText('Orgulho e Preconceito')).toBeInTheDocument()
})

test('shows validation error when try to submit blank places', async () => {
    const user = userEvent.setup()
    render(<LoanModal {...defaultProps} />)
    await user.click(screen.getByText('Confirmar Empréstimo'))
    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('Email é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('Data de locação é obrigatória')).toBeInTheDocument()
    expect(screen.getByText('Data de devolução é obrigatória')).toBeInTheDocument()
})

test('shows error when an invalid email is typed', async () => {
    const user = userEvent.setup()
    render(<LoanModal {...defaultProps} />)
    await user.type(screen.getByPlaceholderText('Digite o email do cliente'), 'emailinvalido') // deveria estar em inglês? 'emailinvalido'
    await user.click(screen.getByText('Confirmar Empréstimo'))
    expect(screen.getByText('Email inválido')).toBeInTheDocument()
})

test('shows error when the devolution date is earlier than the rental date', async () => {
  const user = userEvent.setup()
  render(<LoanModal {...defaultProps} />)
  const dateInputs = screen.getAllByDisplayValue('')
  await user.type(dateInputs[2], '2026-05-30') 
  await user.type(dateInputs[3], '2026-05-20') 
  await user.click(screen.getByText('Confirmar Empréstimo'))
  expect(screen.getByText('Data de devolução não pode ser anterior à de locação')).toBeInTheDocument()
})


test('triggers onOpenChange(false) when "Cancelar" is clicked', async () => {
  const user = userEvent.setup()
  const onOpenChange = jest.fn()
  render(<LoanModal {...defaultProps} onOpenChange={onOpenChange} />)
  await user.click(screen.getByText('Cancelar'))
  expect(onOpenChange).toHaveBeenCalledWith(false)
})