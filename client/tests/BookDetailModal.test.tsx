import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookDetailModal } from '@/components/BookDetailModal/BookDetailModal'
import * as bookDetailService from '@/services/bookDetailModal'
import { wait } from '@testing-library/user-event/dist/cjs/utils/index.js'

jest.mock('@/services/bookDetailModal')

const mockBook = {
    titulo: 'Orgulho e Preconceito',
    autor: 'Jane Austen',
    isbn: '9788535914849',
    editora: 'Penguin',
    ano: 1913,
    categoria: 'Romance',
    quantidade_total: 7,
    quantidade_disponivel: 5,
    emprestimos: [],
}

const defaultProps = {
  id: '1',
  isOpen: true,
  onClose: jest.fn(),
  onReturnSuccess: jest.fn(),
}

beforeEach(() => {
    jest.clearAllMocks()
    ;(bookDetailService.getBookDetails as jest.Mock).mockResolvedValue(mockBook)
})

test('do not render when the isOpen is false', () => {
  render(<BookDetailModal {...defaultProps} isOpen={false} />)
  expect(screen.queryByText('Detalhes do Livro')).not.toBeInTheDocument()
})

test('shows a loading message when the information is being searched', async() => {
    ;(bookDetailService.getBookDetails as jest.Mock).mockImplementation(
        () => new Promise(() => {})
    )
    render(<BookDetailModal {...defaultProps} />)
    expect(screen.getByText('Carregando informações...')).toBeInTheDocument()
})

test('render the book title after loading', async() => {
    render(<BookDetailModal {...defaultProps} />)
    await waitFor(() => {
        expect(screen.getByText('Orgulho e Preconceito')).toBeInTheDocument()
    })
})

test('render books author after loading', async() => {
    render(<BookDetailModal {...defaultProps} />)
    await waitFor(() => {
        expect(screen.getByText('Jane Austen')).toBeInTheDocument()
    })
})

test('render books category after loading', async() => {
    render(<BookDetailModal {...defaultProps} />)
    await waitFor(() => {
        expect(screen.getByText('Romance')).toBeInTheDocument()
    })
})

test('shows message when there are no loans', async() => {
    render(<BookDetailModal {...defaultProps} />)
    await waitFor(() => {
        expect(screen.getByText('Nenhum empréstimo registrado para este livro.')).toBeInTheDocument()
    })
})

test('trigger onClose when the closing button is clicked', async() => {
    const user = userEvent.setup()
    const onClose = jest.fn()
    render(<BookDetailModal {...defaultProps} onClose={onClose} />)
    await waitFor(() => screen.getByText('×'))
    await user.click(screen.getByText('×'))
    expect(onClose).toHaveBeenCalledTimes(1)
})

test('shows error message when the API fails', async () => {
  ;(bookDetailService.getBookDetails as jest.Mock).mockRejectedValue(
    new Error('Erro'))
  const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})
  render(<BookDetailModal {...defaultProps} />)
  await waitFor(() => {
    expect(alertMock).toHaveBeenCalledWith('Erro ao carregar detalhes do livro.')
  })
  alertMock.mockRestore()
})