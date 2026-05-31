import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookFilters from '@/components/bookFilters'


const defaultProps = {
    search: '',
    category: '',
    onSearchChange: jest.fn(),
    onCategoryChange: jest.fn(),
}

beforeEach(() => jest.clearAllMocks())

test('render the search input', () => {
    render(<BookFilters {...defaultProps} />)
    expect(screen.getByPlaceholderText('Buscar por título ou autor...')).toBeInTheDocument()
})

test('trigger onSearchChange when user types in input', async() => {
    const user = userEvent.setup()
    const onSearchChange = jest.fn()
    render(<BookFilters {...defaultProps} onSearchChange={onSearchChange} />)
    await user.type(screen.getByPlaceholderText('Buscar por título ou autor...'), 'Harry')
    expect(onSearchChange).toHaveBeenCalled()
})

test('trigger onCategoryChange when a category is selected', async() => {
    const user = userEvent.setup()
    const onCategoryChange = jest.fn()
    render(<BookFilters {...defaultProps} onCategoryChange={onCategoryChange} />)
    const selects = screen.getAllByRole('combobox')
    await user.selectOptions(selects[0], 'Romance')
    expect(onCategoryChange).toHaveBeenCalled()
})

test('shows the category options correctly', () => {
    render(<BookFilters {...defaultProps} />)
    const selects = screen.getAllByRole('combobox')
    const options = Array.from(selects[0].querySelectorAll('option')).map(
        (o) => o.textContent
    )
    expect(options).toEqual(['Todas', 'Romance', 'Tecnologia', 'História', 'Ciências', 'Infantil'])
})

test('displays the current search value in the input.', () => {
  render(<BookFilters {...defaultProps} search="Orgulho e Preconceito" />)
  expect(screen.getByDisplayValue('Orgulho e Preconceito')).toBeInTheDocument()
})