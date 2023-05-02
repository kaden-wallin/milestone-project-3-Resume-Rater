import { useState, useEffect } from 'react'

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

// Container styles
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

// Text styles

// Browser
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

// Mobile
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
  
export const commentStyle = {
    fontSize: '3em',
    width: '300px',
    textAlign: 'left',
    backgroundColor: 'rgb(47, 115, 182)',
    padding: '15px',
    paddingBottom: '0px',
    paddingLeft: '100px',
    margin: '10px',
    marginBottom: '0px',
    borderTopRightRadius: '15px',
    borderTopLeftRadius: '15px',
}

export const ratingStyle = {
    fontSize: '3em',
    width: '300px',
    textAlign: 'right',
    color: 'white',
    backgroundColor: 'rgb(47, 115, 182)',
    padding: '15px',
    paddingTop: '0px',
    paddingRight: '100px',
    margin: '10px',
    marginTop: '0px',
    borderBottomRightRadius: '15px',
    borderBottomLeftRadius: '15px',
}

export const docxStyle = {
    margin: '10px',
    fontSize: '7px',
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