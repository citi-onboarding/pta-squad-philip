import {ElementType} from "react";

type TypeCard = 'Total de Livros' | 'Empréstimos Ativos' | 'Livros Atrasados'

interface StatCardProps {
    typeCard: TypeCard
    icon: ElementType
    value: string | number
}

const typeCardStyles = {
    'Total de Livros': 'text-[#00C389] bg-[#00C3891A]',
    'Empréstimos Ativos': 'text-[#00C389] bg-[#00C3891A]',
    'Livros Atrasados': 'text-[#EF4444] bg-[#EF44441A]'
}

export function StatCard({typeCard, icon: Icon, value}: StatCardProps){
    return (
        <div className="flex gap-2 p-6 w-[381px] h-[107px] bg-white rounded-lg shadow-md border-solid border-[0.83px] border-slate-200">
            <div className="flex items-center justify-center ">
                <div className={`p-4 rounded-xl ${typeCardStyles[typeCard]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex justify-center items-start flex-col gap-0.5">
                <p className="text-[16px] text-[#717182]">{typeCard}</p>
                <p className="text-[20px]">{value}</p>
            </div>
        </div>
    )
}