import React, { Component } from 'react'
import axios from 'axios'

export const LibraryContext = React.createContext()

export class LibraryProvider extends Component {
    state = {
        store: []
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/publications/').then(response => {
            console.log(response)
            if (response.data.length > 0) {
                console.log('we got publications!')
                let sortedPublications = response.data.sort(this.comparePublicationDates)
                this.setState({
                    store: sortedPublications,
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    render() {
        return (
            <LibraryContext.Provider value={ this.state }>
                { this.props.children }
            </LibraryContext.Provider>
        )
    }
}
