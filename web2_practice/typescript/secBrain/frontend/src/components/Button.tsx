interface ButtonProps {
    variant: 'primary' | 'secondary'
    text: string
    startIcon?: React.ReactNode
    onClick?: () => void
}

const variantClasses = {
    'primary': 'bg-purple-600 hover:bg-purple-500 hover:text-purple-600',
    'secondary': 'bg-purple-200 text-purple-600 hover:bg-purple-600 hover:text-white'
}

const defaultSizeClasses = 'py-2 px-4 rounded-md flex gap-x-2 items-center'

export const Button = ({variant, text, startIcon, onClick}: ButtonProps) => {
    return (
        <button onClick={onClick} className={variantClasses[variant] + ' ' + defaultSizeClasses}>
            {startIcon}
            {text}
        </button>
    )
}