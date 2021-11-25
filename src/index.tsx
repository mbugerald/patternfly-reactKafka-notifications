import React, {createContext, FC, Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, AlertActionCloseButton, Text} from '@patternfly/react-core';
import {w3cwebsocket} from 'websocket';
import 'moment/locale/fr';
import {EnvelopeIcon, InfoIcon, WarningTriangleIcon} from '@patternfly/react-icons';
import GroupNotificationDrawer from './drawer';

export const KafkaWSSContext = createContext<any>(null);

interface Props {
    isDrawer?: boolean
    uri: string
    lang: "en" | "fr"
    appMessagesLocation?: string
}

type globals = {
    sender: string
    message: string
    date: string
    type: "default" | "success" | "danger" | "warning" | "info" | undefined
    variant: string
    is_read: boolean
}

type Messages = {
    messages: globals[]
    notifications: globals[]
}

let moment = require('moment');

const KafkaWssNotifications:FC<Props> = ({
     lang,
     uri,
     isDrawer,
     appMessagesLocation,
     children
 }) => {

    const [ wss, setWss ] = useState<Messages>({
        messages: [],
        notifications: []
    });

    const [ client, setClient ] = useState<any>(undefined);
    const [ err, setError ] = useState<string|null>(null);
    const [ isOpenDrawer, setIsOpenDrawer ] = useState<boolean>(false);
    const [ drawer, setDrawer ] = useState<boolean>(false);

    const store = useMemo(() => ({
        isOpenDrawer,
        setIsOpenDrawer,
        wss,
        setWss
    }), [
        isOpenDrawer,
        setIsOpenDrawer,
        wss,
        setWss
    ]);

    const initClient = useCallback(() => {
        const ws = new w3cwebsocket(uri)
        setClient(ws)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        initClient()
    }, [ initClient ])

    useEffect(() => {
        if (client) {
            processIncoming()
        }
        // eslint-disable-next-line
    }, [ client ])

    useEffect(() => {
        if(isDrawer) {
            setDrawer(true)
        } else {
            setDrawer(false)
        }
    }, [ isDrawer ])

    const closeMessage = (idx: number) => {
        const temp: Messages = { ...wss };
        temp.messages.splice(idx, 1)
        setWss(temp)
    }

    const processIncoming = () => {
        client.onerror = () => {setError("Connection Error reconnecting...")};
        client.onopen = () => {
            console.log('WebSocket Client Connected');

            function sendNumber() {
                if (client.readyState === client.OPEN) {
                    const number = Math.round(Math.random() * 0xFFFFFF);
                    client.send(number.toString());
                    setTimeout(sendNumber, 1000);
                }
            }
            sendNumber();
        };
        client.onmessage = (e: { data: string; }) => {
            moment.locale(lang)
            const response = JSON.parse(e.data);
            const temp = {...wss};
            const content = {
                sender: response.value?.value.sender,
                receiver: response.value?.value.receiver,
                message: response.value?.value.message,
                date: moment(response.timestamp).format("LLL"),
                type: response.value?.value.type,
                variant: response.value?.value.variant,
                is_read: false
            };
            switch (content.variant) {
                case "message":
                    isDrawer?temp.messages.unshift(content):temp.messages.push(content)
                    setWss(temp)
                    break
                default:
                    isDrawer?temp.notifications.unshift(content):temp.notifications.push(content)
                    setWss(temp)
            }
        };
    }

    const markAllAsRead = useCallback(() => {
        const temp = {...wss}
        const messages = temp.messages
        const notifications = temp.notifications
        // eslint-disable-next-line array-callback-return
        messages.map((message) => {
            if (!message.is_read)
                message.is_read = true
        })
        // eslint-disable-next-line array-callback-return
        notifications.map((notification) => {
            if (!notification.is_read)
                notification.is_read = true
        })
        setWss(temp)
    }, [wss])

    const processMessageIcons = (type: string|undefined) => {
        switch (type) {
            case "info":
                return <InfoIcon/>
            case "danger":
                return <WarningTriangleIcon/>
            case "success":
                return <EnvelopeIcon/>
            default:
                return <EnvelopeIcon/>
        }
    }

    const toggleReadMessage = useCallback((idx) => {
        const temp = {...wss};
        const message = temp.messages[idx];
        message.is_read = true
        setWss(temp)
    }, [wss])

    const toggleReadNotification = useCallback((idx) => {
        const temp = {...wss};
        const notification = temp.notifications[idx];
        notification.is_read = true
        setWss(temp)
    }, [wss])

    const toggleDrawer = useCallback(() => {
        setIsOpenDrawer(!isOpenDrawer)
        // eslint-disable-next-line
    }, [isOpenDrawer])

    return (
        <KafkaWSSContext.Provider value={store}>
            <Fragment>
                {err && <Alert isInline variant={"danger"} timeout={5000} title={err}/>}
                {(drawer && isOpenDrawer) &&
                <GroupNotificationDrawer
                    messages={wss.messages}
                    notifications={wss.notifications}
                    lang={lang}
                    toggleReadMessage={toggleReadMessage}
                    toggleReadNotification={toggleReadNotification}
                    toggleDrawer={toggleDrawer}
                    markAllAsRead={markAllAsRead}
                    appMessagesLocation={appMessagesLocation}
                />}
                {!drawer &&
                <div className="prkw-container">
                    {wss.messages.length > 0 && wss.messages.map((message, idx) =>
                        <Alert
                            key={idx}
                            className="prkw-alert"
                            variant={message.type}
                            customIcon={processMessageIcons(message.type)}
                            timeout={8000}
                            title={message.sender ? message.sender: "NAN"}
                            actionClose={<AlertActionCloseButton onClose={() => closeMessage(idx)}/>}
                        >
                            <Text>{message.date}</Text>
                            <Text>{message.message.substring(0, 150) + " ..."}</Text>
                            {appMessagesLocation && <a href={appMessagesLocation}>More...</a>}
                        </Alert>)}
                </div>}
                {children}
            </Fragment>
        </KafkaWSSContext.Provider>
    )
}

export default KafkaWssNotifications;
