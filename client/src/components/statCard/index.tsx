import {ElementType} from "react";
//
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

    const shortLabels = {
        'Total de Livros': 'Livros',
        'Empréstimos Ativos': 'Emp. Ativos',
        'Livros Atrasados': 'Atrasados'
    }

    return (
        <div className="flex gap-2 p-2 sm:p-3 lg:p-6 w-full h-[87px] sm:h-[97px] md:h-[107px] bg-white rounded-lg shadow-md border-solid border-[0.83px] border-slate-200">
            <div className="flex items-center justify-center ">
                <div className={`p-2 md:p-3 lg:p-4 rounded-xl ${typeCardStyles[typeCard]}`}>
                    <Icon className="w-3 h-3 lg:w-5 lg:h-5" />
                </div>
            </div>
            <div className="flex justify-center items-start flex-col gap-0.5">
                <p className="block text-[12px] sm:hidden text-[#717182]">{shortLabels[typeCard]}</p>
                <p className="hidden sm:block sm:text-[12px] lg:text-[14px] xl:text-[16px] text-[#717182]">{typeCard}</p>
                <p className="text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px]">{value}</p>
            </div>
        </div>
    )
}