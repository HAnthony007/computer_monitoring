import React from "react"
import { User } from "../data/schema"

type UsersDialogType = 'add' | 'edit' | 'delete'

interface UsersContextType {
    open: UsersDialogType | null
    setOpen: (str: UsersDialogType | null) => void
    currentRow: User | null
    setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
}

const UsersContext = React.createContext<UsersContextType | null>(null)

interface Props {
    children: React.ReactNode
}

export default function UsersProvider({ children }: Props) {
    const [open, setOpen] = React.useState<UsersDialogType | null>(null)
    const [currentRow, setCurrentRow] = React.useState<User | null>(null)
    return (
        <UsersContext value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </UsersContext>
    )
}

export const useUsers = () => {
    const userContext = React.useContext(UsersContext)

    if (!userContext) {
        throw new Error("useUsers must be used within <UsersContext>")
    }

    return userContext
}