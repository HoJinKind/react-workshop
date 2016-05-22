import React from 'react';
import 'whatwg-fetch';

import EmailList from '../components/EmailList';
import EmailView from '../components/EmailView';
import EmailForm from '../components/EmailForm';

export default class EmailApp extends React.Component {
    static propTypes = {
        pollInterval: React.PropTypes.number
    }

    static defaultProps = {
        pollInterval: 2000
    }

    state = {
        emails: []
    }

    componentDidMount() {
        // Retrieve emails from server once we know DOM exists
        this._getUpdateEmails();

        // Set up long-polling to continuously get new data
        this._pollId = setInterval(
            () => this._getUpdateEmails(),
            this.props.pollInterval
        );
    }

    componentWillUnmount() {
        // Need to remember to clearInterval when the component gets
        // removed from the DOM, otherwise the interval will keep going
        // forever and leak memory
        clearInterval(this._pollId);
    }

    _getUpdateEmails() {
        return fetch('http://localhost:9090/emails')
            .then((res) => res.json())
            .then((emails) => this.setState({emails}))
            .catch((ex) => console.error(ex));
    }

    render() {
        let {emails} = this.state;

        return (
            <main>
                <EmailList emails={emails} />
                <EmailView />
                <EmailForm />
            </main>
        );
    }
}
