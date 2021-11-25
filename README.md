# patternfly-kafkareact-notifications
This library is custom react context for handling real time messaging over secured and unsecured `websocket` protocol between `ReactJS` and 
any given ` Apache Kafka` instances. For it to function its advised to use <a href="https://www.patternfly.org/">Patternfly 4</a> as 
css base framework. It could still be installed on other existing frameworks but would be creating and extra layer css framework on top of another.


#### Installation 

`npm -i patternfly-kafkareact-notifications --save`

or

`yarn add patternfly-kafkareact-notifications`

<table style="margin: 50px auto;border:0;">
  <tr style="border:0;">
    <td style="border:0;"><img alt="patternfly" height="200" width="200" src="https://pbs.twimg.com/profile_images/1248314779812294656/DKsPlKdl.png"/></td>
    <td style="border:0;"><img alt="react" height="200" width="200" src="https://mildaintrainings.com/wp-content/uploads/2017/11/react-logo.png"/></td>
    <td style="border:0;"><img alt="kafka" height="200" width="200" src="https://www.indellient.com/wp-content/uploads/2020/10/20201021_Introduction-to-Apache-Kafka_BLOG-FEATURED-IMAGE.jpg"/></td>
  </tr>
 </table>

This is a custom react context component, to be used as an exchange point between Kafka
and any given react application. In order for this to work, it is required that the context 
be placed as a canopy to the component that will be consuming incoming messages.
Ensure that your application is using <b>React + Typescript</b>.

        - @patternfly/react-core
        - @patternfly/react-icons
        - websocket && @types/websocket
        - momentjs && @types/momentjs 

Install dependencies:
#### With Yarn
``` yarn add @patternfly/react-core @patternfly/react-icons websocket @types/websocket momentjs @types/momentjs```

#### With npm
``` npm install @patternfly/react-core @patternfly/react-icons websocket @types/websocket momentjs @types/momentjs --save```

#### Implementation
Once that is done, in order to start receiving messages from Kafka backend, it is required to pass in
a couple of props. 

- <b>lang</b>: This component property will be the indicative of the preferred language by default its english, for the 
moment you can choose between en and french <b>"en"</b> | <b>"fr"</b>
  
- <b>uri</b>: Expect web socket uri to connect to, channel where incoming messages will be streaming in through.
  
- <b>isDrawer</b>: this property is called when expected view chosen should be a drawer or list of pop ups. By default, the property is 
set to false if not included in the component.
  
- <b>appMessagesLocation</b>: This is an optional link property, in case a view or page is created listing out all messages in the main app
pass in the link into this parameter it will display the see all messages. If clicked on the browser would redirect to the given link.
  
#### Implementationkafka_sockets

- In your `App.jsx` or preferred child component of choice add the following:

```
    import {KafkaWSSContext} from "patternfly-kafkareact-notifications";
    import {NotificationBadge} from "@patternfly/react-core";
    
    const {
        wss,
        setWss,
        isOpenDrawer,
        setIsOpenDrawer
    } = useContext(KafkaWSSContext);
    
    
    const countUnread = () => {
        const messagesCount = wss.messages.filter((message) => message["is_read"] === false)
        const notificationCount = wss.notifications.filter((notification) => notification["is_read"] === false)
        return messagesCount.length + notificationCount.length
    }
    
    useEffect(() => {
        const temp = {
            messages: [],
            notifications: [ { "sender": "Sam Smith","receiver": "public@bara.ca", "message": "this is a test from kafka-web-proxy", "date": "1 juin 2021 09:39", "type": "danger", "variant": "message", "is_read": true }, { "sender": "Sam Smith","receiver": "public@bara.ca", "message": "this is a test from kafka-web-proxy", "date": "1 juin 2021 09:39", "type": "success", "variant": "message", "is_read": true }, { "sender": "Sam Smith","receiver": "public@bara.ca", "message": "this is a test from kafka-web-proxy", "date": "1 juin 2021 09:38", "type": "info", "variant": "message", "is_read": false }, { "sender": "Sam Smith","receiver": "public@bara.ca", "message": "this is a test from kafka-web-proxy", "date": "1 juin 2021 09:38", "type": "info", "variant": "message", "is_read": false }, { "sender": "Sam Smith","receiver": "public@bara.ca", "message": "this is a test from kafka-web-proxy", "date": "1 juin 2021 09:35", "type": "info", "variant": "message", "is_read": true } ]
        }
        setWss(temp)
        // eslint-disable-next-line
    }, [])
    
    
    <NotificationBadge
        variant={countUnread() > 0 ? "unread" : "read"}
        onClick={() => setIsOpenDrawer(!isOpenDrawer)}
        style={{ backgroundColor : '#555', color : '#fff' }}
        aria-label="messages-notifications"
        count={countUnread()}
    />
```

 - Create a `patternfly-kafkareact-notifications.css`, the name is no specific. Add the following content to the file,
and import this file in your `index.tsx` or parent directory where needed.
   
```
.prkw-container {
    position: absolute;
    height: 100vh;
    right: 0;
    padding: 10px;
    width: 40%;
    overflow: hidden;
    z-index: 3;
}

.prkw-alert {
    width: 100%;
    right: 4px;
    margin-top: 8px;
    float: right;
    overflow: hidden;
    padding: 1rem;
    height: 140px;
    text-overflow: ellipsis;
}

.prkw-drawer {
    position: fixed;
    height: 100vh;
    right: 0;
    width: 40%;
    overflow: hidden;
    z-index: 2;
    box-shadow: 0 5px 7px 6px rgba(0,0,0,0.15);
}

@media screen and (max-width: 991px) {
    .prkw-container {
        width: 100%;
        box-shadow: none;
    }
    .prkw-drawer {
        width: 100%;
    }
}

```

 - In your `index.jsx` or parent component of choice add the following:
````
   
  import './patternfly-kafkareact-notifications.css';  
  import KafkaWssNotifications from 'patternfly-kafkareact-notifications';
    
  const clientId = "xxxxxxx"
  const topic = "xxxxxxx"

  <KafkaWssNotifications
        isDrawer * Optional
        lang={"fr"} * Mandatory
        uri={`wss://xxxxxxxxxx.com/socket/out?clientId=${clientId}&topic=${topic}&valType=json`} * Mandatory
        appMessagesLocation={"https://google.com"} * Optional
    >
        <App/>
    </KafkaWssNotifications>
    
````

#### Expected backend payload
When sending a json payload from your backend, through the following link
send as request the frame below:

        - LINK: wscat  -c "wss://xxxxxx.xxx/socket/in?clientId=clickid&topic=clickid-preproduction&valType=json"
        - Request Payload:
            { "value": { "value": {"type":"info", "variant":"message", "sender": "Sam Smith","receiver": "public@bara.ca", "message":"this is a test from kafka-web-proxy"}, "format": "json" } }

There are two variant types: <b>notification</b> and <b>message</b>, if a request payload does not contain one of the two,
the response will bo be included in the list of messages. So the parameter <b>variant</b> is important.
Also, as request payload it will be required to provide either <b>success</b>, <b>danger</b> or <b>info</b>
for the card to be differentiated base on their colors.

    - varaint: notification | message   
    - types:  info | danger | success
    - message: string
    - sender: string
    - receiver: string
    - format: string | json


