import React from 'react'
import Card from '../../components/shared/Card'
import Button from '../../components/shared/Button'
import { Link } from 'react-router-dom'

const Username = () => {
  return (
    <div>
    <Card icon = "phone" title = "Enter your Username" > 
       <div>
       {/* <input type="tel" id="phone" name="phone" placeholder="123-456-7890" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required> */}
          <Link to="/rooms">
            <Button text="Next"/>
          </Link>
       </div>
    </Card>
  </div>
  )
}

export default Username
