import { render, screen } from '@testing-library/react'
import { BookCard } from '@/components/bookCard'
import userEvent from '@testing-library/user-event'


const defaultProps = {
    title: 'Orgulho e Preconceito',
    author: 'Jane Austen',
    category: 'Romance',
    availableQuantity: 5
}

test('render book title', () => {
  render(<BookCard {...defaultProps} />)
  expect(screen.getByText('Orgulho e Preconceito')).toBeInTheDocument()
})

test('render book author', () => {
  render(<BookCard {...defaultProps} />)
  expect(screen.getByText('Jane Austen')).toBeInTheDocument()
})

test('render book category', () => {
  render(<BookCard {...defaultProps} />)
  expect(screen.getByText('Romance')).toBeInTheDocument()
})

test('render available quantity of the book', () => {
  render(<BookCard {...defaultProps} />)
  expect(screen.getByText((content, element) =>
    element?.textContent === 'Disponível: 5 unidade(s)'
  )).toBeInTheDocument()
})

test('shows "Sem imagem" if there is no imageUrl', () => {
  render(<BookCard {...defaultProps} />)
  expect(screen.getByText('Sem imagem')).toBeInTheDocument()
})

test('trigger onView when "Ver" is clicked', async () => {
  const user = userEvent.setup()
  const onView = jest.fn()
  render(<BookCard {...defaultProps} onView={onView}/>)
  await user.click(screen.getByText('Ver'))
  expect(onView).toHaveBeenCalledTimes(1)
})

test('trigger onBorrow when "Emprestar" is clicked', async () => {
  const user = userEvent.setup()
  const onBorrow = jest.fn()
  render(<BookCard {...defaultProps} onBorrow={onBorrow}/>)
  await user.click(screen.getByText('Emprestar'))
  expect(onBorrow).toHaveBeenCalledTimes(1)
})

test('trigger some awesome feature when clicking the button', async () => {
  const user = userEvent.setup()
  const onDelete = jest.fn()
  render(<BookCard {...defaultProps} onDelete={onDelete}/>)
  await user.click(screen.getByRole('button', { name: 'Excluir livro' }))
  expect(onDelete).toHaveBeenCalledTimes(1)
})