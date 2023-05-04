import { useState, useEffect } from 'react'

{/*
I had to do all my styling inline because no matter what I did I couldn't get my CSS file to import
I was far too busy with the rest of the app to be able to figure out the CSS problem so I just started doing inline
By the time I was would've been able to figure it out I already had this system worked out and in my opinion it's kind of impressive
*/}

// This is the function I used to set the media queries throughout the app
function IsMobile() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 600px)')

        const handleMediaQueryChange = (event) => {
            setIsMobile(event.matches)
        }

        setIsMobile(mediaQuery.matches)

        mediaQuery.addListener(handleMediaQueryChange)

        return () => {
            mediaQuery.removeListener(handleMediaQueryChange)
        }
    }, [])

    return isMobile
}

export default IsMobile
   
// Button styles

    // Browser
    export const buttonStyles = {
        backgroundColor: 'White',
        border: 'None',
        color: 'black',
        margin: '10px',
        fontSize: '2vw',
        borderRadius: '15px',
        fontWeight: 'bold',
        padding: '10px 20px'
    }

    export const buttonStyles2 = {
        backgroundColor: 'rgb(47, 115, 182)',
        border: 'None',
        color: 'white',
        margin: '10px',
        fontSize: '2vw',
        borderRadius: '15px',
        fontWeight: 'bold',
        padding: '10px 20px'
    }

    // Mobile
    export const buttonStylesM = {
        backgroundColor: 'White',
        border: 'None',
        color: 'black',
        margin: '10px',
        fontSize: '5vw',
        borderRadius: '15px',
        fontWeight: 'bold',
        padding: '10px 20px'
    }

    export const buttonStyles2M = {
        backgroundColor: 'rgb(47, 115, 182)',
        border: 'None',
        color: 'white',
        margin: '10px',
        fontSize: '5vw',
        borderRadius: '15px',
        fontWeight: 'bold',
        padding: '10px 20px'
    }

// Container styles

    // Browser
    export const containerStyles = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'rgb(211, 212, 228)',
        height: '100%',
        padding: '15px'
    }

    export const containerStyles2 = {
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'rgb(211, 212, 228)',
        height: '100%',
        padding: '15px',
        fontSize: '10px'
    }

    // Mobile
    export const containerStyles2M = {
        margin: '10px',
        fontSize: '7px',
    }


// Text styles

    // Browser
    export const fontSizeStyle = {
        fontSize: '1.5vw'
    }

    export const titleStyleTop = {
        width: '30vw',
        backgroundColor: 'rgb(47, 115, 182)',
        paddingLeft: '5vw',
        paddingRight: '12vw',
        paddingTop: '0px',
        paddingBottom: '0px',
        margin: '10vw',
        marginBottom: '0px',
        borderTopRightRadius: '15px',
        borderTopLeftRadius: '15px',
        fontSize: '5vw'
    }

    export const titleStyleBottom = {
        width: '30vw',
        color: 'white',
        backgroundColor: 'rgb(47, 115, 182)',
        paddingLeft: '9vw',
        paddingRight: '8vw',
        paddingBottom: '1vw',
        paddingTop: '0px',
        margin: '10vw',
        marginTop: '0px',
        marginBottom: '1vw',
        borderBottomRightRadius: '15px',
        borderBottomLeftRadius: '15px',
        fontSize: '5vw'
    }

    export const placeHolderStyles = {
        width: '45vw',
        backgroundColor: 'White',
        border: 'None',
        color: 'black',
        margin: '10px',
        fontSize: '2vw',
        borderRadius: '15px',
        fontWeight: 'bold',
        padding: '10px 20px'
    }

    export const h1StyleTop = {
        width: '15vw',
        backgroundColor: 'rgb(47, 115, 182)',
        paddingLeft: '5vw',
        paddingRight: '10vw',
        paddingTop: '0px',
        paddingBottom: '0px',
        margin: '10vw',
        marginBottom: '0px',
        borderTopRightRadius: '15px',
        borderTopLeftRadius: '15px',
        fontSize: '2.5vw'
    }

    export const h1StyleBottom = {
        width: '15vw',
        color: 'white',
        backgroundColor: 'rgb(47, 115, 182)',
        paddingLeft: '9vw',
        paddingRight: '6vw',
        paddingBottom: '1vw',
        paddingTop: '0px',
        margin: '10vw',
        marginTop: '0px',
        marginBottom: '1vw',
        borderBottomRightRadius: '15px',
        borderBottomLeftRadius: '15px',
        fontSize: '2.5vw'
    }

    // Mobile
    export const fontSizeStyleM = {
        fontSize: '5vw'
    }

    export const titleStyleTopM = {
        width: '45vw',
        backgroundColor: 'rgb(47, 115, 182)',
        paddingLeft: '10vw',
        paddingRight: '26vw',
        paddingTop: '0px',
        paddingBottom: '0px',
        margin: '10vw',
        marginBottom: '0px',
        borderTopRightRadius: '15px',
        borderTopLeftRadius: '15px',
        fontSize: '15vw'
    }

    export const titleStyleBottomM = {
        width: '45vw',
        color: 'white',
        backgroundColor: 'rgb(47, 115, 182)',
        paddingLeft: '14vw',
        paddingRight: '22vw',
        paddingBottom: '1vw',
        paddingTop: '0px',
        margin: '10vw',
        marginTop: '0px',
        marginBottom: '10vw',
        borderBottomRightRadius: '15px',
        borderBottomLeftRadius: '15px',
        fontSize: '15vw'
    }


    export const placeHolderStylesM = {
        width: '70vw',
        backgroundColor: 'White',
        border: 'None',
        color: 'black',
        margin: '10px',
        fontSize: '6vw',
        borderRadius: '15px',
        fontWeight: 'bold',
        padding: '10px 20px'
    }

    export const h1StyleTopM = {
        width: '55vw',
        backgroundColor: 'rgb(47, 115, 182)',
        paddingLeft: '6vw',
        paddingRight: '26vw',
        paddingTop: '0px',
        paddingBottom: '0px',
        margin: '10vw',
        marginBottom: '0px',
        borderTopRightRadius: '15px',
        borderTopLeftRadius: '15px',
        fontSize: '9vw'
    }

    export const h1StyleBottomM = {
        width: '55vw',
        color: 'white',
        backgroundColor: 'rgb(47, 115, 182)',
        paddingLeft: '18vw',
        paddingRight: '14vw',
        paddingBottom: '1vw',
        paddingTop: '0px',
        margin: '10vw',
        marginTop: '0px',
        marginBottom: '10vw',
        borderBottomRightRadius: '15px',
        borderBottomLeftRadius: '15px',
        fontSize: '9vw'
    }

// Miscellaneous
export const resultStyles = {
    backgroundColor: 'White',
    border: 'None',
    color: 'black',
    margin: '10px 0px 10px -50px',
    fontSize: '15px',
    borderRadius: '15px',
    fontWeight: 'bold',
    padding: '10px 20px',
    listStyle: 'None'
}

export const listStyles = {
    listStyle: 'None',
    alignItems: 'center',
}

export const letteringStyle = {
    fontWeight: 'bold',
    fontSize: '20px',
}

export const errorStyle = {
    color: 'red',
    fontWeight: 'bold',
    fontSize: '20px',
}

export const spaceStyles = {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
}

export const uploadStyle = {
    fontWeight: 'bold',
    fontSize: '20px',
    borderStyle: 'dashed',
    borderColor: 'rgb(200, 215, 400)',
    backgroundColor: 'white',
    padding: '20px'
}