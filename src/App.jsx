import { useState, useEffect } from 'react' // Import useEffect
import './App.css'
function App() {
  const [allCards, setAllCards] = useState(null) // New state for all cards
  const [card, setCard] = useState(null) // State for the current card
  const [bannedAttributes, setBannedAttributes] = useState([])
  const [isLoading, setIsLoading] = useState(true) // New state for loading

  // ** 1. Fetch ALL cards ONCE on component mount **
  useEffect(() => {
    async function initialFetch() {
      try {
        const response = await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?name=Dark Magician') // Fetch all cards
        const data = await response.json() // Parse JSON
        setAllCards(data.data) // Store the full list of cards
        setIsLoading(false) // Set loading to false once data is fetched
      } catch (error) { // Error handling
        console.error('Error fetching initial card data:', error) // Log any errors
        setIsLoading(false) // Even on error, stop loading
      }
    }
    initialFetch()
  }, []) // Empty dependency array ensures this runs only once

  // ** 2. Modified fetchCard function to use allCards state **
  function fetchCard() {
    if (!allCards) return // Prevent function from running if data hasn't loaded yet

    let randomCard
    do {
      randomCard = allCards[Math.floor(Math.random() * allCards.length)] // Pick random card from state
    } while (bannedAttributes.includes(randomCard.attribute)) // Re-pick if attribute is banned

    setCard(randomCard)
  }
  // Toggle ban status of an attribute
  function toggleBan(attribute) {
    if (!attribute) return
    if (bannedAttributes.includes(attribute)) {
      // remove it
      setBannedAttributes(bannedAttributes.filter(attr => attr !== attribute))
    } else {
      // add it
      setBannedAttributes([...bannedAttributes, attribute])
    }
  }
  
  // ** 3. Conditional rendering based on loading state **
  if (isLoading) {
    return <div className='app-container'><h1>Loading Yu-Gi-Oh! Card Data...</h1></div> // Show loading message
  }
// ** 4. Main render **
  return (
    <div className='app-container'>
      <div className='main'></div>
      <div className='box'></div>
      <h1> Ultimate Yu-Gi-Oh! Cards Info</h1>
      <button onClick={fetchCard}>Fetch Random Card</button>

      {/* Display Card Info */}
      {card && (
        <div> 
          <h2>{card.name}</h2>
          <img height={200} src={card.card_images[0].image_url} alt={card.name} />
          <p><strong>Type:</strong> {card.type}</p>
          <p><strong>Race:</strong> {card.race}</p>
          <p><strong>ATK:</strong> {card.atk}</p>
          <p><strong>DEF:</strong> {card.def}</p> 
          <p><strong>Level:</strong> {card.level}</p> 
          <p>{card.desc}</p>

          <p>
            <strong>Attribute:</strong>{' '} 
            <span 
              onClick={() => toggleBan(card.attribute)} // Click to toggle ban
              style={{
                cursor: 'pointer',
                color: bannedAttributes.includes(card.attribute) ? 'red' : 'black', // Change color if banned
                textDecoration: 'underline', // Indicate it's clickable
              }}
            >
              {card.attribute || 'None'} 
            </span>
          </p>
        </div>
      )}

      {/* Display Banned Attributes */}
      <div>
        <h3>Banned Attributes:</h3>
        {bannedAttributes.length > 0 ? ( // Conditional rendering
          <ul>
            {bannedAttributes.map(attr => (
              <li key={attr} style={{ color: 'blue', textDecoration: 'line-through' }}> 
                {attr}
              </li>
            ))}
          </ul>
        ) : 
          <p>None</p>
        }
      </div>
    </div>
  )
}

export default App