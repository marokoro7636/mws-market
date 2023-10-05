// https://maku.blog/p/jbv7gox/

import * as React from 'react'
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert'
import { on } from 'events'

/** スナックバーの表示をカスタマイズ */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

/** GlobalSnackbar コンポーネントに渡す props の型情報 */
type NotificationProps = {
    message: string
    severity?: AlertColor
    timeout?: number
    onClose: () => void
}

/** スナックバーを表示するコンポーネント */
const Notification = ({ message, severity = 'info', timeout = 3000, onClose }: NotificationProps) => {
    const [openState, setOpenState] = React.useState<boolean>(true)

    setTimeout(() => {
        setOpenState(false)
        onClose()
    }, timeout)

    return (
        <Snackbar open={openState}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
            <>
                <Alert severity={severity}>{message}</Alert>
                <Alert severity={severity}>{message}</Alert>
            </>
        </Snackbar>
    )
}

let DispatchNotification: (message: string, severity?: AlertColor, timeout?: number) => void

const NotificationDispatcher = () => {
    const [notification, setNotification] = React.useState<NotificationProps | null>(null)

    const onClose = () => {
        setNotification(null)
        console.log(notification)
    }

    const dispatch = (message: string, severity?: AlertColor, timeout?: number) => {
        setNotification({
            message: message, severity: severity, timeout: timeout, onClose: onClose
        })
    }

    DispatchNotification = dispatch
    console.log(notification)

    return (
        <div>
            {notification && <Notification message={notification.message} severity={notification.severity} onClose={onClose} />}
        </div>
    )
}

export {
    Notification,
    NotificationDispatcher,
    DispatchNotification
}
