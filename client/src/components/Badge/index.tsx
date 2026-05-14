type StatusType = 'Em andamento' | 'Devolvido' | 'Atrasado'

interface BadgeProps {
    status: StatusType
}

const statusStyles = {
    'Em andamento': 'bg-yellow-100 border-yellow-200 text-yellow-700',
    'Devolvido': 'bg-green-100 border-green-200 text-green-700',
    'Atrasado': 'bg-red-100 border-red-200 text-red-700'
}

export function Badge({status}: BadgeProps){
    return (
        <div className={`px-2 py-1 rounded-2xl border-solid border-2 ${statusStyles[status]}`}>
            {status}
        </div>
    )
}