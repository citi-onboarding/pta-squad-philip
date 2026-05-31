import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import userEvent from '@testing-library/user-event'


test('render text passed by prop text', () => {
    render(<Button text="Clique aqui" />)
    expect(screen.getByText('Clique aqui')).toBeInTheDocument()
})

test('render icon when passed by prop icon', () => {
    const Icon = () => <svg data-testid="icone" />
    render(<Button text="Com ícone" icon={<Icon />} />)
    expect(screen.getByTestId('icone')).toBeInTheDocument()
})

test('trigger onClick when clicked', async() => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    render(<Button text="Clique" onClick={onClick} />)
    await user.click(screen.getByText('Clique'))
    expect(onClick).toHaveBeenCalledTimes(1)    
})

test('do not trigger onClick when disabled is True', async() => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    render(<Button text="Desabilitado" onClick={onClick} disabled />)
    await user.click(screen.getByText('Desabilitado'))
    expect(onClick).not.toHaveBeenCalled()
})