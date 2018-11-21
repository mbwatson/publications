import React, { Component } from 'react'
import axios from 'axios'

import { SettingsProvider } from '../contexts/SettingsContext'

import Header from '../components/Header/Header'
import Settings from './Settings/Settings'
import Stage from './Stage/Stage'
import Summary from '../components/Summary/Summary'
import Publications from '../components/Publications/Publications'
import Filters from '../components/Forms/Filters'
import ShowMoreButton from '../components/Forms/ShowMore'
import ShowAllButton from '../components/Forms/ShowAll'

class App extends Component {
    constructor(props) {
        super(props)
        console.log(process.env)
        this.apiUrl = process.env.REACT_APP_API_URL
        // this.apiUrl = 'http://localhost:8000/api/publications/'
        this.state = {
            store: [],
            publications: [],
            visiblePublications: [],
            page: 1,
            perPage: 5,
            queryString: '',
            queryStringLowercase: '',
            queryYear: '',
            queryArray: [],
            filterBy: 'any',
        }
    }
    
    fetchPublications = () => {
        axios.get(this.apiUrl).then(response => {
            if (response.data.length > 0) {
                this.setState({
                    store: response.data,
                    publications: response.data,
                    visiblePublications: response.data.slice(0, this.state.page * this.state.perPage)
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    componentDidMount = () => {
        this.fetchPublications()
    }

    showMoreHandler = () => {
        this.setState({
            page: this.state.page + 1,
        }, this.filterPublications)
    }

    filterPublications = () => {
        let publications = this.state.store
        if (this.state.queryYear !== '') {
            publications = publications.filter(publication => {
                const publicationYear = new Date(publication.date).getFullYear()
                return publicationYear.toString() === this.state.queryYear
            })
        }
        if (this.state.queryStringLowercase !== '') {
            switch (this.state.filterBy) {
                case 'any':
                    publications = publications.filter(publication => {
                        return new RegExp(this.state.queryArray.join("|")).test(publication.title.toLowerCase())
                    })
                    break
                case 'all':
                    publications = publications.filter(publication => {
                        for (let word of this.state.queryArray) {
                            if (!publication.title.toLowerCase().includes(word)) {
                                return false
                            }
                        }
                        return true
                    })
                    break
                case 'exact':
                    publications = publications.filter(publication => {
                        return publication.title.toLowerCase().includes(this.state.queryStringLowercase)
                            || publication.doi.toLowerCase().includes(this.state.queryStringLowercase)
                    })
                    break
                default:
                    break
            }
        }
        this.setState({
            publications: publications,
            visiblePublications: publications.slice(0, this.state.perPage * this.state.page),
        })
    }

    changeQueryStringHandler = (event) => {
        event.preventDefault()
        const tempString = event.target.value
        let tempArray = tempString.match(/\S+/g) || []
        tempArray = tempArray.map( str => str.toLowerCase())
        this.setState({
            queryString: tempString,
            queryArray: tempArray,
            queryStringLowercase: tempString.toLowerCase(),
        }, this.filterPublications)
    }

    changeQueryYearHandler = (event) => {
        event.preventDefault()
        this.setState({
            queryYear: event.target.value
        }, this.filterPublications)
    }
    
    clearQueryHandler = () => {
        this.setState({
            queryString: '',
            queryArray: [],
        }, this.filterPublications)
    }

    comparePublicationDates = (p, q) => {
        const date1 = new Date(p.date)
        const date2 = new Date(q.date)
        return (date1 - date2)
    }
    
    confirmPublicationHandler = (publication) => {
        this.setState({
            store: this.state.store.concat([ publication ])
        }, this.filterPublications)
    }
    
    saveSettingsHandler = ( newFilterBy ) => {
        this.setState({
            filterBy: newFilterBy
        }, this.filterPublications)
    }

    showAllHandler = () => {
        this.setState({
            page: Math.floor(this.state.publications.length / this.state.perPage) + 1,
        }, this.filterPublications)
    }

    showMoreHandler = () => {
        this.setState({
            page: this.state.page + 1,
        }, this.filterPublications)
    }

    render() {
        return (
            <SettingsProvider value={{
                filterBy: this.state.filterBy,
                saveSettings: this.saveSettingsHandler,
            }}>
                <div className="App">
                    <Header title="RENCI Publications">
                        <Settings saveSettings={ this.saveSettingsHandler } />
                        <Stage
                            newPublicationEvent={ this.confirmPublicationHandler }
                            allDois={ this.state.store.map( publication => publication.doi ) }
                            apiUrl={ this.apiUrl }
                        />
                    </Header>
                    <main>
                        <Filters
                            queryString={ this.state.queryString }
                            queryYear={ this.state.queryYear }
                            updateQueryStringInput= {this.changeQueryStringHandler }
                            updateQueryYearSelect= {this.changeQueryYearHandler }
                            clearQuery= {this.clearQueryHandler }
                        />
                        <Summary
                            visibleCount={ this.state.visiblePublications.length }
                            listedCount={ this.state.publications.length }
                            totalCount={ this.state.store.length }
                        />
                        <Publications publications={ this.state.visiblePublications } />
                        {
                            <div className="moreButtons">
                                <ShowAllButton
                                    showAll={ this.showAllHandler }
                                    disabled={ this.state.visiblePublications.length === this.state.publications.length }
                                    count={ this.state.publications.length }
                                />
                                <ShowMoreButton
                                    showMore={ this.showMoreHandler }
                                    disabled={ this.state.visiblePublications.length === this.state.publications.length }
                                    perPage={
                                        Math.min(3, this.state.publications.length - this.state.visiblePublications.length)
                                    }
                                />
                            </div>
                        }
                    </main>
                </div>
            </SettingsProvider>
        );
    }
}

export default App