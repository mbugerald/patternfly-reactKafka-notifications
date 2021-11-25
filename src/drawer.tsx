import React, {ComponentState, FC, Fragment, useState} from 'react';
import {
    Dropdown,
    DropdownItem,
    DropdownPosition,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateVariant,
    KebabToggle,
    NotificationDrawer,
    NotificationDrawerBody,
    NotificationDrawerGroup,
    NotificationDrawerGroupList,
    NotificationDrawerHeader,
    NotificationDrawerList,
    NotificationDrawerListItem,
    NotificationDrawerListItemBody,
    NotificationDrawerListItemHeader,
    Title
} from '@patternfly/react-core';
import {BellIcon, EnvelopeIcon, EnvelopeOpenIcon, ExclamationTriangleIcon, InfoIcon} from '@patternfly/react-icons';

type globals = {
    sender: string
    message: string
    date: string
    type: "default" | "success" | "danger" | "warning" | "info" | undefined
    variant: string
    is_read: boolean
}

interface Props {
    messages: globals[]
    notifications: globals[]
    lang: string
    toggleReadNotification: ComponentState,
    toggleReadMessage: ComponentState,
    toggleDrawer: ComponentState,
    markAllAsRead: ComponentState,
    appMessagesLocation?: string,
}

const KafkaWSSDrawer:FC<Props> = ({
    messages,
    notifications,
    lang,
    toggleReadNotification,
    toggleReadMessage,
    toggleDrawer,
    markAllAsRead,
    appMessagesLocation
}) => {

    const [ isOpenMap, setIsOpenMap ] = useState<any>(null)
    const [ firstGroupExpanded, setFirstGroupExpanded ] = useState<boolean>(false)
    const [ secondGroupExpanded, setSecondGroupExpanded ] = useState<boolean>(false)

    const onToggle = (id: string, isOpen: boolean) => {
        setIsOpenMap({ [id] : isOpen });
    }

    const onSelect = () => {
        setIsOpenMap(null)
    }

    const toggleFirstDrawer = (_event: any, value: boolean | ((prevState: boolean) => boolean)) => {
        setFirstGroupExpanded(value)
    }

    const toggleSecondDrawer = (_event: any, value: boolean | ((prevState: boolean) => boolean)) => {
        setSecondGroupExpanded(value)
    }

    const dropdownItems = [
        <Fragment key="link">
            {appMessagesLocation &&
            <DropdownItem key="link_child" href={appMessagesLocation}>
                {(!lang || lang === "en") ? "See all" : "Voir tout"}
            </DropdownItem>}
        </Fragment>,
        <DropdownItem key="mark_as_read" onClick={() => markAllAsRead()}>
            {(!lang || lang === "en") ? "Mark all as read" : "Marquer tous comme lu"}
        </DropdownItem>

    ];

    const countUnread = () => {
        const messagesCount = messages.filter((message) => !message.is_read)
        const notificationCount = notifications.filter((notification) => !notification.is_read)
        return messagesCount.length + notificationCount.length
    }

    const countUnreadNotifications = () => {
        const notificationCount = notifications.filter((notification) => !notification.is_read)
        return notificationCount.length
    }

    const countUnreadMessages = () => {
        const messagesCount = messages.filter((message) => !message.is_read)
        return messagesCount.length
    }

    const toggleNotificationIcon = (type: string | undefined) => {
        switch (type) {
            case "info":
                return <InfoIcon/>
            case "danger":
                return <ExclamationTriangleIcon/>
            default:
                return <BellIcon/>
        }
    }

    return (
        <Fragment>
            <div className="prkw-drawer">
                <NotificationDrawer>
                    <NotificationDrawerHeader
                        count={countUnread()}
                        unreadText={(!lang || lang === "en") ? " unread" : " non lu"}
                        onClose={toggleDrawer}
                    >
                        <Dropdown
                            onSelect={onSelect}
                            toggle={<KebabToggle onToggle={isOpen => onToggle('toggle-id-0', isOpen)}
                                                 id="toggle-id-0"/>}
                            isOpen={isOpenMap && isOpenMap['toggle-id-0']}
                            isPlain
                            dropdownItems={dropdownItems}
                            id="notification-0"
                            position={DropdownPosition.right}
                        />
                    </NotificationDrawerHeader>
                    <NotificationDrawerBody>
                        <NotificationDrawerGroupList>
                            <NotificationDrawerGroup
                                title={"Notifications"}
                                isExpanded={secondGroupExpanded}
                                count={notifications.length}
                                isRead={countUnreadNotifications() <= 0}
                                onExpand={toggleSecondDrawer}
                            >
                                {notifications.length <= 0 &&
                                <NotificationDrawerList isHidden={!secondGroupExpanded}>
                                    <EmptyState variant={EmptyStateVariant.full}>
                                        <EmptyStateIcon icon={BellIcon}/>
                                        <Title headingLevel="h2" size="lg">
                                            {(!lang || lang === "en") ? "No notifications" : "Aucune notification"}
                                        </Title>
                                        <EmptyStateBody>
                                            {(!lang || lang === "en") ?
                                                "There are currently no notifications alerts for you at the moment." :
                                                "Il n'y a actuellement aucune alerte de notification pour vous à l'instant."}
                                        </EmptyStateBody>
                                    </EmptyState>
                                </NotificationDrawerList>}
                                <NotificationDrawerList isHidden={!secondGroupExpanded}>
                                    {notifications.map((notification, idx) =>
                                        <NotificationDrawerListItem
                                            key={idx}
                                            variant={notification.type}
                                            isRead={notification.is_read}
                                            onClick={() => toggleReadNotification(idx)}
                                        >
                                            <NotificationDrawerListItemHeader
                                                variant={notification.type}
                                                icon={toggleNotificationIcon(notification.type)}
                                                title={notification.sender}
                                                srTitle={notification.message}
                                            />
                                            <NotificationDrawerListItemBody timestamp={notification.date}>
                                                {notification.message}
                                            </NotificationDrawerListItemBody>
                                        </NotificationDrawerListItem>)}
                                </NotificationDrawerList>
                            </NotificationDrawerGroup>
                            <NotificationDrawerGroup
                                title={"Messages"}
                                isExpanded={firstGroupExpanded}
                                count={messages.length}
                                isRead={countUnreadMessages() <= 0}
                                onExpand={toggleFirstDrawer}
                            >
                                {messages.length <= 0 &&
                                <NotificationDrawerList isHidden={!firstGroupExpanded}>
                                    <EmptyState variant={EmptyStateVariant.full}>
                                        <EmptyStateIcon icon={EnvelopeIcon}/>
                                        <Title headingLevel="h2" size="lg">
                                            {(!lang || lang === "en") ? "No messages" : "Aucune message"}
                                        </Title>
                                        <EmptyStateBody>
                                            {(!lang || lang === "en") ?
                                                "There are currently no messages alerts for you at the moment." :
                                                "Il n'y a actuellement aucune alerte de message pour vous à l'instant."}
                                        </EmptyStateBody>
                                    </EmptyState>
                                </NotificationDrawerList>}
                                <NotificationDrawerList isHidden={!firstGroupExpanded}>
                                    {messages.map((message, idx) =>
                                        <NotificationDrawerListItem
                                            key={idx}
                                            variant={message.type}
                                            isRead={message.is_read}
                                            onClick={() => toggleReadMessage(idx)}
                                        >
                                            <NotificationDrawerListItemHeader
                                                variant={message.type}
                                                title={message.sender}
                                                icon={message.is_read ? <EnvelopeOpenIcon/> : <EnvelopeIcon/>}
                                                srTitle={message.message}
                                            />
                                            <NotificationDrawerListItemBody timestamp={message.date}>
                                                {message.message}
                                            </NotificationDrawerListItemBody>
                                        </NotificationDrawerListItem>)}
                                </NotificationDrawerList>
                            </NotificationDrawerGroup>
                        </NotificationDrawerGroupList>
                    </NotificationDrawerBody>
                </NotificationDrawer>
            </div>
        </Fragment>
    )
}

export default KafkaWSSDrawer;
