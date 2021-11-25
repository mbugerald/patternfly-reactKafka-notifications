import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import KafkaWssNotifications  from '../dist';

const clientId = "clickid"
const topic = "clickid-preproduction"

const App = () => {
  return (
    <div>
        <KafkaWssNotifications
            isDrawer
            lang={"fr"}
            uri={`wss://kafka-websocket-proxy.gcloud.bara.ca/socket/out?clientId=${clientId}&topic=${topic}&valType=json`}
            appMessagesLocation={"https://google.com"}
        >
            <App/>
        </KafkaWssNotifications>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
