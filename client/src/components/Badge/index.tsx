type StatusType = 'Em andamento' | 'Devolvido' | 'Atrasado'

interface BadgeProps {
    status: StatusType
}

const statusStyles = {
    'Em andamento': 'bg-[#FEF9C2] border-[#FFDF20] text-[#A65F00]',
    'Devolvido': 'bg-[#00C38933] border-[#00C3894D] text-[#00C389]',
    'Atrasado': 'bg-[#EF444433] border-[#EF44444D] text-[#EF4444]'
}

export function Badge({status}: BadgeProps){
    return (
        <div className={`px-2 py-1 rounded-2xl border-solid border-[0.83px] text-[14px] ${statusStyles[status]}`}>
            {status}
        </div>
    )
}