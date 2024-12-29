interface SidebarItemProps {
    title: string
    icon: React.ReactNode
}

export function SidebarItem ({
    title,
    icon
}: SidebarItemProps) {
    return(
        <div className="flex items-center gap-2 p-2">
            {icon}
            <span>{title}</span>    
        </div>
    )
}