import React from 'react'
import Publication from './Publication'

const publications = ( props ) => {

    const publicationElements = () => {
        return props.publications.map( (publication) => <Publication
                key={ publication.doi }
                doi={ publication.doi }
                title={ publication.title }
                date={ publication.date ? cleanDate(publication.date) : null }
                citation={ publication.citation } />
        )
    }

    const noPublicationsMessage = () => {
        return (
            <h2 className="alert" style={{ color: '#ccc', textAlign: 'center' }}>No publications!</h2>
        )
    }

    const cleanDate = ( dateString ) => {
        let theDate = new Date(dateString);
        let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][theDate.getMonth()];
        return month + ' ' + theDate.getFullYear();
    }

    return (
        <div className="publications">
            { props.publications && props.publications.length > 0 ? publicationElements() : noPublicationsMessage() }
        </div>
    )
}

export default publications