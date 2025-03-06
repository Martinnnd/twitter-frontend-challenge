import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import Toast, {ToastProps} from "../components/toast/Toast";

const ToastContext = createContext<((toast: ToastProps) => void )>(() => {})

export default ToastContext;

export const ToastContextProvider = ({children}: {children: ReactNode}) => {
    const [toasts, setToasts] = useState<ToastProps[]>([])

    useEffect(() => {
        if(toasts.length > 0) {
            const timeOut = setTimeout(() => {
                setToasts(toasts.slice(1))
            }, 5000)
            return () => clearTimeout(timeOut)
        }
}, [toasts])

const addToast = useCallback((toast: ToastProps) => {
    setToasts(toasts => [...toasts, toast])
}, [setToasts])

    return (
        <ToastContext.Provider value={addToast}>
            {children}
            {toasts.map((toast, index) => (
                <Toast key={index} {...toast} />
            ))}
        </ToastContext.Provider>
    )

}


