type ButtonVariant = 'default' | 'outline' | 'ghost' | 'link'

export interface ButtonProps {
    variant: ButtonVariant
    size: 'sm' | 'md' | 'lg'
    text: string
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
    onClick?: () => void
    children?: React.ReactNode
    type?: 'button' | 'submit' | 'reset'
}



const variantStyles: Record<ButtonVariant, string> = {
    "default": "bg-purple-600 hover:bg-purple-500 text-white",
    "outline": "bg-transparent hover:bg-purple-100 text-purple-600 border border-purple-600 hover:text-black",
    "ghost": "bg-transparent hover:bg-purple-100 text-purple-600 hover:text-purple-500",
    "link": "bg-transparent text-purple-600 hover:bg-transparent hover:text-purple-500 underline"
}

const defaultSizeStyles = "py-2 px-4 rounded-md"

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
    "sm": "text-sm",
    "md": "",
    "lg": "py-3 px-5 text-lg"
}



export const ButtonLater = ({ variant, size, text, startIcon, endIcon, onClick }: ButtonProps) => {



    return (
        <button className={`${variantStyles[variant]} ${defaultSizeStyles} ${sizeStyles[size]} flex items-center gap-2`}>
            {startIcon}
            {text}
            {endIcon}
        </button>
    )
}